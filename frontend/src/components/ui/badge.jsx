import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  default:
    "border-transparent bg-blue-600 text-white shadow hover:bg-blue-600/80",
  secondary:
    "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700",
  destructive:
    "border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-sm hover:bg-rose-500/20",
  success:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-sm hover:bg-emerald-500/20",
  warning:
    "border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-sm hover:bg-amber-500/20",
  info:
    "border-sky-500/30 bg-sky-500/10 text-sky-300 shadow-sm hover:bg-sky-500/20",
  outline: "text-slate-300 border-slate-700",
};

function Badge({ className, variant = "default", ...props }) {
  const variantClass = badgeVariants[variant] || badgeVariants.default;
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2",
        variantClass,
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
