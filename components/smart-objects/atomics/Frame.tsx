"use client";

import { ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface FrameProps {
  children?: ReactNode;
  width?: number | string;
  height?: number | string;
  padding?: number;
  background?: string;
  // Background image support
  backgroundImage?: string;
  backgroundSize?: "cover" | "contain" | "auto";
  backgroundPosition?: string;
  border?: {
    color: string;
    width: number;
    radius?: number;
  };
  className?: string;
  style?: CSSProperties;
}

export function Frame({
  children,
  width,
  height,
  padding,
  background,
  backgroundImage,
  backgroundSize = "cover",
  backgroundPosition = "center",
  border,
  className,
  style,
}: FrameProps) {
  // Determine if backgroundImage is a gradient or URL
  const isGradient = backgroundImage?.startsWith("linear-gradient") ||
    backgroundImage?.startsWith("radial-gradient") ||
    backgroundImage?.startsWith("conic-gradient");

  const frameStyle: CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    padding: padding ? `${padding}px` : undefined,
    background,
    backgroundImage: backgroundImage
      ? isGradient
        ? backgroundImage
        : `url(${backgroundImage})`
      : undefined,
    backgroundSize: backgroundImage ? backgroundSize : undefined,
    backgroundPosition: backgroundImage ? backgroundPosition : undefined,
    backgroundRepeat: backgroundImage ? "no-repeat" : undefined,
    borderColor: border?.color,
    borderWidth: border?.width ? `${border.width}px` : undefined,
    borderStyle: border?.width ? "solid" : undefined,
    borderRadius: border?.radius ? `${border.radius}px` : undefined,
    ...style,
  };

  return (
    <div
      className={cn("relative", className)}
      style={frameStyle}
    >
      {children}
    </div>
  );
}
