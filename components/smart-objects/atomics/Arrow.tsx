"use client";

import { Edge } from "./Edge";
import type { CSSProperties } from "react";

interface Point {
  x: number;
  y: number;
}

interface ArrowProps {
  from: Point;
  to: Point;
  variant?: "straight" | "curved" | "step";
  label?: string;
  stroke?: string;
  strokeWidth?: number;
  animated?: boolean;
  dashed?: boolean;
  bidirectional?: boolean;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Arrow component - convenience wrapper around Edge with default end arrow
 */
export function Arrow({
  from,
  to,
  variant = "straight",
  label,
  stroke,
  strokeWidth,
  animated,
  dashed,
  bidirectional = false,
  onClick,
  className,
  style,
}: ArrowProps) {
  return (
    <Edge
      from={from}
      to={to}
      variant={variant}
      arrow={bidirectional ? "both" : "end"}
      label={label}
      stroke={stroke}
      strokeWidth={strokeWidth}
      animated={animated}
      dashed={dashed}
      onClick={onClick}
      className={className}
      style={style}
    />
  );
}
