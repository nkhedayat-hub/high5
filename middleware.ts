import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const key = new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret-change-me");
async function readRole(req: NextRequest) {
  const token = req.cookies.get("bp_session")?.value;
  if (!token) return null;
  try { const { payload } = await jwtVerify(token, key); return payload.role as string; } catch { return null; }
}
export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const role = await readRole(req);
  if (path.startsWith("/admin") && !["SUPER_ADMIN", "ADMIN_MANAGER", "RECEPTION_SALES"].includes(role ?? "")) return NextResponse.redirect(new URL("/login", req.url));
  if (path.startsWith("/member") && role !== "MEMBER_CUSTOMER") return NextResponse.redirect(new URL("/login", req.url));
  if (path.startsWith("/trainer") && role !== "TRAINER") return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*", "/member/:path*", "/trainer/:path*"] };
