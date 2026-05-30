import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlockPower Gym CRM + Website",
  description: "باشگاه بانوان BlockPower، CRM، پرتال اعضا و وب‌سایت عمومی"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
