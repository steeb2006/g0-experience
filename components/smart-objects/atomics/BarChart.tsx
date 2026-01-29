"use client";

import { useState, useMemo, CSSProperties, useRef } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, ChartTooltipContent } from "./Tooltip";

export interface BarChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartDataPoint[];
  orientation?: "vertical" | "horizontal";
  showLabels?: boolean;
  showValues?: boolean;
  maxValue?: number;
  barWidth?: number;
  barGap?: number;
  width?: number;
  height?: number;
  colors?: string[];
  animated?: boolean;
  onBarClick?: (data: BarChartDataPoint, index: number) => void;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_COLORS = [
  "var(--g0-accent-violet)",
  "var(--g0-accent-amber)",
  "var(--g0-accent-rose)",
  "#22c55e",
  "#3b82f6",
  "#ec4899",
];

export function BarChart({
  data,
  orientation = "vertical",
  showLabels = true,
  showValues = false,
  maxValue: providedMax,
  barWidth,
  barGap = 8,
  width = 300,
  height = 200,
  colors = DEFAULT_COLORS,
  animated = true,
  onBarClick,
  className,
  style,
}: BarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const maxValue = useMemo(() => {
    if (providedMax) return providedMax;
    return Math.max(...data.map((d) => d.value), 1);
  }, [data, providedMax]);

  const isVertical = orientation === "vertical";

  // Calculate bar dimensions
  const numBars = data.length;
  const availableSpace = isVertical ? width : height;
  const totalGaps = (numBars - 1) * barGap;
  const calculatedBarWidth = barWidth || Math.max(8, (availableSpace - totalGaps - 40) / numBars);

  const handleMouseEnter = (index: number, event: React.MouseEvent) => {
    setHoveredIndex(index);
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleClick = (item: BarChartDataPoint, index: number) => {
    if (onBarClick) {
      onBarClick(item, index);
    }
  };

  const containerStyle: CSSProperties = {
    width,
    height,
    ...style,
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={containerStyle}
    >
      <div
        className={cn(
          "flex items-end justify-center h-full",
          isVertical ? "flex-row" : "flex-col"
        )}
        style={{ gap: barGap }}
      >
        {data.map((item, index) => {
          const barColor = item.color || colors[index % colors.length];
          const percentage = (item.value / maxValue) * 100;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={`${item.label}-${index}`}
              className={cn(
                "flex flex-col items-center",
                isVertical ? "h-full justify-end" : "w-full justify-start"
              )}
            >
              {/* Bar */}
              <div
                className={cn(
                  "relative cursor-pointer transition-all duration-200",
                  isHovered && "scale-105"
                )}
                style={{
                  width: isVertical ? calculatedBarWidth : `${percentage}%`,
                  height: isVertical ? `${percentage}%` : calculatedBarWidth,
                  backgroundColor: barColor,
                  borderRadius: 4,
                  opacity: isHovered ? 1 : 0.85,
                  boxShadow: isHovered
                    ? `0 0 12px ${barColor}40`
                    : undefined,
                  transition: animated
                    ? "width 0.5s ease-out, height 0.5s ease-out, transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease"
                    : undefined,
                }}
                onMouseEnter={(e) => handleMouseEnter(index, e)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(item, index)}
              >
                {/* Value on bar */}
                {showValues && (
                  <span
                    className={cn(
                      "absolute text-xs font-medium text-[var(--g0-text-primary)]",
                      isVertical
                        ? "top-1 left-1/2 -translate-x-1/2"
                        : "right-1 top-1/2 -translate-y-1/2"
                    )}
                  >
                    {item.value}
                  </span>
                )}
              </div>

              {/* Label */}
              {showLabels && isVertical && (
                <span className="mt-2 text-xs text-[var(--g0-text-muted)] truncate max-w-[60px]">
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Horizontal labels */}
      {showLabels && !isVertical && (
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2">
          {data.map((item, index) => (
            <span
              key={`label-${index}`}
              className="text-xs text-[var(--g0-text-muted)] pr-2"
            >
              {item.label}
            </span>
          ))}
        </div>
      )}

      {/* Tooltip */}
      <Tooltip
        x={tooltipPos.x}
        y={tooltipPos.y}
        visible={hoveredIndex !== null}
        content={
          hoveredIndex !== null && (
            <ChartTooltipContent
              label={data[hoveredIndex].label}
              value={data[hoveredIndex].value}
              color={data[hoveredIndex].color || colors[hoveredIndex % colors.length]}
            />
          )
        }
      />
    </div>
  );
}
