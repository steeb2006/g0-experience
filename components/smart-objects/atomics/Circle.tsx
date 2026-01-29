"use client";

import { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CircleProps {
  radius?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  // Background image support
  backgroundImage?: string;
  backgroundSize?: "cover" | "contain" | "auto";
  backgroundPosition?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Circle({
  radius = 50,
  fill = "transparent",
  stroke,
  strokeWidth = 1,
  opacity = 1,
  backgroundImage,
  backgroundSize = "cover",
  backgroundPosition = "center",
  children,
  className,
  style,
}: CircleProps) {
  const diameter = radius * 2;

  // Determine if backgroundImage is a gradient or URL
  const isGradient = backgroundImage?.startsWith("linear-gradient") ||
    backgroundImage?.startsWith("radial-gradient") ||
    backgroundImage?.startsWith("conic-gradient");

  const circleStyle: CSSProperties = {
    width: `${diameter}px`,
    height: `${diameter}px`,
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
    borderRadius: "50%",
    opacity,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...style,
  };

  return (
    <div
      className={cn(className)}
      style={circleStyle}
    >
      {children}
    </div>
  );
}
