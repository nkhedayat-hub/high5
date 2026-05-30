import { cn } from "@/lib/utils";
export function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "success" | "danger" | "warning" | "mint" }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-bold", tone === "default" && "bg-gray-100 text-gray-700", tone === "success" && "bg-emerald-50 text-emerald-700", tone === "danger" && "bg-red-50 text-red-700", tone === "warning" && "bg-amber-50 text-amber-700", tone === "mint" && "bg-mint/20 text-charcoal")}>{children}</span>;
}
