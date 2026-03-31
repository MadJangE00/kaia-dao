import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-purple-500/20 text-purple-300": variant === "default",
          "bg-green-500/20 text-green-300": variant === "success",
          "bg-yellow-500/20 text-yellow-300": variant === "warning",
          "bg-red-500/20 text-red-300": variant === "danger",
        },
        className
      )}
      {...props}
    />
  );
}
