import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
        secondary:
          "border-emerald-500/15 bg-emerald-500/5 text-emerald-200/70",
        destructive:
          "border-red-500/40 bg-red-500/15 text-red-300 alert-pulse",
        outline: "border-emerald-500/20 text-emerald-200",
        warning:
          "border-amber-500/30 bg-amber-500/10 text-amber-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
