"use client";

import { CSSProperties } from "react";
import type { AtomicDefinition, AtomicStyle } from "@/lib/schemas/types";
import { resolveBinding } from "@/lib/schemas/bindings";
import {
  Text,
  Sparkline,
  Frame,
  Rectangle,
  Circle,
  Avatar,
  Badge,
  Line,
  Image,
  RadarChart,
  BarChart,
  DonutChart,
  LineChart,
  ProgressBar,
  Edge,
  Arrow,
  Icon,
} from "./atomics";
import type {
  OceanData,
  BarChartDataPoint,
  DonutChartDataPoint,
  LineChartDataPoint,
} from "./atomics";

interface AtomicRendererProps {
  definition: AtomicDefinition;
  data: Record<string, unknown>;
}

/**
 * Render an atomic object from a schema definition
 * Resolves data bindings and renders the appropriate component
 */
export function AtomicRenderer({ definition, data }: AtomicRendererProps) {
  // Resolve binding if present
  const boundValue = definition.binding
    ? resolveBinding(definition.binding, data)
    : null;

  // Build position style
  const positionStyle: CSSProperties = {
    position: "absolute",
    left: definition.position.x,
    top: definition.position.y,
  };

  // Common style props from definition
  const styleProps = mapStyleToProps(definition.style);

  // Render based on type
  switch (definition.type) {
    case "Frame":
      return (
        <div style={positionStyle}>
          <Frame
            width={definition.size?.width}
            height={definition.size?.height}
            padding={definition.style?.radius}
            background={definition.style?.fill}
            backgroundImage={definition.style?.backgroundImage}
            backgroundSize={definition.style?.backgroundSize}
            backgroundPosition={definition.style?.backgroundPosition}
          >
            {definition.children?.map((child) => (
              <AtomicRenderer key={child.id} definition={child} data={data} />
            ))}
          </Frame>
        </div>
      );

    case "Text":
      return (
        <div style={positionStyle}>
          <Text
            variant={styleProps.textVariant}
            color={styleProps.textColor}
            style={styleProps.style}
          >
            {boundValue?.found ? String(boundValue.value) : definition.content || ""}
          </Text>
        </div>
      );

    case "Label":
      return (
        <div style={positionStyle}>
          <Text
            variant="small"
            color="muted"
            style={styleProps.style}
          >
            {boundValue?.found ? String(boundValue.value) : definition.content || ""}
          </Text>
        </div>
      );

    case "Badge":
      return (
        <div style={positionStyle}>
          <Badge
            variant={styleProps.badgeVariant}
            style={styleProps.style}
          >
            {boundValue?.found ? String(boundValue.value) : definition.content || ""}
          </Badge>
        </div>
      );

    case "Avatar":
      const avatarSrc = boundValue?.found ? String(boundValue.value) : definition.src;
      return (
        <div style={positionStyle}>
          <Avatar
            src={avatarSrc}
            size={definition.size?.width || definition.radius ? (definition.radius || 0) * 2 : 40}
            alt={definition.alt}
          />
        </div>
      );

    case "Image":
      const imageSrc = boundValue?.found ? String(boundValue.value) : definition.src;
      return (
        <div style={positionStyle}>
          <Image
            src={imageSrc}
            alt={definition.alt}
            width={definition.size?.width}
            height={definition.size?.height}
            radius={definition.style?.radius}
          />
        </div>
      );

    case "Icon":
      const iconName = boundValue?.found ? String(boundValue.value) : definition.content || "Circle";
      return (
        <div style={positionStyle}>
          <Icon
            name={iconName}
            size={definition.size?.width || 24}
            color={definition.style?.fill || definition.style?.stroke}
          />
        </div>
      );

    case "Rectangle":
      return (
        <div style={positionStyle}>
          <Rectangle
            width={definition.size?.width || 100}
            height={definition.size?.height || 100}
            fill={definition.style?.fill}
            stroke={definition.style?.stroke}
            strokeWidth={definition.style?.strokeWidth}
            radius={definition.style?.radius}
            opacity={definition.style?.opacity}
            backgroundImage={definition.style?.backgroundImage}
            backgroundSize={definition.style?.backgroundSize}
            backgroundPosition={definition.style?.backgroundPosition}
          />
        </div>
      );

    case "Circle":
      return (
        <div style={positionStyle}>
          <Circle
            radius={definition.radius || 50}
            fill={boundValue?.found && typeof boundValue.value === "string"
              ? boundValue.value
              : definition.style?.fill}
            stroke={definition.style?.stroke}
            strokeWidth={definition.style?.strokeWidth}
            opacity={definition.style?.opacity}
            backgroundImage={definition.style?.backgroundImage}
            backgroundSize={definition.style?.backgroundSize}
            backgroundPosition={definition.style?.backgroundPosition}
          />
        </div>
      );

    case "Line":
      return (
        <div style={positionStyle}>
          <Line
            width={definition.size?.width}
            height={definition.size?.height}
            stroke={definition.style?.stroke}
            strokeWidth={definition.style?.strokeWidth || 1}
          />
        </div>
      );

    case "Sparkline":
      const sparklineData = boundValue?.found && Array.isArray(boundValue.value)
        ? boundValue.value as number[]
        : definition.data as number[] || [];
      return (
        <div style={positionStyle}>
          <Sparkline
            data={sparklineData}
            width={definition.size?.width || 100}
            height={definition.size?.height || 32}
            color={definition.style?.stroke || "var(--g0-accent-amber)"}
          />
        </div>
      );

    case "RadarChart":
      const radarData = boundValue?.found
        ? boundValue.value as OceanData
        : (definition.data as OceanData) || {
            openness: 50,
            conscientiousness: 50,
            extraversion: 50,
            agreeableness: 50,
            neuroticism: 50,
          };
      return (
        <div style={positionStyle}>
          <RadarChart
            data={radarData}
            width={definition.size?.width || 300}
            height={definition.size?.height || 300}
            showLabels={definition.showLabels ?? true}
            showValues={definition.showValues ?? true}
            showGrid={definition.showGrid ?? true}
          />
        </div>
      );

    case "BarChart":
      const barData = boundValue?.found && Array.isArray(boundValue.value)
        ? boundValue.value as BarChartDataPoint[]
        : (definition.data as BarChartDataPoint[]) || [];
      return (
        <div style={positionStyle}>
          <BarChart
            data={barData}
            width={definition.size?.width || 300}
            height={definition.size?.height || 200}
            showLabels={definition.showLabels ?? true}
            showValues={definition.showValues ?? false}
          />
        </div>
      );

    case "PieChart":
    case "DonutChart":
      const donutData = boundValue?.found && Array.isArray(boundValue.value)
        ? boundValue.value as DonutChartDataPoint[]
        : (definition.data as DonutChartDataPoint[]) || [];
      return (
        <div style={positionStyle}>
          <DonutChart
            data={donutData}
            width={definition.size?.width || 200}
            height={definition.size?.height || 200}
            innerRadius={definition.type === "PieChart" ? 0 : 0.6}
            showLabels={definition.showLabels ?? false}
            showPercentages={definition.showValues ?? false}
          />
        </div>
      );

    case "LineChart":
      const lineData = boundValue?.found && Array.isArray(boundValue.value)
        ? boundValue.value as LineChartDataPoint[]
        : (definition.data as LineChartDataPoint[]) || [];
      return (
        <div style={positionStyle}>
          <LineChart
            data={lineData}
            width={definition.size?.width || 400}
            height={definition.size?.height || 200}
            showGrid={definition.showGrid ?? true}
            showDots={definition.showLabels ?? true}
            color={definition.style?.stroke || "var(--g0-accent-violet)"}
          />
        </div>
      );

    case "Edge":
      // Edge requires from/to coordinates - for schema use, interpret size as endpoint offset
      const edgeFrom = { x: 0, y: 0 };
      const edgeTo = {
        x: definition.size?.width || 100,
        y: definition.size?.height || 0,
      };
      return (
        <Edge
          from={edgeFrom}
          to={edgeTo}
          stroke={definition.style?.stroke || "var(--g0-text-muted)"}
          strokeWidth={definition.style?.strokeWidth || 2}
          style={positionStyle}
        />
      );

    case "Arrow":
      // Arrow is an Edge with end arrow
      const arrowFrom = { x: 0, y: 0 };
      const arrowTo = {
        x: definition.size?.width || 100,
        y: definition.size?.height || 0,
      };
      return (
        <Arrow
          from={arrowFrom}
          to={arrowTo}
          stroke={definition.style?.stroke || "var(--g0-text-muted)"}
          strokeWidth={definition.style?.strokeWidth || 2}
          style={positionStyle}
        />
      );

    // Unsupported types render as placeholder
    default:
      return (
        <div
          style={{
            ...positionStyle,
            padding: "8px",
            backgroundColor: "var(--g0-bg-elevated-2)",
            borderRadius: "4px",
            fontSize: "12px",
            color: "var(--g0-text-muted)",
          }}
        >
          [{definition.type}]
        </div>
      );
  }
}

