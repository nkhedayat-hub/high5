import { LoginForm } from "@/components/login-form";
import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/public/site-header";
export default function LoginPage(){ return <><SiteHeader/><main className="grid min-h-[80vh] place-items-center bg-cream p-4"><Card className="w-full max-w-md"><h1 className="mb-2 text-3xl font-black">ورود به BlockPower</h1><p className="mb-6 text-sm text-gray-500">با ایمیل یا موبایل وارد پنل خود شوید.</p><LoginForm/><div className="mt-6 rounded-xl bg-cream p-3 text-xs ltr">superadmin@blockpowergym.com / password123</div></Card></main></> }
