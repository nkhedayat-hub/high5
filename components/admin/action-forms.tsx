"use client";
import { useFormState, useFormStatus } from "react-dom";
import { createMemberAction, createPlanAction } from "@/lib/actions/member";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";

function Submit({ children }: { children: React.ReactNode }) { const { pending } = useFormStatus(); return <Button disabled={pending}>{pending ? "در حال ثبت..." : children}</Button>; }
export function MemberForm() {
  const [state, action] = useFormState(createMemberAction, null);
  return <form action={action} className="grid gap-4 md:grid-cols-2"><Field name="firstName" label="نام"/><Field name="lastName" label="نام خانوادگی"/><Field name="mobile" label="موبایل"/><Field name="email" label="ایمیل" type="email"/><Field name="birthDate" label="تاریخ تولد" type="date"/><Field name="job" label="شغل"/><Field name="referralSource" label="منبع آشنایی"/><Field name="socialNetwork" label="شبکه اجتماعی"/><Field name="referredByCode" label="کد معرف"/><div className="md:col-span-2"><label>آدرس</label><Textarea name="address" /></div><div className="md:col-span-2"><label>یادداشت پزشکی</label><Textarea name="medicalNotes" /></div><div className="md:col-span-2"><label>هدف ورزشی</label><Textarea name="goal" /></div>{state?.error && <p className="text-red-600 md:col-span-2">{state.error}</p>}<div className="md:col-span-2"><Submit>ایجاد عضو و پروفایل</Submit></div></form>;
}
function Field({ name, label, type = "text" }: { name: string; label: string; type?: string }) { return <div><label className="mb-1 block text-sm font-bold">{label}</label><Input name={name} type={type}/></div> }
export function PlanForm({ disciplines }: { disciplines: { id: string; name: string }[] }) {
  const [state, action] = useFormState(createPlanAction, null);
  return <form action={action} className="grid gap-4 md:grid-cols-2"><Field name="title" label="عنوان پلن"/><div><label className="mb-1 block text-sm font-bold">رشته</label><Select name="disciplineId">{disciplines.map(d => <option value={d.id} key={d.id}>{d.name}</option>)}</Select></div><Field name="sessionCount" label="تعداد جلسات (۱،۴،۸،۱۰،۱۲)" type="number"/><Field name="durationDays" label="مدت اعتبار (روز)" type="number"/><Field name="price" label="قیمت (ریال)" type="number"/><label className="flex items-center gap-2"><input name="isMixedClassAllowed" type="checkbox"/> امکان میکس کلاس برای ۸ و ۱۲ جلسه</label>{state?.error && <p className="text-red-600 md:col-span-2">{state.error}</p>}<div className="md:col-span-2"><Submit>ثبت پلن</Submit></div></form>;
}
