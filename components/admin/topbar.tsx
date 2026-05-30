import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import type { SessionUser } from "@/lib/auth";
export function AdminTopbar({ user }: { user: SessionUser }) {
  return <header className="sticky top-0 z-10 mb-6 flex items-center justify-between rounded-2xl border bg-white/90 p-4 shadow-sm backdrop-blur"><div><p className="font-bold">سلام، {user.name}</p><p className="text-xs text-gray-500">نقش: {user.role}</p></div><form action={logoutAction}><Button variant="secondary">خروج</Button></form></header>;
}
