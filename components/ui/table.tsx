import { cn } from "@/lib/utils";
export function Table({ children, className }: { children: React.ReactNode; className?: string }) { return <div className="overflow-x-auto rounded-2xl border border-border bg-white"><table className={cn("w-full min-w-[760px] text-right text-sm", className)}>{children}</table></div>; }
export function Th({ children }: { children: React.ReactNode }) { return <th className="border-b bg-gray-50 px-4 py-3 font-bold text-gray-600">{children}</th>; }
export function Td({ children, className }: { children: React.ReactNode; className?: string }) { return <td className={cn("border-b px-4 py-3 align-middle", className)}>{children}</td>; }
