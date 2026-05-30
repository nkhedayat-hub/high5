"use client";
import { useFormState, useFormStatus } from "react-dom";
import { loginAction } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
function Submit(){ const { pending } = useFormStatus(); return <Button className="w-full" disabled={pending}>{pending ? "در حال ورود..." : "ورود"}</Button> }
export function LoginForm(){ const [state, action] = useFormState(loginAction, null); return <form action={action} className="space-y-4"><div><label className="mb-1 block text-sm font-bold">ایمیل یا موبایل</label><Input name="identifier" /></div><div><label className="mb-1 block text-sm font-bold">رمز عبور</label><Input name="password" type="password" /></div>{state?.error && <p className="text-sm text-red-600">{state.error}</p>}<Submit/></form> }
