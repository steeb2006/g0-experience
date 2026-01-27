"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline" | "amber" | "violet";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g0-accent-amber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--g0-bg-base)]",
          "disabled:pointer-events-none disabled:opacity-50",
          {
            // Variants
            "bg-[var(--g0-bg-elevated-2)] text-[var(--g0-text-primary)] hover:bg-[var(--g0-bg-elevated-3)]":
              variant === "default",
            "bg-transparent hover:bg-[var(--g0-bg-elevated-2)] text-[var(--g0-text-secondary)] hover:text-[var(--g0-text-primary)]":
              variant === "ghost",
            "border border-[var(--g0-bg-elevated-3)] bg-transparent hover:bg-[var(--g0-bg-elevated-1)] text-[var(--g0-text-secondary)]":
              variant === "outline",
            "bg-[var(--g0-accent-amber)] text-[var(--g0-text-inverse)] hover:bg-[var(--g0-accent-amber)]/90":
              variant === "amber",
            "bg-[var(--g0-accent-violet)] text-white hover:bg-[var(--g0-accent-violet)]/90":
              variant === "violet",

            // Sizes
            "h-10 px-4 py-2 text-sm": size === "default",
            "h-8 px-3 py-1 text-xs": size === "sm",
            "h-12 px-6 py-3 text-base": size === "lg",
            "h-10 w-10 p-0": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
