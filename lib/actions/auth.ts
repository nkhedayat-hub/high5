"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authenticate, createSessionToken, redirectPathForRole } from "@/lib/auth";

const loginSchema = z.object({ identifier: z.string().min(3), password: z.string().min(6) });
export async function loginAction(_: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse({ identifier: formData.get("identifier"), password: formData.get("password") });
  if (!parsed.success) return { error: "اطلاعات ورود معتبر نیست." };
  const user = await authenticate(parsed.data.identifier, parsed.data.password);
  if (!user) return { error: "نام کاربری یا رمز عبور اشتباه است." };
  const token = await createSessionToken(user);
  cookies().set("bp_session", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
  redirect(redirectPathForRole(user.role));
}
export async function logoutAction() {
  cookies().delete("bp_session");
  redirect("/login");
}
