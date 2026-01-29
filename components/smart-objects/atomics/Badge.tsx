"use client";

import { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "outline";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: CSSProperties;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
  style,
}: BadgeProps) {
  const variantClasses: Record<BadgeVariant, string> = {
    default: "bg-[var(--g0-bg-elevated-2)] text-[var(--g0-text-primary)]",
    success: "bg-emerald-500/20 text-emerald-400",
    warning: "bg-amber-500/20 text-amber-400",
    error: "bg-rose-500/20 text-rose-400",
    info: "bg-blue-500/20 text-blue-400",
    outline: "border border-[var(--g0-bg-elevated-3)] text-[var(--g0-text-muted)]",
  };

  const sizeClasses: Record<"sm" | "md" | "lg", string> = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2 py-1 text-[11px]",
    lg: "px-2.5 py-1.5 text-[12px]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}
