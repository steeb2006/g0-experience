"use client";

import { cn } from "@/lib/utils";

interface G0LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function G0Logo({ className, size = "md", onClick }: G0LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6 text-sm",
    md: "h-8 w-8 text-base",
    lg: "h-10 w-10 text-lg",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center rounded-lg font-bold transition-all duration-150",
        "bg-gradient-to-br from-[var(--g0-accent-amber)] to-[var(--g0-accent-violet)]",
        "text-[var(--g0-text-inverse)] hover:opacity-90",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g0-accent-amber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--g0-bg-base)]",
        sizeClasses[size],
        className
      )}
    >
      G0
    </button>
  );
}
