"use client";

import type { ElementType, ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface TextProps {
  children: ReactNode;
  variant?: "display" | "h1" | "h2" | "h3" | "body" | "small" | "mono";
  color?: "primary" | "secondary" | "muted" | "inverse" | "amber" | "violet" | "rose";
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
}

export function Text({
  children,
  variant = "body",
  color = "primary",
  className,
  style,
  as,
}: TextProps) {
  // Use semantic elements for headings, span for body text
  const defaultElement: Record<string, ElementType> = {
    display: "h1",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    body: "p",
    small: "span",
    mono: "code",
  };
  const Component = as || defaultElement[variant] || "span";
  const variantClasses = {
    display: "text-[32px] font-bold tracking-[-0.03em] leading-[1.1]",
    h1: "text-[24px] font-bold tracking-[-0.02em] leading-[1.2]",
    h2: "text-[20px] font-semibold tracking-[-0.01em] leading-[1.3]",
    h3: "text-[16px] font-semibold leading-[1.4]",
    body: "text-[14px] font-normal leading-[1.5]",
    small: "text-[12px] font-normal leading-[1.5]",
    mono: "font-mono text-[13px]",
  };

  const colorClasses = {
    primary: "text-[var(--g0-text-primary)]",
    secondary: "text-[var(--g0-text-secondary)]",
    muted: "text-[var(--g0-text-muted)]",
    inverse: "text-[var(--g0-text-inverse)]",
    amber: "text-[var(--g0-accent-amber)]",
    violet: "text-[var(--g0-accent-violet)]",
    rose: "text-[var(--g0-accent-rose)]",
  };

  return (
    <Component
      className={cn(variantClasses[variant], colorClasses[color], className)}
      style={style}
    >
      {children}
    </Component>
  );
}
