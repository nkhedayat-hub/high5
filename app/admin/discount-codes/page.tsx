import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
export default async function DiscountCodes(){ const rows=await prisma.discountCode.findMany(); return <Card><CardTitle className="mb-4">کدهای تخفیف</CardTitle><Table><thead><tr><Th>کد</Th><Th>عنوان</Th><Th>نوع</Th><Th>مقدار</Th><Th>استفاده</Th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><Td>{r.code}</Td><Td>{r.title}</Td><Td>{r.type}</Td><Td>{String(r.value)}</Td><Td>{r.usedCount}/{r.maxUsage}</Td></tr>)}</tbody></Table></Card> }
