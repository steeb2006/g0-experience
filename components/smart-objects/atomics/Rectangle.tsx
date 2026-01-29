"use client";

import { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface RectangleProps {
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  radius?: number;
  opacity?: number;
  // Background image support
  backgroundImage?: string;
  backgroundSize?: "cover" | "contain" | "auto";
  backgroundPosition?: string;
  className?: string;
  style?: CSSProperties;
}

export function Rectangle({
  width = 100,
  height = 100,
  fill = "transparent",
  stroke,
  strokeWidth = 1,
  radius = 0,
  opacity = 1,
  backgroundImage,
  backgroundSize = "cover",
  backgroundPosition = "center",
  className,
  style,
}: RectangleProps) {
  // Determine if backgroundImage is a gradient or URL
  const isGradient = backgroundImage?.startsWith("linear-gradient") ||
    backgroundImage?.startsWith("radial-gradient") ||
    backgroundImage?.startsWith("conic-gradient");

  const rectStyle: CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: fill,
    backgroundImage: backgroundImage
      ? isGradient
        ? backgroundImage
        : `url(${backgroundImage})`
      : undefined,
    backgroundSize: backgroundImage ? backgroundSize : undefined,
    backgroundPosition: backgroundImage ? backgroundPosition : undefined,
    backgroundRepeat: backgroundImage ? "no-repeat" : undefined,
    borderColor: stroke,
    borderWidth: stroke ? `${strokeWidth}px` : undefined,
    borderStyle: stroke ? "solid" : undefined,
    borderRadius: `${radius}px`,
    opacity,
    ...style,
  };

  return (
    <div
      className={cn(className)}
      style={rectStyle}
    />
  );
}
