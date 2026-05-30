import * as React from "react";
import { cn } from "@/lib/utils";
export function Button({ className, variant = "primary", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  return <button className={cn("inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-50", variant === "primary" && "bg-mint text-charcoal hover:bg-mint/80", variant === "secondary" && "bg-charcoal text-white hover:bg-graphite", variant === "ghost" && "bg-transparent hover:bg-black/5", variant === "danger" && "bg-red-500 text-white hover:bg-red-600", className)} {...props} />;
}
