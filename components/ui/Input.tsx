"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)] px-3 py-2 text-sm",
          "text-[var(--g0-text-primary)] placeholder:text-[var(--g0-text-muted)]",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g0-accent-amber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--g0-bg-base)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
