import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { rolePermissionMap } from "../lib/permissions";
const prisma = new PrismaClient();
function calculateLoyaltyTier(points: number) {
  if (points >= 3000) return "VIP";
  if (points >= 1500) return "Gold";
  if (points >= 500) return "Silver";
  return "Bronze";
}
const faFirst = ["سارا","مینا","نرگس","مهسا","الناز","ترانه","یگانه","رها","پرنیان","آیدا","الهام","نیلوفر","نگار","شبنم","فرشته","پریسا","مریم","هستی","غزل","باران"];
const faLast = ["احمدی","محمدی","کریمی","رضایی","کاظمی","موسوی","جعفری","صادقی","مرادی","نوری"];
async function main() {
  await prisma.$transaction([prisma.attendance.deleteMany(), prisma.payment.deleteMany(), prisma.productSale.deleteMany(), prisma.inventoryTransaction.deleteMany(), prisma.classReservation.deleteMany(), prisma.membership.deleteMany(), prisma.loyaltyTransaction.deleteMany(), prisma.referral.deleteMany(), prisma.note.deleteMany(), prisma.feedback.deleteMany(), prisma.gift.deleteMany(), prisma.insurance.deleteMany(), prisma.memberProfile.deleteMany(), prisma.trainerProfile.deleteMany(), prisma.lead.deleteMany(), prisma.blogPost.deleteMany(), prisma.websiteContent.deleteMany(), prisma.settings.deleteMany(), prisma.discountCode.deleteMany(), prisma.classSchedule.deleteMany(), prisma.plan.deleteMany(), prisma.sportDiscipline.deleteMany(), prisma.product.deleteMany(), prisma.user.deleteMany(), prisma.role.deleteMany()]);
  const roles: Record<string,string> = {};
  for (const [name, permissions] of Object.entries(rolePermissionMap)) {
    const r = await prisma.role.create({ data: { name, description: `نقش ${name}`, permissions } }); roles[name]=r.id;
  }
  const hash = await bcrypt.hash("password123", 10);
  const superAdmin = await prisma.user.create({ data: { name: "مدیر ارشد", email: "superadmin@blockpowergym.com", mobile: "09000000001", passwordHash: hash, roleId: roles.SUPER_ADMIN } });
  await prisma.user.create({ data: { name: "پذیرش", email: "reception@blockpowergym.com", mobile: "09000000002", passwordHash: hash, roleId: roles.RECEPTION_SALES } });
  const disciplines = ["Open Gym","Pilates","Yoga","TRX","CrossFit","Functional","Body Pump","Personal Training","Semi-Private" as const];
  const disc = [];
  for (const name of disciplines) disc.push(await prisma.sportDiscipline.create({ data: { name, description: `رشته ${name}` } }));
  const trainers=[];
  for (let i=0;i<5;i++){ const u=await prisma.user.create({data:{name:`مربی ${faFirst[i]}`,email:i===0?"trainer@blockpowergym.com":`trainer${i}@blockpowergym.com`,mobile:`0912000100${i}`,passwordHash:hash,roleId:roles.TRAINER}}); trainers.push(await prisma.trainerProfile.create({data:{userId:u.id,bio:"مربی تخصصی بانوان با تجربه در تمرینات قدرتی و اصلاحی",specialties:[disc[i+1]?.name ?? "Functional"],commissionType:"PERCENTAGE",commissionValue:20+i,rating:4.5+i/10}})); }
  const plans=[];
  const planExamples = [["Open Gym 8 sessions",0,8,30,4500000,true],["Open Gym 12 sessions",0,12,45,6200000,true],["Pilates 8 sessions",1,8,30,7200000,true],["Yoga 8 sessions",2,8,30,5200000,true],["Functional 12 sessions",5,12,45,7600000,true],["CrossFit 12 sessions",4,12,45,8300000,true],["Personal Training 4 sessions",7,4,30,12000000,false],["Semi-Private 10 sessions",8,10,40,11000000,false]] as const;
  for (const p of planExamples) plans.push(await prisma.plan.create({data:{title:p[0],disciplineId:disc[p[1]].id,sessionCount:p[2],durationDays:p[3],price:p[4],isMixedClassAllowed:p[5]}}));
  for (let i=0;i<12;i++){ const d=disc[i%disc.length]; plans.push(await prisma.plan.create({data:{title:`${d.name} ${[1,4,8,10,12][i%5]} sessions`,disciplineId:d.id,sessionCount:[1,4,8,10,12][i%5],durationDays:20+(i%4)*10,price:2500000+i*650000,isMixedClassAllowed:[8,12].includes([1,4,8,10,12][i%5])}})); }
  const classes=[];
  for(let i=0;i<14;i++) classes.push(await prisma.classSchedule.create({data:{title:`کلاس ${disc[i%disc.length].name}`,disciplineId:disc[i%disc.length].id,trainerId:trainers[i%trainers.length].id,room:`سالن ${1+i%3}`,capacity:12+i%8,startTime:`${8+i%10}:00`,endTime:`${9+i%10}:00`,weekday:i%7,level:["مبتدی","متوسط","پیشرفته"][i%3],price:800000+i*10000}}));
  const members=[];
  for(let i=0;i<20;i++){ const points=i*180; const u=await prisma.user.create({data:{name:`${faFirst[i]} ${faLast[i%faLast.length]}`,email:i===0?"member@blockpowergym.com":`member${i}@blockpowergym.com`,mobile:`09125550${String(i).padStart(3,"0")}`,passwordHash:hash,roleId:roles.MEMBER_CUSTOMER,memberProfile:{create:{firstName:faFirst[i],lastName:faLast[i%faLast.length],mobile:`09125550${String(i).padStart(3,"0")}`,email:i===0?"member@blockpowergym.com":`member${i}@blockpowergym.com`,memberCode:`${220000+i}`,referralCode:`BP-${12000+i}`,referredByCode:i>2?`BP-${12000+i-1}`:null,address:"تهران",job:"کارمند",goal:"افزایش قدرت و تناسب اندام",status:i%9===0?"INACTIVE":"ACTIVE",balance:i%5===0?1500000:0,loyaltyPoints:points,loyaltyTier:calculateLoyaltyTier(points),lastAttendanceAt:new Date(Date.now()-i*86400000)}}}}); const m=await prisma.memberProfile.findUniqueOrThrow({where:{userId:u.id}}); members.push(m); }
  for(let i=0;i<20;i++){ const p=plans[i%plans.length]; const start=new Date(Date.now()-(i%20)*86400000); const end=new Date(start); end.setDate(end.getDate()+p.durationDays); const used=i%p.sessionCount; const membership=await prisma.membership.create({data:{memberId:members[i].id,planId:p.id,startDate:start,endDate:end,totalSessions:p.sessionCount,usedSessions:used,remainingSessions:p.sessionCount-used,status:p.sessionCount-used>0?"ACTIVE":"EXPIRED",mixedClassConfig:p.isMixedClassAllowed?{enabled:true,splits:[{discipline:"Pilates",sessions:4},{discipline:"Yoga",sessions:4}]}:undefined}}); await prisma.payment.create({data:{memberId:members[i].id,membershipId:membership.id,amount:p.price,method:["CASH","CARD","TRANSFER","ONLINE"][i%4] as any,status:i%5===0?"PARTIAL":"PAID",discountAmount:i%3===0?500000:0,debtAmount:i%5===0?1500000:0,description:"پرداخت عضویت",createdById:superAdmin.id}}); }
  for(let i=0;i<50;i++){ const m=members[i%members.length]; const ms=await prisma.membership.findFirst({where:{memberId:m.id}}); await prisma.attendance.create({data:{memberId:m.id,membershipId:ms?.id,classScheduleId:classes[i%classes.length].id,trainerId:classes[i%classes.length].trainerId,checkInAt:new Date(Date.now()-i*43200000),type:"MEMBER"}}); await prisma.loyaltyTransaction.create({data:{memberId:m.id,points:10,type:"EARNED",source:"ATTENDANCE",reason:"تردد seed"}}); }
  const productNames=["Protein shake","Water bottle","Gym gloves","T-shirt","Towel","Supplement placeholder","Healthy snack","Yoga mat","Resistance band","Shaker"];
  const products=[]; for(let i=0;i<10;i++) products.push(await prisma.product.create({data:{name:productNames[i],description:"محصول فروشگاه باشگاه",price:600000+i*250000,stock:3+i*4,category:i%2?"لوازم":"تغذیه",imageUrl:null}}));
  for(let i=0;i<20;i++){ const product=products[i%products.length]; const sale=await prisma.productSale.create({data:{memberId:members[i%members.length].id,productId:product.id,quantity:1+(i%2),totalAmount:Number(product.price)*(1+(i%2))}}); await prisma.payment.create({data:{memberId:members[i%members.length].id,productSaleId:sale.id,amount:sale.totalAmount,method:"CARD",status:"PAID",createdById:superAdmin.id}}); await prisma.inventoryTransaction.create({data:{productId:product.id,type:"OUT",quantity:sale.quantity,note:"فروش محصول"}}); }
  for(let i=0;i<20;i++) await prisma.lead.create({data:{fullName:`لید ${faFirst[i%faFirst.length]}`,mobile:`0935000${String(i).padStart(4,"0")}`,email:`lead${i}@example.com`,source:i%2?"contact":"instagram",message:"درخواست مشاوره",status:["NEW","CONTACTED","CONVERTED","LOST"][i%4] as any,assignedToId:superAdmin.id}});
  for(let i=0;i<10;i++) await prisma.blogPost.create({data:{title:`مقاله سلامت و تمرین ${i+1}`,slug:`wellness-${i+1}`,excerpt:"نکات کاربردی برای تمرین بانوان",content:"این مقاله درباره تمرین امن، تغذیه مناسب و استمرار در مسیر سلامت است.",status:"PUBLISHED",publishedAt:new Date()}});
  for(let i=1;i<8;i++) await prisma.referral.create({data:{referrerMemberId:members[i-1].id,referredMemberId:members[i].id,discountPercent:10,status:i%2?"APPROVED":"PENDING"}});
  await prisma.discountCode.create({data:{code:"POWER10",title:"تخفیف افتتاحیه",type:"PERCENTAGE",value:10,maxUsage:100,startDate:new Date(Date.now()-86400000),endDate:new Date(Date.now()+30*86400000)}});
  await prisma.websiteContent.create({data:{key:"home.hero",title:"قدرتت رو از اینجا بساز",content:"باشگاه پریمیوم بانوان BlockPower",status:"PUBLISHED"}});
  await prisma.settings.create({data:{key:"loyalty.rules",value:{attendance:10,paymentPerMillion:20,referral:100}}});
}
main().finally(async()=>prisma.$disconnect());
