import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Table, Td, Th } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
export default async function PlansPage(){ const plans = await prisma.plan.findMany({ include: { discipline: true }, orderBy: { createdAt: "desc" } }); return <div className="space-y-6"><div className="flex justify-between"><h1 className="text-3xl font-black">پلن‌ها</h1><Link href="/admin/plans/new" className="rounded-xl bg-mint px-4 py-2 font-bold">پلن جدید</Link></div><Table><thead><tr><Th>عنوان</Th><Th>رشته</Th><Th>جلسات</Th><Th>مدت</Th><Th>قیمت</Th><Th>میکس</Th><Th>وضعیت</Th></tr></thead><tbody>{plans.map(p=><tr key={p.id}><Td>{p.title}</Td><Td>{p.discipline.name}</Td><Td>{p.sessionCount}</Td><Td>{p.durationDays} روز</Td><Td>{formatCurrency(p.price)}</Td><Td>{p.isMixedClassAllowed ? <Badge tone="mint">مجاز</Badge> : "—"}</Td><Td>{p.status}</Td></tr>)}</tbody></Table></div> }
