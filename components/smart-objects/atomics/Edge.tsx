"use client";

import { CSSProperties, useMemo, useId, useState } from "react";
import { cn } from "@/lib/utils";

interface Point {
  x: number;
  y: number;
}

interface EdgeProps {
  from: Point;
  to: Point;
  variant?: "straight" | "curved" | "step";
  arrow?: "none" | "end" | "start" | "both";
  label?: string;
  stroke?: string;
  strokeWidth?: number;
  animated?: boolean;
  dashed?: boolean;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

export function Edge({
  from,
  to,
  variant = "straight",
  arrow = "none",
  label,
  stroke = "var(--g0-text-muted)",
  strokeWidth = 2,
  animated = false,
  dashed = false,
  onClick,
  className,
  style,
}: EdgeProps) {
  const uniqueId = useId();
  const [isHovered, setIsHovered] = useState(false);

  // Calculate bounding box
  const padding = 20;
  const minX = Math.min(from.x, to.x) - padding;
  const minY = Math.min(from.y, to.y) - padding;
  const maxX = Math.max(from.x, to.x) + padding;
  const maxY = Math.max(from.y, to.y) + padding;
  const width = maxX - minX;
  const height = maxY - minY;

  // Translate coordinates to local SVG space
  const localFrom = { x: from.x - minX, y: from.y - minY };
  const localTo = { x: to.x - minX, y: to.y - minY };

  // Generate path based on variant
  const path = useMemo(() => {
    const { x: x1, y: y1 } = localFrom;
    const { x: x2, y: y2 } = localTo;

    switch (variant) {
      case "curved": {
        // Quadratic bezier curve
        const dx = x2 - x1;
        const dy = y2 - y1;
        const cx = x1 + dx / 2;
        const cy = y1 + dy / 2;
        // Control point perpendicular to midpoint
        const offset = Math.min(Math.abs(dx), Math.abs(dy)) * 0.3;
        const cpx = cx - (dy > 0 ? offset : -offset);
        const cpy = cy + (dx > 0 ? offset : -offset);
        return `M ${x1} ${y1} Q ${cpx} ${cpy} ${x2} ${y2}`;
      }
      case "step": {
        // Orthogonal step connector
        const midX = x1 + (x2 - x1) / 2;
        return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
      }
      case "straight":
      default:
        return `M ${x1} ${y1} L ${x2} ${y2}`;
    }
  }, [localFrom, localTo, variant]);

  // Calculate angle for arrowheads
  const endAngle = useMemo(() => {
    const { x: x1, y: y1 } = localFrom;
    const { x: x2, y: y2 } = localTo;

    if (variant === "step") {
      // For step variant, arrow points right or left
      return x2 > x1 ? 0 : 180;
    }

    return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  }, [localFrom, localTo, variant]);

  const startAngle = useMemo(() => {
    const { x: x1, y: y1 } = localFrom;
    const { x: x2, y: y2 } = localTo;

    if (variant === "step") {
      return x2 > x1 ? 180 : 0;
    }

    return (Math.atan2(y1 - y2, x1 - x2) * 180) / Math.PI;
  }, [localFrom, localTo, variant]);

  // Label position (midpoint)
  const labelPos = useMemo(() => {
    const { x: x1, y: y1 } = localFrom;
    const { x: x2, y: y2 } = localTo;
    return {
      x: x1 + (x2 - x1) / 2,
      y: y1 + (y2 - y1) / 2,
    };
  }, [localFrom, localTo]);

  const containerStyle: CSSProperties = {
    position: "absolute",
    left: minX,
    top: minY,
    width,
    height,
    pointerEvents: "none",
    ...style,
  };

  const arrowSize = strokeWidth * 4;

  return (
    <div className={cn(className)} style={containerStyle}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        {/* Marker definitions */}
        <defs>
          <marker
            id={`arrow-end-${uniqueId}`}
            markerWidth={arrowSize}
            markerHeight={arrowSize}
            refX={arrowSize - 2}
            refY={arrowSize / 2}
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <polygon
              points={`0 0, ${arrowSize} ${arrowSize / 2}, 0 ${arrowSize}`}
              fill={isHovered ? "var(--g0-accent-violet)" : stroke}
              className="transition-colors duration-200"
            />
          </marker>
          <marker
            id={`arrow-start-${uniqueId}`}
            markerWidth={arrowSize}
            markerHeight={arrowSize}
            refX={2}
            refY={arrowSize / 2}
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <polygon
              points={`${arrowSize} 0, 0 ${arrowSize / 2}, ${arrowSize} ${arrowSize}`}
              fill={isHovered ? "var(--g0-accent-violet)" : stroke}
              className="transition-colors duration-200"
            />
          </marker>
        </defs>

        {/* Invisible hit area for interaction */}
        <path
          d={path}
          fill="none"
          stroke="transparent"
          strokeWidth={Math.max(20, strokeWidth * 5)}
          style={{ pointerEvents: "stroke", cursor: onClick ? "pointer" : "default" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={onClick}
        />

        {/* Visible path */}
        <path
          d={path}
          fill="none"
          stroke={isHovered ? "var(--g0-accent-violet)" : stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={dashed ? `${strokeWidth * 2} ${strokeWidth * 2}` : undefined}
          markerEnd={
            arrow === "end" || arrow === "both"
              ? `url(#arrow-end-${uniqueId})`
              : undefined
          }
          markerStart={
            arrow === "start" || arrow === "both"
              ? `url(#arrow-start-${uniqueId})`
              : undefined
          }
          className="transition-colors duration-200"
          style={{
            filter: isHovered ? "drop-shadow(0 0 4px var(--g0-accent-violet))" : undefined,
          }}
        >
          {/* Animated dash for flow direction */}
          {animated && (
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to={dashed ? "16" : "0"}
              dur="1s"
              repeatCount="indefinite"
            />
          )}
        </path>

        {/* Animated flow particles */}
        {animated && !dashed && (
          <circle r={strokeWidth} fill={stroke}>
            <animateMotion dur="2s" repeatCount="indefinite" path={path} />
          </circle>
        )}

        {/* Label */}
        {label && (
          <g transform={`translate(${labelPos.x}, ${labelPos.y})`}>
            <rect
              x={-label.length * 4 - 8}
              y={-10}
              width={label.length * 8 + 16}
              height={20}
              rx={4}
              fill="var(--g0-bg-elevated-2)"
              stroke={isHovered ? "var(--g0-accent-violet)" : "var(--g0-bg-elevated-3)"}
              strokeWidth={1}
              className="transition-colors duration-200"
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--g0-text-muted)"
              fontSize="12"
              style={{ pointerEvents: "none" }}
            >
              {label}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
