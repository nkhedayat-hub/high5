import { Card, CardTitle } from "@/components/ui/card";
import { MemberForm } from "@/components/admin/action-forms";
export default function NewMemberPage(){ return <Card><CardTitle className="mb-6">ثبت عضو جدید</CardTitle><MemberForm/><div className="mt-6 rounded-xl bg-cream p-4 text-sm">رمز پیش‌فرض ورود عضو: <b className="ltr inline-block">password123</b></div></Card> }