/**
 * Map schema style to component props
 */
function mapStyleToProps(style?: AtomicStyle): {
  textVariant?: "display" | "h1" | "h2" | "h3" | "body" | "small" | "mono";
  textColor?: "primary" | "secondary" | "muted" | "inverse" | "amber" | "violet" | "rose";
  badgeVariant?: "default" | "success" | "warning" | "error" | "info" | "outline";
  style?: CSSProperties;
} {
  if (!style) {
    return {};
  }

  // Map text variants
  const textVariant = style.variant as "h1" | "h2" | "h3" | "body" | "small" | undefined;

  // Map text colors
  let textColor: "primary" | "secondary" | "muted" | "inverse" | "amber" | "violet" | "rose" | undefined;
  if (style.color === "primary" || style.color === "secondary" || style.color === "muted") {
    textColor = style.color;
  }

  // Map badge variants based on color
  let badgeVariant: "default" | "success" | "warning" | "error" | "info" | "outline" | undefined;
  if (style.color === "accent") {
    badgeVariant = "info";
  }

  // Build inline style for custom values
  const inlineStyle: CSSProperties = {};
  if (style.weight) {
    inlineStyle.fontWeight = style.weight === "bold" ? 700 : style.weight === "semibold" ? 600 : 400;
  }
  if (style.align) {
    inlineStyle.textAlign = style.align;
  }

  return {
    textVariant,
    textColor,
    badgeVariant,
    style: Object.keys(inlineStyle).length > 0 ? inlineStyle : undefined,
  };
}
