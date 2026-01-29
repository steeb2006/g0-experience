"use client";

import { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface LineProps {
  width?: number;
  height?: number;
  stroke?: string;
  strokeWidth?: number;
  orientation?: "horizontal" | "vertical";
  className?: string;
  style?: CSSProperties;
}

export function Line({
  width,
  height,
  stroke = "var(--g0-bg-elevated-3)",
  strokeWidth = 1,
  orientation = "horizontal",
  className,
  style,
}: LineProps) {
  const isHorizontal = orientation === "horizontal";

  const lineStyle: CSSProperties = {
    width: isHorizontal ? (width ? `${width}px` : "100%") : `${strokeWidth}px`,
    height: isHorizontal ? `${strokeWidth}px` : (height ? `${height}px` : "100%"),
    backgroundColor: stroke,
    ...style,
  };

  return (
    <div
      className={cn(className)}
      style={lineStyle}
    />
  );
}
