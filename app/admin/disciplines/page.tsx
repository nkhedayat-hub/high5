import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
export default async function DisciplinesPage(){ const items=await prisma.sportDiscipline.findMany(); return <Card><CardTitle className="mb-4">رشته‌ها</CardTitle><Table><thead><tr><Th>نام</Th><Th>توضیح</Th><Th>وضعیت</Th></tr></thead><tbody>{items.map(i=><tr key={i.id}><Td>{i.name}</Td><Td>{i.description}</Td><Td>{i.status}</Td></tr>)}</tbody></Table></Card> }
