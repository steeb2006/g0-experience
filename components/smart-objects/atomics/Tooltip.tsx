"use client";

import { ReactNode, CSSProperties, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface TooltipProps {
  x: number;
  y: number;
  content: ReactNode;
  visible: boolean;
  className?: string;
}

export function Tooltip({
  x,
  y,
  content,
  visible,
  className,
}: TooltipProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!visible || !mounted) return null;

  const tooltipStyle: CSSProperties = {
    position: "fixed",
    left: x,
    top: y,
    transform: "translate(-50%, -100%) translateY(-8px)",
    zIndex: 9999,
    pointerEvents: "none",
  };

  const tooltipContent = (
    <div
      style={tooltipStyle}
      className={cn(
        "px-3 py-2 rounded-lg",
        "bg-[var(--g0-bg-elevated-3)] border border-[var(--g0-bg-elevated-2)]",
        "text-sm text-[var(--g0-text-primary)]",
        "shadow-lg backdrop-blur-sm",
        "animate-in fade-in-0 zoom-in-95 duration-150",
        className
      )}
    >
      {content}
      {/* Arrow */}
      <div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full"
        style={{
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "6px solid var(--g0-bg-elevated-3)",
        }}
      />
    </div>
  );

  return createPortal(tooltipContent, document.body);
}

interface ChartTooltipContentProps {
  label: string;
  value: string | number;
  color?: string;
  secondaryLabel?: string;
  secondaryValue?: string | number;
}

export function ChartTooltipContent({
  label,
  value,
  color,
  secondaryLabel,
  secondaryValue,
}: ChartTooltipContentProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {color && (
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />
        )}
        <span className="text-[var(--g0-text-muted)] text-xs">{label}</span>
      </div>
      <span className="font-medium text-sm">{value}</span>
      {secondaryLabel && (
        <div className="flex justify-between gap-4 text-xs text-[var(--g0-text-muted)]">
          <span>{secondaryLabel}</span>
          <span>{secondaryValue}</span>
        </div>
      )}
    </div>
  );
}
