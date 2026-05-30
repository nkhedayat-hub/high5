import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
export default async function ActiveMemberships(){ const rows=await prisma.membership.findMany({ where:{status:"ACTIVE"}, include:{member:true, plan:true}, take:100 }); return <Card><CardTitle className="mb-4">ثبت‌نام‌های فعال پلن‌ها</CardTitle><Table><thead><tr><Th>عضو</Th><Th>پلن</Th><Th>پایان</Th><Th>جلسه باقی‌مانده</Th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><Td>{r.member.firstName} {r.member.lastName}</Td><Td>{r.plan.title}</Td><Td>{formatDate(r.endDate)}</Td><Td>{r.remainingSessions}</Td></tr>)}</tbody></Table></Card> }
