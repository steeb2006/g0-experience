"use client";

import { cn } from "@/lib/utils";

export interface OceanData {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

interface RadarChartProps {
  data: OceanData;
  width?: number;
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  showGrid?: boolean;
  colors?: {
    openness?: string;
    conscientiousness?: string;
    extraversion?: string;
    agreeableness?: string;
    neuroticism?: string;
  };
  fillColor?: string;
  strokeColor?: string;
  className?: string;
}

// Default trait colors
const defaultColors = {
  openness: "#f59e0b",         // amber
  conscientiousness: "#f43f5e", // rose
  extraversion: "#8b5cf6",      // violet
  agreeableness: "#10b981",     // emerald
  neuroticism: "#f97316",       // orange
};

// Trait labels and their angles (72° apart, starting from top)
const traits: Array<{
  key: keyof OceanData;
  label: string;
  shortLabel: string;
  angle: number;
}> = [
  { key: "openness", label: "Openness", shortLabel: "O", angle: -90 },
  { key: "conscientiousness", label: "Conscientiousness", shortLabel: "C", angle: -18 },
  { key: "extraversion", label: "Extraversion", shortLabel: "E", angle: 54 },
  { key: "agreeableness", label: "Agreeableness", shortLabel: "A", angle: 126 },
  { key: "neuroticism", label: "Neuroticism", shortLabel: "N", angle: 198 },
];

export function RadarChart({
  data,
  width = 300,
  height = 300,
  showLabels = true,
  showValues = true,
  showGrid = true,
  colors = defaultColors,
  fillColor,
  strokeColor,
  className,
}: RadarChartProps) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 50; // Leave room for labels

  // Convert angle (degrees) to radians
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  // Calculate point position from center
  const getPoint = (angle: number, value: number) => {
    const normalizedValue = Math.max(0, Math.min(100, value)) / 100;
    const rad = toRadians(angle);
    return {
      x: centerX + Math.cos(rad) * radius * normalizedValue,
      y: centerY + Math.sin(rad) * radius * normalizedValue,
    };
  };

  // Get points for the data polygon
  const dataPoints = traits.map((trait) => ({
    ...getPoint(trait.angle, data[trait.key]),
    trait,
    value: data[trait.key],
  }));

  // Create polygon path
  const polygonPath = dataPoints
    .map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ") + " Z";

  // Grid circles at 20%, 40%, 60%, 80%, 100%
  const gridLevels = [20, 40, 60, 80, 100];

  // Generate unique gradient ID
  const gradientId = `radar-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
    >
      {/* Gradient definition */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={fillColor || "#8b5cf6"} stopOpacity="0.6" />
          <stop offset="50%" stopColor={fillColor || "#f59e0b"} stopOpacity="0.4" />
          <stop offset="100%" stopColor={fillColor || "#10b981"} stopOpacity="0.2" />
        </linearGradient>

        {/* Glow filter for the polygon */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid circles */}
      {showGrid && gridLevels.map((level) => (
        <circle
          key={level}
          cx={centerX}
          cy={centerY}
          r={(radius * level) / 100}
          fill="none"
          stroke="var(--g0-bg-elevated-3)"
          strokeWidth={level === 100 ? 1.5 : 0.5}
          strokeOpacity={level === 100 ? 0.6 : 0.3}
          strokeDasharray={level === 100 ? "none" : "4 4"}
        />
      ))}

      {/* Radial axis lines */}
      {traits.map((trait) => {
        const outerPoint = getPoint(trait.angle, 100);
        return (
          <line
            key={trait.key}
            x1={centerX}
            y1={centerY}
            x2={outerPoint.x}
            y2={outerPoint.y}
            stroke="var(--g0-bg-elevated-3)"
            strokeWidth={0.75}
            strokeOpacity={0.4}
          />
        );
      })}

      {/* Data polygon - filled area */}
      <path
        d={polygonPath}
        fill={`url(#${gradientId})`}
        stroke={strokeColor || "var(--g0-accent-violet)"}
        strokeWidth={2}
        strokeLinejoin="round"
        filter="url(#glow)"
      />

      {/* Data points on vertices */}
      {dataPoints.map((point) => (
        <g key={point.trait.key}>
          {/* Outer ring */}
          <circle
            cx={point.x}
            cy={point.y}
            r={8}
            fill="var(--g0-bg-elevated-1)"
            stroke={colors[point.trait.key] || defaultColors[point.trait.key]}
            strokeWidth={2}
          />
          {/* Inner dot */}
          <circle
            cx={point.x}
            cy={point.y}
            r={4}
            fill={colors[point.trait.key] || defaultColors[point.trait.key]}
          />
        </g>
      ))}

      {/* Labels and values */}
      {traits.map((trait) => {
        const labelPoint = getPoint(trait.angle, 125); // Position outside the chart
        const value = data[trait.key];
        const traitColor = colors[trait.key] || defaultColors[trait.key];

        // Adjust text anchor based on position
        let textAnchor: "start" | "middle" | "end" = "middle";
        if (labelPoint.x < centerX - 10) textAnchor = "end";
        if (labelPoint.x > centerX + 10) textAnchor = "start";

        // Adjust vertical alignment
        let dy = "0.35em";
        if (trait.angle === -90) dy = "0em"; // Top
        if (trait.angle > 90 && trait.angle < 270) dy = "0.7em"; // Bottom half

        return (
          <g key={`label-${trait.key}`}>
            {showLabels && (
              <text
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor={textAnchor}
                dy={dy}
                className="text-xs font-medium"
                fill={traitColor}
              >
                {trait.label}
              </text>
            )}
            {showValues && (
              <text
                x={labelPoint.x}
                y={labelPoint.y + (showLabels ? 16 : 0)}
                textAnchor={textAnchor}
                className="text-sm font-bold"
                fill="var(--g0-text-primary)"
              >
                {value}
              </text>
            )}
          </g>
        );
      })}

      {/* Center point */}
      <circle
        cx={centerX}
        cy={centerY}
        r={3}
        fill="var(--g0-bg-elevated-3)"
      />
    </svg>
  );
}
