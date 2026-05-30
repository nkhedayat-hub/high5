import { prisma } from "@/lib/prisma";
import type { Membership, Plan } from "@prisma/client";

export function calculateRemainingSessions(totalSessions: number, usedSessions: number, burnedSessions = 0) {
  return Math.max(totalSessions - usedSessions - burnedSessions, 0);
}
export function calculateMembershipStatus(membership: Pick<Membership, "endDate" | "remainingSessions" | "status">) {
  if (membership.status === "CANCELLED" || membership.status === "FROZEN") return membership.status;
  return new Date(membership.endDate) >= new Date() && membership.remainingSessions > 0 ? "ACTIVE" : "EXPIRED";
}
export function isMembershipActive(membership: Pick<Membership, "endDate" | "remainingSessions" | "status">) {
  return calculateMembershipStatus(membership) === "ACTIVE";
}
export function calculateMembershipProgress(membership: Pick<Membership, "totalSessions" | "usedSessions">) {
  if (!membership.totalSessions) return 0;
  return Math.min(100, Math.round((membership.usedSessions / membership.totalSessions) * 100));
}
export function calculateLoyaltyPoints(event: "attendance" | "payment" | "product" | "referral" | "feedback", amount = 0) {
  if (event === "attendance") return 10;
  if (event === "payment") return Math.floor(amount / 1_000_000) * 20;
  if (event === "product") return Math.floor(amount / 1_000_000) * 5;
  if (event === "referral") return 100;
  if (event === "feedback") return 5;
  return 0;
}
export function calculateLoyaltyTier(points: number) {
  if (points >= 3000) return "VIP";
  if (points >= 1500) return "Gold";
  if (points >= 500) return "Silver";
  return "Bronze";
}
export async function generateMemberCode() {
  for (let i = 0; i < 10; i++) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    if (!(await prisma.memberProfile.findUnique({ where: { memberCode: code } }))) return code;
  }
  return String(Date.now()).slice(-6);
}
export async function generateReferralCode() {
  for (let i = 0; i < 10; i++) {
    const code = `BP-${Math.floor(10000 + Math.random() * 90000)}`;
    if (!(await prisma.memberProfile.findUnique({ where: { referralCode: code } }))) return code;
  }
  return `BP-${String(Date.now()).slice(-5)}`;
}
export function canUseClass(membership: Membership & { plan: Plan }, disciplineId?: string | null) {
  if (!isMembershipActive(membership)) return { ok: false, reason: "عضویت فعال نیست یا جلسه‌ای باقی نمانده است." };
  if (!disciplineId) return { ok: true };
  if (membership.plan.disciplineId === disciplineId || membership.plan.isMixedClassAllowed) return { ok: true };
  return { ok: false, reason: "این پلن برای کلاس انتخاب‌شده مجاز نیست." };
}
export async function deductSession(memberId: string, classScheduleId?: string) {
  const active = await prisma.membership.findFirst({ where: { memberId, status: "ACTIVE" }, include: { plan: true }, orderBy: { endDate: "asc" } });
  if (!active) throw new Error("عضویت فعال پیدا نشد.");
  const cls = classScheduleId ? await prisma.classSchedule.findUnique({ where: { id: classScheduleId } }) : null;
  const allowed = canUseClass(active, cls?.disciplineId);
  if (!allowed.ok) throw new Error(allowed.reason);
  return prisma.$transaction(async (tx) => {
    const updated = await tx.membership.update({ where: { id: active.id }, data: { usedSessions: { increment: 1 }, remainingSessions: { decrement: 1 } } });
    const attendance = await tx.attendance.create({ data: { memberId, membershipId: active.id, classScheduleId, trainerId: cls?.trainerId, type: "MEMBER" } });
    const member = await tx.memberProfile.update({ where: { id: memberId }, data: { lastAttendanceAt: new Date(), loyaltyPoints: { increment: 10 } } });
    await tx.memberProfile.update({ where: { id: memberId }, data: { loyaltyTier: calculateLoyaltyTier(member.loyaltyPoints) } });
    await tx.loyaltyTransaction.create({ data: { memberId, points: 10, type: "EARNED", source: "ATTENDANCE", reason: "ثبت تردد" } });
    if (updated.remainingSessions <= 0) await tx.membership.update({ where: { id: active.id }, data: { status: "EXPIRED" } });
    return attendance;
  });
}
export async function applyReferralDiscount(referralCode?: string | null) {
  if (!referralCode) return { valid: false, percent: 0 };
  const referrer = await prisma.memberProfile.findUnique({ where: { referralCode } });
  return referrer ? { valid: true, percent: 10, referrerId: referrer.id } : { valid: false, percent: 0 };
}
export function calculateDiscounts(input: { price: number; discountCodePercent?: number; tier?: string; referralPercent?: number; redeemedPoints?: number }) {
  const tierPercent = input.tier === "VIP" ? 10 : input.tier === "Gold" ? 5 : input.tier === "Silver" ? 3 : 0;
  const percent = (input.discountCodePercent ?? 0) + tierPercent + (input.referralPercent ?? 0);
  const percentAmount = Math.round(input.price * (percent / 100));
  const pointsAmount = Math.floor((input.redeemedPoints ?? 0) / 100) * 100000;
  return Math.min(input.price, percentAmount + pointsAmount);
}
export async function canReserveClass(memberId: string, classScheduleId: string) {
  const cls = await prisma.classSchedule.findUnique({ where: { id: classScheduleId }, include: { reservations: { where: { status: "RESERVED" } } } });
  if (!cls) return { ok: false, reason: "کلاس پیدا نشد." };
  if (cls.reservations.length >= cls.capacity) return { ok: false, reason: "ظرفیت کلاس تکمیل است." };
  const active = await prisma.membership.findFirst({ where: { memberId, status: "ACTIVE" }, include: { plan: true } });
  if (!active) return { ok: false, reason: "عضویت فعال ندارید." };
  return canUseClass(active, cls.disciplineId);
}
