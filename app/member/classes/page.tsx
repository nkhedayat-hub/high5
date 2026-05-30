import { requireMember } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { reserveClassAction } from "@/lib/actions/member";
import { weekdayName } from "@/lib/utils";
export default async function MemberClasses(){ await requireMember(); const classes=await prisma.classSchedule.findMany({include:{discipline:true,trainer:{include:{user:true}},reservations:{where:{status:"RESERVED"}}}}); return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{classes.map(c=><Card key={c.id}><CardTitle>{c.title}</CardTitle><p className="mt-2 text-sm text-gray-500">{c.discipline.name} با {c.trainer.user.name}</p><p className="mt-2">{weekdayName(c.weekday)} {c.startTime}-{c.endTime}</p><p>ظرفیت: {c.reservations.length}/{c.capacity}</p><form action={reserveClassAction} className="mt-4"><input type="hidden" name="classScheduleId" value={c.id}/><input type="hidden" name="date" value={new Date().toISOString()}/><Button>رزرو کلاس</Button></form></Card>)}</div> }
