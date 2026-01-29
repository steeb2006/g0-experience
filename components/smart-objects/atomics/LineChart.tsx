"use client";

import { useState, useMemo, CSSProperties, useRef, useId } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, ChartTooltipContent } from "./Tooltip";

export interface LineChartDataPoint {
  x: number | string;
  y: number;
}

export interface LineChartSeries {
  data: LineChartDataPoint[];
  color: string;
  label: string;
}

interface LineChartProps {
  // Single series
  data?: LineChartDataPoint[];
  color?: string;
  // Multi-series
  series?: LineChartSeries[];
  // Display options
  showGrid?: boolean;
  showDots?: boolean;
  showArea?: boolean;
  smooth?: boolean;
  showXLabels?: boolean;
  showYLabels?: boolean;
  // Dimensions
  width?: number;
  height?: number;
  padding?: { top?: number; right?: number; bottom?: number; left?: number };
  // Animation
  animated?: boolean;
  // Interaction
  onPointClick?: (point: LineChartDataPoint, seriesIndex: number) => void;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_PADDING = { top: 20, right: 20, bottom: 30, left: 40 };

export function LineChart({
  data,
  color = "var(--g0-accent-violet)",
  series,
  showGrid = true,
  showDots = true,
  showArea = false,
  smooth = true,
  showXLabels = true,
  showYLabels = true,
  width = 400,
  height = 200,
  padding: providedPadding,
  animated = true,
  onPointClick,
  className,
  style,
}: LineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    seriesIndex: number;
    pointIndex: number;
  } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const uniqueId = useId();

  const padding = { ...DEFAULT_PADDING, ...providedPadding };

  // Normalize to multi-series format
  const allSeries: LineChartSeries[] = useMemo(() => {
    if (series) return series;
    if (data) return [{ data, color, label: "Value" }];
    return [];
  }, [data, color, series]);

  // Calculate bounds
  const { minX, maxX, minY, maxY, xLabels } = useMemo(() => {
    let allPoints: LineChartDataPoint[] = [];
    allSeries.forEach((s) => {
      allPoints = [...allPoints, ...s.data];
    });

    if (allPoints.length === 0) {
      return { minX: 0, maxX: 1, minY: 0, maxY: 1, xLabels: [] };
    }

    // Handle string x values
    const xValues = allPoints.map((p) => p.x);
    const xIsString = typeof xValues[0] === "string";
    const xLabels = xIsString
      ? [...new Set(xValues as string[])]
      : [];

    const numericX = xIsString
      ? allPoints.map((_, i) => i)
      : (allPoints.map((p) => p.x) as number[]);

    const yValues = allPoints.map((p) => p.y);

    return {
      minX: Math.min(...numericX),
      maxX: Math.max(...numericX),
      minY: Math.min(0, ...yValues),
      maxY: Math.max(...yValues) * 1.1, // Add 10% headroom
      xLabels,
    };
  }, [allSeries]);

  // Chart area dimensions
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale functions
  const scaleX = (x: number | string): number => {
    if (typeof x === "string") {
      const index = xLabels.indexOf(x);
      return padding.left + (index / Math.max(xLabels.length - 1, 1)) * chartWidth;
    }
    return padding.left + ((x - minX) / (maxX - minX || 1)) * chartWidth;
  };

  const scaleY = (y: number): number => {
    return padding.top + chartHeight - ((y - minY) / (maxY - minY || 1)) * chartHeight;
  };

  // Generate path for a series
  const generatePath = (points: LineChartDataPoint[], isArea = false): string => {
    if (points.length === 0) return "";

    const scaledPoints = points.map((p) => ({
      x: scaleX(p.x),
      y: scaleY(p.y),
    }));

    if (smooth && scaledPoints.length > 2) {
      // Catmull-Rom spline approximation
      let path = `M ${scaledPoints[0].x} ${scaledPoints[0].y}`;

      for (let i = 0; i < scaledPoints.length - 1; i++) {
        const p0 = scaledPoints[Math.max(i - 1, 0)];
        const p1 = scaledPoints[i];
        const p2 = scaledPoints[i + 1];
        const p3 = scaledPoints[Math.min(i + 2, scaledPoints.length - 1)];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }

      if (isArea) {
        path += ` L ${scaledPoints[scaledPoints.length - 1].x} ${scaleY(0)}`;
        path += ` L ${scaledPoints[0].x} ${scaleY(0)} Z`;
      }

      return path;
    } else {
      // Linear path
      let path = scaledPoints
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
        .join(" ");

      if (isArea) {
        path += ` L ${scaledPoints[scaledPoints.length - 1].x} ${scaleY(0)}`;
        path += ` L ${scaledPoints[0].x} ${scaleY(0)} Z`;
      }

      return path;
    }
  };

