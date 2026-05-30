import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import { requireAdmin } from "@/lib/auth";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return <div className="min-h-screen bg-cream"><AdminSidebar /><main className="pr-80"><div className="p-6"><AdminTopbar user={user} />{children}</div></main></div>;
}
