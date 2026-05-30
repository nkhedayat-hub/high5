import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";
import { PlanForm } from "@/components/admin/action-forms";
export default async function NewPlanPage(){ const disciplines = await prisma.sportDiscipline.findMany({ where: { status: "ACTIVE" } }); return <Card><CardTitle className="mb-6">پلن جدید</CardTitle><PlanForm disciplines={disciplines}/></Card> }
