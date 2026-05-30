import Link from "next/link";
import { Activity, BarChart3, Boxes, CreditCard, Globe2, LayoutDashboard, Settings, UserRound, UsersRound } from "lucide-react";

const sections = [
  { title: "داشبورد", icon: LayoutDashboard, links: [["داشبورد", "/admin/dashboard"]] },
  { title: "تردد", icon: Activity, links: [["تردد مشتری", "/admin/traffic/member"], ["تردد پرسنل", "/admin/traffic/staff"], ["ثبت کارت سازمانی", "/admin/traffic/card"], ["گزارش سرجمع تردد", "/admin/traffic/summary"]] },
  { title: "حسابداری", icon: CreditCard, links: [["صندوق", "/admin/accounting/cashbox"], ["صندوق روزانه", "/admin/accounting/daily-cashbox"], ["درآمد مربیان", "/admin/accounting/trainer-income"], ["تفکیک درآمد", "/admin/accounting/income-breakdown"], ["مشتریان بدهکار", "/admin/accounting/debtors"], ["مشتریان بستانکار", "/admin/accounting/creditors"], ["گزارش مالی کلی", "/admin/accounting/financial-report"]] },
  { title: "پلن‌ها", icon: BarChart3, links: [["رشته‌ها", "/admin/disciplines"], ["لیست پلن‌ها", "/admin/plans"], ["پلن جدید", "/admin/plans/new"], ["ثبت‌نام‌های فعال پلن‌ها", "/admin/memberships/active"], ["کد تخفیف", "/admin/discount-codes"]] },
  { title: "اعضا و کاربران", icon: UsersRound, links: [["لیست اعضا", "/admin/members"], ["عضو جدید", "/admin/members/new"], ["لیست کاربران", "/admin/users"], ["مربیان", "/admin/trainers"], ["کاربر جدید", "/admin/users/new"]] },
  { title: "محصولات و انبار", icon: Boxes, links: [["لیست محصولات", "/admin/products"], ["محصول جدید", "/admin/products/new"], ["گزارش فروش محصول", "/admin/products/sales-report"], ["لیست کالاها", "/admin/inventory"], ["کاردکس", "/admin/inventory/cardex"], ["ورود/خروج کالا", "/admin/inventory/transactions"]] },
  { title: "وب‌سایت", icon: Globe2, links: [["مدیریت صفحه اصلی", "/admin/website/home"], ["مدیریت پلن‌های سایت", "/admin/website/plans"], ["مدیریت کلاس‌های سایت", "/admin/website/classes"], ["مدیریت مربیان سایت", "/admin/website/trainers"], ["مدیریت محصولات سایت", "/admin/website/products"], ["مدیریت بلاگ", "/admin/website/blog"], ["لیدهای سایت", "/admin/website/leads"], ["بنرها و CTAها", "/admin/website/banners"]] },
  { title: "گزارش‌ها", icon: BarChart3, links: [["گزارش‌ها", "/admin/reports"], ["بازخوردها", "/admin/reports/feedback"], ["عملکرد مربی", "/admin/reports/trainers"], ["گزارش تردد", "/admin/reports/attendance"], ["امتیاز مشتریان", "/admin/loyalty"], ["ارجاع‌ها", "/admin/loyalty/referrals"]] },
  { title: "CRM", icon: UserRound, links: [["تماس‌های تلفنی", "/admin/crm/calls"], ["پیگیری‌ها", "/admin/crm/follow-ups"], ["پیام‌ها", "/admin/crm/messages"]] },
  { title: "تنظیمات", icon: Settings, links: [["پروفایل باشگاه", "/admin/settings/profile"], ["کاربران و نقش‌ها", "/admin/settings/users-roles"], ["قیمت‌ها", "/admin/settings/prices"], ["پیامک‌ها و اعلان‌ها", "/admin/settings/notifications"], ["تنظیمات عمومی", "/admin/settings/general"]] }
];
export function AdminSidebar() {
  return <aside className="fixed right-0 top-0 z-20 h-screen w-80 overflow-y-auto bg-charcoal p-4 text-white"><div className="mb-6 rounded-2xl bg-white/10 p-4"><p className="text-2xl font-black text-mint">BlockPower</p><p className="text-xs text-white/70">CRM باشگاه بانوان</p></div>{sections.map((s) => <div key={s.title} className="mb-4"><div className="mb-2 flex items-center gap-2 text-sm font-bold text-mint"><s.icon size={16}/>{s.title}</div><div className="space-y-1">{s.links.map(([label, href]) => <Link key={href} href={href} className="block rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-mint hover:text-charcoal">{label}</Link>)}</div></div>)}</aside>;
}
