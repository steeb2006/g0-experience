"use client";

import { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  name?: string;
  className?: string;
  style?: CSSProperties;
}

export function Avatar({
  src,
  alt = "Avatar",
  size = 40,
  name,
  className,
  style,
}: AvatarProps) {
  // Generate initials from name if no image
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : null;

  const avatarStyle: CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--g0-bg-elevated-2)",
    color: "var(--g0-text-muted)",
    fontSize: `${size * 0.4}px`,
    fontWeight: 600,
    ...style,
  };

  if (src) {
    return (
      <div className={cn(className)} style={avatarStyle}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Hide broken image, show fallback
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Fallback shown when image fails */}
        {initials ? (
          <span className="absolute">{initials}</span>
        ) : (
          <User className="absolute" style={{ width: `${size * 0.5}px`, height: `${size * 0.5}px` }} />
        )}
      </div>
    );
  }

  // No image - show initials or icon
  return (
    <div className={cn(className)} style={avatarStyle}>
      {initials ? (
        <span>{initials}</span>
      ) : (
        <User style={{ width: `${size * 0.5}px`, height: `${size * 0.5}px` }} />
      )}
    </div>
  );
}
