"use client";

import { CSSProperties, useState } from "react";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

interface ImageProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  fit?: "cover" | "contain" | "fill" | "none";
  radius?: number;
  className?: string;
  style?: CSSProperties;
}

export function Image({
  src,
  alt = "Image",
  width,
  height,
  fit = "cover",
  radius = 0,
  className,
  style,
}: ImageProps) {
  const [hasError, setHasError] = useState(false);

  const containerStyle: CSSProperties = {
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
    borderRadius: `${radius}px`,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--g0-bg-elevated-2)",
    ...style,
  };

  if (!src || hasError) {
    return (
      <div className={cn(className)} style={containerStyle}>
        <ImageIcon
          className="text-[var(--g0-text-muted)]"
          style={{
            width: Math.min((width || 100) * 0.4, 48),
            height: Math.min((height || 100) * 0.4, 48),
          }}
        />
      </div>
    );
  }

  return (
    <div className={cn(className)} style={containerStyle}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full"
        style={{ objectFit: fit }}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
