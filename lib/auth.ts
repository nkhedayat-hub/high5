import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isAdminRole } from "@/lib/permissions";

const key = new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret-change-me");
export type SessionUser = { id: string; name: string; email?: string | null; role: string; permissions: string[]; memberId?: string; trainerId?: string };

export async function createSessionToken(user: SessionUser) {
  return new SignJWT(user as unknown as Record<string, unknown>).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key);
}
export async function verifySessionToken(token?: string) {
  if (!token) return null;
  try { const { payload } = await jwtVerify(token, key); return payload as unknown as SessionUser; } catch { return null; }
}
export async function getCurrentUser() {
  return verifySessionToken(cookies().get("bp_session")?.value);
}
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
export async function requireAdmin() {
  const user = await requireUser();
  if (!isAdminRole(user.role)) redirect("/login");
  return user;
}
export async function requireMember() {
  const user = await requireUser();
  if (user.role !== "MEMBER_CUSTOMER") redirect("/login");
  return user;
}
export async function requireTrainer() {
  const user = await requireUser();
  if (user.role !== "TRAINER") redirect("/login");
  return user;
}
export async function authenticate(identifier: string, password: string) {
  const user = await prisma.user.findFirst({ where: { OR: [{ email: identifier }, { mobile: identifier }] }, include: { role: true, memberProfile: true, trainerProfile: true } });
  if (!user || user.status !== "ACTIVE") return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role.name, permissions: user.role.permissions as string[], memberId: user.memberProfile?.id, trainerId: user.trainerProfile?.id } satisfies SessionUser;
}
export function redirectPathForRole(role: string) {
  if (role === "TRAINER") return "/trainer/dashboard";
  if (role === "MEMBER_CUSTOMER") return "/member/dashboard";
  return "/admin/dashboard";
}
