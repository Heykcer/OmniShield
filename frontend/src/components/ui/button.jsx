import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  default:
    "bg-blue-600 text-white shadow hover:bg-blue-500 active:scale-[0.98]",
  destructive:
    "bg-rose-600 text-white shadow-sm hover:bg-rose-500 active:scale-[0.98]",
  outline:
    "border border-slate-700 bg-slate-900/50 text-slate-200 shadow-sm hover:bg-slate-800 hover:text-white active:scale-[0.98]",
  secondary:
    "bg-slate-800 text-slate-100 shadow-sm hover:bg-slate-700 active:scale-[0.98]",
  ghost:
    "text-slate-300 hover:bg-slate-800 hover:text-white",
  link: "text-blue-400 underline-offset-4 hover:underline",
};

const buttonSizes = {
  default: "h-9 px-4 py-2 text-sm",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-11 rounded-lg px-8 text-base",
  icon: "h-9 w-9",
};

const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 disabled:pointer-events-none disabled:opacity-50 select-none",
          buttonVariants[variant] || buttonVariants.default,
          buttonSizes[size] || buttonSizes.default,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
