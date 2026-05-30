"use server";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { memberSchema } from "@/lib/validations/member";
import { applyReferralDiscount, generateMemberCode, generateReferralCode } from "@/lib/business";
export async function createLeadAction(formData: FormData) {
  await prisma.lead.create({ data: { fullName: String(formData.get("fullName")), mobile: String(formData.get("mobile")), email: String(formData.get("email") || "") || null, source: String(formData.get("source") || "website"), message: String(formData.get("message") || "") } });
}
export async function publicRegisterAction(_: unknown, formData: FormData) {
  const parsed = memberSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "اطلاعات ثبت‌نام کامل نیست." };
  const data = parsed.data;
  const role = await prisma.role.findUnique({ where: { name: "MEMBER_CUSTOMER" } });
  if (!role) return { error: "سامانه هنوز seed نشده است." };
  const planId = String(formData.get("planId") || "");
  const plan = planId ? await prisma.plan.findUnique({ where: { id: planId } }) : null;
  const passwordHash = await bcrypt.hash("password123", 10);
  const memberCode = await generateMemberCode();
  const referralCode = await generateReferralCode();
  const created = await prisma.user.create({ data: { name: `${data.firstName} ${data.lastName}`, email: data.email || null, mobile: data.mobile, passwordHash, roleId: role.id, memberProfile: { create: { firstName: data.firstName, lastName: data.lastName, mobile: data.mobile, email: data.email || null, memberCode, referralCode, referredByCode: data.referredByCode, referralSource: "ثبت‌نام آنلاین", goal: data.goal } } }, include: { memberProfile: true } });
  await prisma.lead.create({ data: { fullName: `${data.firstName} ${data.lastName}`, mobile: data.mobile, email: data.email || null, source: "online-register", status: "CONVERTED", message: `ثبت‌نام آنلاین - پرداخت در باشگاه - پلن ${plan?.title ?? "نامشخص"}` } });
  if (plan && created.memberProfile) { const startDate=new Date(); const endDate=new Date(); endDate.setDate(endDate.getDate()+plan.durationDays); await prisma.membership.create({ data: { memberId: created.memberProfile.id, planId: plan.id, startDate, endDate, totalSessions: plan.sessionCount, remainingSessions: plan.sessionCount, mixedClassConfig: plan.isMixedClassAllowed ? { enabled: true } : undefined } }); }
  if (data.referredByCode && created.memberProfile) { const ref=await applyReferralDiscount(data.referredByCode); if(ref.valid && ref.referrerId) await prisma.referral.create({ data:{ referrerMemberId: ref.referrerId, referredMemberId: created.memberProfile.id, discountPercent: 10 } }); }
  redirect(`/register/success?code=${memberCode}`);
}
