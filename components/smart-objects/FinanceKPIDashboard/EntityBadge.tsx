"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EntityBadgeProps {
  name: string;
  avatar?: string;
  isActive?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function EntityBadge({
  name,
  avatar,
  isActive = true,
  size = "md",
  className,
}: EntityBadgeProps) {
  const sizeConfig = {
    sm: { size: 72, text: "text-xs", ring: 2 },
    md: { size: 100, text: "text-sm", ring: 2 },
    lg: { size: 120, text: "text-base", ring: 3 },
  };

  const config = sizeConfig[size];

  return (
    <motion.div
      className={cn("relative", className)}
      style={{ width: config.size, height: config.size }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Subtle glow effect - blue */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Circle container */}
      <div
        className="absolute inset-0 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #111111 0%, #0a0a0a 100%)",
          border: `${config.ring}px solid #3b82f6`,
          boxShadow: isActive ? "0 0 30px rgba(59, 130, 246, 0.2)" : "none",
        }}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span
            className={cn(
              "font-semibold text-center px-2",
              config.text
            )}
            style={{ color: "#60a5fa" }}
          >
            {name}
          </span>
        )}
      </div>

      {/* Status dot */}
      {isActive && (
        <motion.div
          className="absolute z-10"
          style={{
            bottom: size === "lg" ? 4 : 2,
            right: size === "lg" ? 4 : 2,
            width: size === "lg" ? 14 : 10,
            height: size === "lg" ? 14 : 10,
            borderRadius: "50%",
            background: "#22c55e",
            border: "2px solid #000000",
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
