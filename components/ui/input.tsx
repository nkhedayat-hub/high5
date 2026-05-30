import * as React from "react";
import { cn } from "@/lib/utils";
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) { return <input {...props} className={cn("w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-mint focus:ring-2 focus:ring-mint/20", props.className)} />; }
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea {...props} className={cn("w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-mint focus:ring-2 focus:ring-mint/20", props.className)} />; }
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) { return <select {...props} className={cn("w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-mint focus:ring-2 focus:ring-mint/20", props.className)} />; }
