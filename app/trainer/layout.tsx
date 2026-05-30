import { requireTrainer } from "@/lib/auth";
export default async function TrainerLayout({children}:{children:React.ReactNode}){ await requireTrainer(); return <main className="min-h-screen bg-cream p-6">{children}</main> }
