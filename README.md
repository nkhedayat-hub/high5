# BlockPower Gym CRM + Website

یک MVP عملیاتی برای CRM باشگاه بانوان BlockPower و وب‌سایت عمومی `www.blockpowergym.com` با Next.js App Router، TypeScript، Prisma، PostgreSQL، RTL فارسی، احراز هویت سفارشی JWT و داده seed.

## امکانات MVP

- احراز هویت کارکنان، مربی و عضو با cookie/JWT
- نقش‌ها و مجوزهای پایه: SUPER_ADMIN، ADMIN_MANAGER، RECEPTION_SALES، TRAINER، MEMBER_CUSTOMER
- پنل ادمین `/admin` با سایدبار فارسی RTL، داشبورد، نمودارها، اعضا، پلن‌ها، تردد، گزارش‌ها و صفحات placeholder فازهای بعدی
- مدیریت عضو: لیست، جستجو، ایجاد عضو، تولید کد عضویت و کد معرفی، پروفایل کامل، ثبت عضویت، ثبت پرداخت، کارت قابل چاپ
- منطق عضویت، وفاداری، کسر جلسه و تردد در `lib/business.ts`
- پرتال عضو `/member` برای مشاهده پکیج‌ها، پرداخت‌ها، تردد، امتیاز، سطح وفاداری، کد معرفی و رزرو کلاس
- پنل مربی `/trainer/dashboard`
- وب‌سایت عمومی فارسی: خانه، درباره ما، پلن‌ها، کلاس‌ها، مربیان، فروشگاه، بلاگ، تماس، ورود و ثبت‌نام آنلاین
- Prisma schema کامل برای مدل‌های CRM، مالی، وفاداری، محصولات، لید، بلاگ و تنظیمات
- Seed data شامل نقش‌ها، کاربران تست، اعضا، مربیان، رشته‌ها، پلن‌ها، عضویت‌ها، پرداخت‌ها، ترددها، محصولات، فروش‌ها، لیدها و بلاگ

## پیش‌نیازها

- Node.js 20+
- PostgreSQL 14+
- npm

## نصب

```bash
npm install
```

## تنظیم دیتابیس

فایل `.env` را از `.env.example` بسازید یا مقدارهای آن را ویرایش کنید:

```bash
cp .env.example .env
```

نمونه مقدار:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/blockpower?schema=public"
AUTH_SECRET="change-me-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## اجرای migration یا push schema

برای توسعه سریع:

```bash
npm run prisma:push
```

یا اگر می‌خواهید migration بسازید:

```bash
npm run prisma:migrate
```

## Seed داده‌های نمونه

```bash
npm run prisma:seed
```

## اجرای سرور توسعه

```bash
npm run dev
```

سپس به آدرس زیر بروید:

```text
http://localhost:3000
```

## ساخت production

```bash
npm run build
npm run start
```

## حساب‌های تست

| نقش | ایمیل | رمز عبور | مسیر بعد از ورود |
| --- | --- | --- | --- |
| Super Admin | `superadmin@blockpowergym.com` | `password123` | `/admin/dashboard` |
| Reception | `reception@blockpowergym.com` | `password123` | `/admin/dashboard` |
| Trainer | `trainer@blockpowergym.com` | `password123` | `/trainer/dashboard` |
| Member | `member@blockpowergym.com` | `password123` | `/member/dashboard` |

## مسیرهای کلیدی

- `/admin/dashboard` داشبورد ادمین
- `/admin/members` لیست اعضا
- `/admin/members/new` ثبت عضو جدید
- `/admin/plans` پلن‌ها
- `/admin/traffic/member` ثبت تردد و کسر جلسه
- `/admin/reports` گزارش‌های پایه
- `/member/dashboard` پرتال عضو
- `/trainer/dashboard` پرتال مربی
- `/plans` پلن‌های عمومی
- `/classes` برنامه کلاس‌ها
- `/register` ثبت‌نام آنلاین

## نکات تولیدی

- مقدار `AUTH_SECRET` را در production حتماً تغییر دهید.
- اتصال پرداخت آنلاین، SMS و QR scanner به صورت placeholder طراحی شده و آماده توسعه فاز ۳ است.
- منطق مجوزها در `lib/permissions.ts` و محافظت routeها در `middleware.ts` پیاده‌سازی شده است.
