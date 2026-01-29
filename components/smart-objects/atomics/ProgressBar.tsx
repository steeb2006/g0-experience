"use client";

import { CSSProperties, useMemo, useId } from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  variant?: "linear" | "circular" | "gauge";
  showValue?: boolean;
  color?: string;
  trackColor?: string;
  thickness?: number;
  size?: number; // For circular/gauge
  label?: string;
  thresholds?: { value: number; color: string }[];
  animated?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function ProgressBar({
  value,
  variant = "linear",
  showValue = true,
  color = "var(--g0-accent-violet)",
  trackColor = "var(--g0-bg-elevated-2)",
  thickness = 8,
  size = 100,
  label,
  thresholds,
  animated = true,
  className,
  style,
}: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const uniqueId = useId();

  // Determine color based on thresholds
  const activeColor = useMemo(() => {
    if (!thresholds || thresholds.length === 0) return color;

    // Sort thresholds by value descending
    const sorted = [...thresholds].sort((a, b) => b.value - a.value);

    for (const threshold of sorted) {
      if (clampedValue >= threshold.value) {
        return threshold.color;
      }
    }

    return color;
  }, [clampedValue, color, thresholds]);

  if (variant === "linear") {
    return (
      <div className={cn("flex flex-col gap-1", className)} style={style}>
        {(label || showValue) && (
          <div className="flex justify-between items-center text-xs">
            {label && <span className="text-[var(--g0-text-muted)]">{label}</span>}
            {showValue && (
              <span className="text-[var(--g0-text-primary)] font-medium">
                {Math.round(clampedValue)}%
              </span>
            )}
          </div>
        )}
        <div
          className="relative overflow-hidden rounded-full"
          style={{
            height: thickness,
            backgroundColor: trackColor,
          }}
        >
          <div
            className={cn(
              "absolute left-0 top-0 h-full rounded-full",
              animated && "transition-all duration-500 ease-out"
            )}
            style={{
              width: `${clampedValue}%`,
              backgroundColor: activeColor,
              boxShadow: `0 0 8px ${activeColor}40`,
            }}
          />
          {/* Animated shine effect */}
          {animated && clampedValue > 0 && (
            <div
              className="absolute top-0 left-0 h-full w-1/4 animate-shimmer"
              style={{
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
                animation: "shimmer 2s infinite",
              }}
            />
          )}
        </div>
      </div>
    );
  }

  if (variant === "circular") {
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (clampedValue / 100) * circumference;
    const center = size / 2;

    return (
      <div
        className={cn("relative inline-flex items-center justify-center", className)}
        style={{ width: size, height: size, ...style }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={thickness}
          />
          {/* Progress */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={activeColor}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={animated ? "transition-all duration-500 ease-out" : ""}
            style={{
              filter: `drop-shadow(0 0 4px ${activeColor}60)`,
            }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showValue && (
            <span
              className="font-semibold text-[var(--g0-text-primary)]"
              style={{ fontSize: size / 4 }}
            >
              {Math.round(clampedValue)}%
            </span>
          )}
          {label && (
            <span
              className="text-[var(--g0-text-muted)]"
              style={{ fontSize: size / 8 }}
            >
              {label}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === "gauge") {
    const radius = (size - thickness) / 2;
    const startAngle = -135;
    const endAngle = 135;
    const totalAngle = endAngle - startAngle; // 270 degrees
    const currentAngle = startAngle + (clampedValue / 100) * totalAngle;

    const polarToCartesian = (angle: number, r: number) => {
      const rad = (angle * Math.PI) / 180;
      return {
        x: size / 2 + r * Math.cos(rad),
        y: size / 2 + r * Math.sin(rad),
      };
    };

    const describeArc = (start: number, end: number) => {
      const startPoint = polarToCartesian(start, radius);
      const endPoint = polarToCartesian(end, radius);
      const largeArc = end - start > 180 ? 1 : 0;

      return `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArc} 1 ${endPoint.x} ${endPoint.y}`;
    };

    // Needle
    const needleAngle = currentAngle;
    const needleLength = radius - thickness / 2;
    const needleTip = polarToCartesian(needleAngle, needleLength);
    const needleBase = size / 2;

    // Calculate the vertical offset to center the gauge arc in its container
    // The arc spans from -135° to 135°, so the top of the arc is at y = center - r*sin(45°)
    // and the bottom tips are at y = center + r*sin(45°)
    const arcTopY = size / 2 - radius * Math.sin(Math.PI / 4);
    const arcBottomY = size / 2 + radius * Math.sin(Math.PI / 4);
    const arcHeight = arcBottomY - arcTopY + thickness;
    const valueTextHeight = showValue ? size / 5 : 0;
    const containerHeight = arcHeight + valueTextHeight + 8;

    return (
      <div
        className={cn("relative inline-flex flex-col items-center", className)}
        style={{ width: size, height: containerHeight, ...style }}
      >
        <svg
          width={size}
          height={arcHeight}
          viewBox={`0 ${arcTopY - thickness / 2} ${size} ${arcHeight}`}
          className="overflow-visible"
        >
          {/* Gradient for progress */}
          <defs>
            <linearGradient id={`gauge-gradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={activeColor} stopOpacity="0.6" />
              <stop offset="100%" stopColor={activeColor} />
            </linearGradient>
          </defs>

          {/* Track */}
          <path
            d={describeArc(startAngle, endAngle)}
            fill="none"
            stroke={trackColor}
            strokeWidth={thickness}
            strokeLinecap="round"
          />

          {/* Progress */}
          {clampedValue > 0 && (
            <path
              d={describeArc(startAngle, currentAngle)}
              fill="none"
              stroke={`url(#gauge-gradient-${uniqueId})`}
              strokeWidth={thickness}
              strokeLinecap="round"
              className={animated ? "transition-all duration-500 ease-out" : ""}
              style={{
                filter: `drop-shadow(0 0 4px ${activeColor}60)`,
              }}
            />
          )}

          {/* Needle */}
          <line
            x1={needleBase}
            y1={needleBase}
            x2={needleTip.x}
            y2={needleTip.y}
            stroke="var(--g0-text-primary)"
            strokeWidth={2}
            strokeLinecap="round"
            className={animated ? "transition-all duration-500 ease-out" : ""}
          />
          <circle
            cx={needleBase}
            cy={needleBase}
            r={4}
            fill="var(--g0-text-primary)"
          />
        </svg>

        {/* Value below gauge */}
        {showValue && (
          <span
            className="font-semibold text-[var(--g0-text-primary)] mt-1"
            style={{ fontSize: Math.max(12, size / 6) }}
          >
            {Math.round(clampedValue)}%
          </span>
        )}
        {label && (
          <span
            className="text-[var(--g0-text-muted)]"
            style={{ fontSize: Math.max(10, size / 10) }}
          >
            {label}
          </span>
        )}
      </div>
    );
  }

  return null;
}
