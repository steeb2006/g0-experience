"use client";

import { useState, useMemo, CSSProperties, useId } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, ChartTooltipContent } from "./Tooltip";

export interface DonutChartDataPoint {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutChartDataPoint[];
  innerRadius?: number; // 0 for PieChart
  showLabels?: boolean;
  showPercentages?: boolean;
  centerLabel?: string;
  centerValue?: string | number;
  width?: number;
  height?: number;
  animated?: boolean;
  onSegmentClick?: (data: DonutChartDataPoint, index: number) => void;
  className?: string;
  style?: CSSProperties;
}

export function DonutChart({
  data,
  innerRadius = 0.6, // 0 = pie, 0.6 = donut
  showLabels = false,
  showPercentages = false,
  centerLabel,
  centerValue,
  width = 200,
  height = 200,
  animated = true,
  onSegmentClick,
  className,
  style,
}: DonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const uniqueId = useId();

  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  const size = Math.min(width, height);
  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = size / 2 - 4; // Leave space for hover effect
  const inner = outerRadius * innerRadius;

  // Calculate arc paths
  const arcs = useMemo(() => {
    let currentAngle = -Math.PI / 2; // Start from top

    return data.map((item, index) => {
      const percentage = item.value / total;
      const angle = percentage * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      // Calculate path
      const x1 = centerX + outerRadius * Math.cos(startAngle);
      const y1 = centerY + outerRadius * Math.sin(startAngle);
      const x2 = centerX + outerRadius * Math.cos(endAngle);
      const y2 = centerY + outerRadius * Math.sin(endAngle);
      const x3 = centerX + inner * Math.cos(endAngle);
      const y3 = centerY + inner * Math.sin(endAngle);
      const x4 = centerX + inner * Math.cos(startAngle);
      const y4 = centerY + inner * Math.sin(startAngle);

      const largeArcFlag = angle > Math.PI ? 1 : 0;

      // Arc path for donut
      const path =
        inner > 0
          ? `M ${x1} ${y1}
             A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
             L ${x3} ${y3}
             A ${inner} ${inner} 0 ${largeArcFlag} 0 ${x4} ${y4}
             Z`
          : `M ${centerX} ${centerY}
             L ${x1} ${y1}
             A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
             Z`;

      // Label position (middle of arc)
      const labelAngle = startAngle + angle / 2;
      const labelRadius = (outerRadius + inner) / 2;
      const labelX = centerX + labelRadius * Math.cos(labelAngle);
      const labelY = centerY + labelRadius * Math.sin(labelAngle);

      return {
        path,
        percentage,
        labelX,
        labelY,
        midAngle: labelAngle,
        ...item,
      };
    });
  }, [data, total, centerX, centerY, outerRadius, inner]);

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

  const handleClick = (item: DonutChartDataPoint, index: number) => {
    if (onSegmentClick) {
      onSegmentClick(item, index);
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
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Gradient definitions for glow effect */}
        <defs>
          {arcs.map((arc, index) => (
            <filter
              key={`glow-${uniqueId}-${index}`}
              id={`glow-${uniqueId}-${index}`}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor={arc.color} floodOpacity="0.4" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {/* Arcs */}
        {arcs.map((arc, index) => {
          const isHovered = hoveredIndex === index;
          return (
            <g key={`arc-${index}`}>
              <path
                d={arc.path}
                fill={arc.color}
                opacity={isHovered ? 1 : 0.85}
                filter={isHovered ? `url(#glow-${uniqueId}-${index})` : undefined}
                className="cursor-pointer transition-all duration-200"
                style={{
                  transform: isHovered
                    ? `translate(${Math.cos(arc.midAngle) * 4}px, ${Math.sin(arc.midAngle) * 4}px)`
                    : undefined,
                  transformOrigin: `${centerX}px ${centerY}px`,
                }}
                onMouseEnter={(e) => handleMouseEnter(index, e)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(arc, index)}
              />
              {/* Percentage labels on arc */}
              {showPercentages && arc.percentage > 0.05 && (
                <text
                  x={arc.labelX}
                  y={arc.labelY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize="12"
                  fontWeight="500"
                  pointerEvents="none"
                >
                  {Math.round(arc.percentage * 100)}%
                </text>
              )}
            </g>
          );
        })}

        {/* Center content */}
        {(centerLabel || centerValue) && (
          <g>
            {centerValue && (
              <text
                x={centerX}
                y={centerY - (centerLabel ? 8 : 0)}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--g0-text-primary)"
                fontSize="20"
                fontWeight="600"
              >
                {centerValue}
              </text>
            )}
            {centerLabel && (
              <text
                x={centerX}
                y={centerY + (centerValue ? 12 : 0)}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--g0-text-muted)"
                fontSize="12"
              >
                {centerLabel}
              </text>
            )}
          </g>
        )}
      </svg>

      {/* Legend */}
      {showLabels && (
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-full flex flex-col gap-2">
          {data.map((item, index) => (
            <div
              key={`legend-${index}`}
              className={cn(
                "flex items-center gap-2 text-xs cursor-pointer transition-opacity",
                hoveredIndex !== null && hoveredIndex !== index && "opacity-50"
              )}
              onMouseEnter={(e) => handleMouseEnter(index, e)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(item, index)}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[var(--g0-text-muted)] whitespace-nowrap">
                {item.label}
              </span>
            </div>
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
              color={data[hoveredIndex].color}
              secondaryLabel="Share"
              secondaryValue={`${Math.round(arcs[hoveredIndex].percentage * 100)}%`}
            />
          )
        }
      />
    </div>
  );
}

// Convenience wrapper for PieChart
export function PieChart(props: Omit<DonutChartProps, "innerRadius">) {
  return <DonutChart {...props} innerRadius={0} />;
}