  // Grid lines
  const gridLines = useMemo(() => {
    const yLines: number[] = [];
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      yLines.push(minY + ((maxY - minY) / steps) * i);
    }
    return yLines;
  }, [minY, maxY]);

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setMousePos({ x: event.clientX, y: event.clientY });

    // Find closest point
    let closest: { seriesIndex: number; pointIndex: number; dist: number } | null = null;

    allSeries.forEach((s, si) => {
      s.data.forEach((p, pi) => {
        const px = scaleX(p.x);
        const py = scaleY(p.y);
        const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);

        if (dist < 30 && (!closest || dist < closest.dist)) {
          closest = { seriesIndex: si, pointIndex: pi, dist };
        }
      });
    });

    setHoveredPoint(closest);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const handleClick = () => {
    if (hoveredPoint && onPointClick) {
      const series = allSeries[hoveredPoint.seriesIndex];
      const point = series.data[hoveredPoint.pointIndex];
      onPointClick(point, hoveredPoint.seriesIndex);
    }
  };

  const containerStyle: CSSProperties = {
    width,
    height,
    ...style,
  };

  return (
    <div className={cn("relative", className)} style={containerStyle}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {/* Gradient definitions */}
        <defs>
          {allSeries.map((s, i) => (
            <linearGradient
              key={`gradient-${uniqueId}-${i}`}
              id={`area-gradient-${uniqueId}-${i}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={s.color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {/* Grid */}
        {showGrid && (
          <g className="grid">
            {gridLines.map((y, i) => (
              <line
                key={`grid-${i}`}
                x1={padding.left}
                y1={scaleY(y)}
                x2={width - padding.right}
                y2={scaleY(y)}
                stroke="var(--g0-bg-elevated-2)"
                strokeWidth="1"
              />
            ))}
          </g>
        )}

        {/* Y-axis labels */}
        {showYLabels && (
          <g className="y-labels">
            {gridLines.map((y, i) => (
              <text
                key={`y-label-${i}`}
                x={padding.left - 8}
                y={scaleY(y)}
                textAnchor="end"
                dominantBaseline="central"
                fill="var(--g0-text-muted)"
                fontSize="10"
              >
                {Math.round(y)}
              </text>
            ))}
          </g>
        )}

        {/* X-axis labels */}
        {showXLabels && xLabels.length > 0 && (
          <g className="x-labels">
            {xLabels.map((label, i) => (
              <text
                key={`x-label-${i}`}
                x={scaleX(label)}
                y={height - padding.bottom + 16}
                textAnchor="middle"
                fill="var(--g0-text-muted)"
                fontSize="10"
              >
                {label}
              </text>
            ))}
          </g>
        )}

        {/* Series */}
        {allSeries.map((s, si) => (
          <g key={`series-${si}`}>
            {/* Area fill */}
            {showArea && (
              <path
                d={generatePath(s.data, true)}
                fill={`url(#area-gradient-${uniqueId}-${si})`}
                className={animated ? "transition-all duration-500" : ""}
              />
            )}

            {/* Line */}
            <path
              d={generatePath(s.data)}
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={animated ? "transition-all duration-500" : ""}
            />

            {/* Dots */}
            {showDots &&
              s.data.map((p, pi) => {
                const isHovered =
                  hoveredPoint?.seriesIndex === si &&
                  hoveredPoint?.pointIndex === pi;

                return (
                  <circle
                    key={`dot-${si}-${pi}`}
                    cx={scaleX(p.x)}
                    cy={scaleY(p.y)}
                    r={isHovered ? 6 : 4}
                    fill={s.color}
                    stroke="var(--g0-bg-base)"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-150"
                    style={{
                      opacity: isHovered ? 1 : 0.8,
                      filter: isHovered ? `drop-shadow(0 0 6px ${s.color})` : undefined,
                    }}
                  />
                );
              })}
          </g>
        ))}

        {/* Crosshair */}
        {hoveredPoint && (
          <line
            x1={scaleX(allSeries[hoveredPoint.seriesIndex].data[hoveredPoint.pointIndex].x)}
            y1={padding.top}
            x2={scaleX(allSeries[hoveredPoint.seriesIndex].data[hoveredPoint.pointIndex].x)}
            y2={height - padding.bottom}
            stroke="var(--g0-text-muted)"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.5"
          />
        )}
      </svg>

      {/* Legend for multi-series */}
      {allSeries.length > 1 && (
        <div className="flex gap-4 justify-center mt-2">
          {allSeries.map((s, i) => (
            <div key={`legend-${i}`} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-[var(--g0-text-muted)]">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tooltip */}
      <Tooltip
        x={mousePos.x}
        y={mousePos.y}
        visible={hoveredPoint !== null}
        content={
          hoveredPoint && (
            <ChartTooltipContent
              label={String(
                allSeries[hoveredPoint.seriesIndex].data[hoveredPoint.pointIndex].x
              )}
              value={allSeries[hoveredPoint.seriesIndex].data[hoveredPoint.pointIndex].y}
              color={allSeries[hoveredPoint.seriesIndex].color}
            />
          )
        }
      />
    </div>
  );
}
