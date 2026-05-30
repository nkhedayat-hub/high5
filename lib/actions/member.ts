"use server";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/auth";
import { memberSchema, planSchema } from "@/lib/validations/member";
import { applyReferralDiscount, calculateLoyaltyPoints, calculateLoyaltyTier, deductSession, generateMemberCode, generateReferralCode } from "@/lib/business";

export async function createMemberAction(_: unknown, formData: FormData) {
  const user = await requireAdmin();
  if (!user.permissions.includes("members.create")) return { error: "دسترسی ایجاد عضو ندارید." };
  const parsed = memberSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "اطلاعات نامعتبر است." };
  const data = parsed.data;
  const role = await prisma.role.findUnique({ where: { name: "MEMBER_CUSTOMER" } });
  if (!role) return { error: "نقش عضو تعریف نشده است." };
  const passwordHash = await bcrypt.hash("password123", 10);
  const memberCode = await generateMemberCode();
  const referralCode = await generateReferralCode();
  const created = await prisma.user.create({ data: { name: `${data.firstName} ${data.lastName}`, email: data.email || null, mobile: data.mobile, passwordHash, roleId: role.id, memberProfile: { create: { firstName: data.firstName, lastName: data.lastName, mobile: data.mobile, email: data.email || null, birthDate: data.birthDate ? new Date(data.birthDate) : null, address: data.address, job: data.job, referralSource: data.referralSource, socialNetwork: data.socialNetwork, medicalNotes: data.medicalNotes, goal: data.goal, referredByCode: data.referredByCode, memberCode, referralCode, loyaltyTier: "Bronze" } } }, include: { memberProfile: true } });
  if (data.referredByCode && created.memberProfile) {
    const ref = await applyReferralDiscount(data.referredByCode);
    if (ref.valid && ref.referrerId) await prisma.referral.create({ data: { referrerMemberId: ref.referrerId, referredMemberId: created.memberProfile.id, discountPercent: 10 } });
  }
  revalidatePath("/admin/members");
  redirect(`/admin/members/${created.memberProfile?.id}?created=1`);
}

export async function createPlanAction(_: unknown, formData: FormData) {
  const user = await requireAdmin();
  if (!user.permissions.includes("plans.create")) return { error: "دسترسی ایجاد پلن ندارید." };
  const parsed = planSchema.safeParse({ ...Object.fromEntries(formData), isMixedClassAllowed: formData.get("isMixedClassAllowed") === "on" });
  if (!parsed.success) return { error: "اطلاعات پلن معتبر نیست." };
  await prisma.plan.create({ data: parsed.data });
  revalidatePath("/admin/plans");
  redirect("/admin/plans");
}

export async function registerMembershipAction(formData: FormData) {
  const user = await requireAdmin();
  if (!user.permissions.includes("members.update")) throw new Error("دسترسی ندارید.");
  const memberId = String(formData.get("memberId"));
  const planId = String(formData.get("planId"));
  const plan = await prisma.plan.findUniqueOrThrow({ where: { id: planId } });
  const startDate = new Date();
  const endDate = new Date(startDate); endDate.setDate(endDate.getDate() + plan.durationDays);
  await prisma.membership.create({ data: { memberId, planId, startDate, endDate, totalSessions: plan.sessionCount, remainingSessions: plan.sessionCount, mixedClassConfig: plan.isMixedClassAllowed ? { enabled: true, note: "قابل تقسیم بین رشته‌ها" } : undefined } });
  revalidatePath(`/admin/members/${memberId}`);
}

export async function recordPaymentAction(formData: FormData) {
  const user = await requireAdmin();
  if (!user.permissions.includes("payments.create")) throw new Error("دسترسی ندارید.");
  const memberId = String(formData.get("memberId"));
  const amount = Number(formData.get("amount") ?? 0);
  const debtAmount = Number(formData.get("debtAmount") ?? 0);
  await prisma.payment.create({ data: { memberId, membershipId: String(formData.get("membershipId") || "") || null, amount, method: String(formData.get("method")) as any, status: String(formData.get("status")) as any, discountAmount: Number(formData.get("discountAmount") ?? 0), debtAmount, dueDate: formData.get("dueDate") ? new Date(String(formData.get("dueDate"))) : null, description: String(formData.get("description") ?? ""), createdById: user.id } });
  const points = calculateLoyaltyPoints("payment", amount);
  const member = await prisma.memberProfile.update({ where: { id: memberId }, data: { balance: { increment: debtAmount }, loyaltyPoints: { increment: points } } });
  await prisma.memberProfile.update({ where: { id: memberId }, data: { loyaltyTier: calculateLoyaltyTier(member.loyaltyPoints + points) } });
  if (points) await prisma.loyaltyTransaction.create({ data: { memberId, points, type: "EARNED", source: "PAYMENT", reason: "پرداخت" } });
  revalidatePath(`/admin/members/${memberId}`);
}

export async function checkInAction(formData: FormData) {
  const user = await requireAdmin();
  if (!user.permissions.includes("attendance.create")) throw new Error("دسترسی ندارید.");
  const memberId = String(formData.get("memberId"));
  const classScheduleId = String(formData.get("classScheduleId") || "") || undefined;
  await deductSession(memberId, classScheduleId);
  revalidatePath("/admin/traffic/member");
  revalidatePath(`/admin/members/${memberId}`);
}

export async function reserveClassAction(formData: FormData) {
  const user = await requireUser();
  if (!user.memberId) throw new Error("عضو نیستید.");
  await prisma.classReservation.create({ data: { memberId: user.memberId, classScheduleId: String(formData.get("classScheduleId")), date: new Date(String(formData.get("date") || new Date())) } });
  revalidatePath("/member/classes");
}
