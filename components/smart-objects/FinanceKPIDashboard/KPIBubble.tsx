"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "../atomics";
import type { KPI } from "@/lib/mock-data/finance-dashboard";
import { formatKPIValue, formatChange } from "@/lib/mock-data/finance-dashboard";

interface KPIBubbleProps {
  kpi: KPI;
  index?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const colorMap: Record<string, string> = {
  lime: "var(--g0-data-6)",
  rose: "var(--g0-data-4)",
  amber: "var(--g0-data-1)",
  teal: "var(--g0-data-3)",
  violet: "var(--g0-data-2)",
  sky: "var(--g0-data-5)",
};

export function KPIBubble({
  kpi,
  index = 0,
  size = "md",
  className,
}: KPIBubbleProps) {
  const sizeConfig = {
    sm: { container: "w-24 h-24 p-3", value: "text-lg", label: "text-[10px]" },
    md: { container: "w-32 h-32 p-4", value: "text-xl", label: "text-xs" },
    lg: { container: "w-40 h-40 p-5", value: "text-2xl", label: "text-sm" },
  };

  const config = sizeConfig[size];
  const color = colorMap[kpi.color || "amber"] || colorMap.amber;

  const TrendIcon = kpi.trend === "up"
    ? TrendingUp
    : kpi.trend === "down"
    ? TrendingDown
    : Minus;

  return (
    <motion.div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl",
        "bg-[var(--g0-bg-elevated-1)] border border-[var(--g0-bg-elevated-3)]",
        "transition-all duration-200 hover:border-opacity-60",
        config.container,
        className
      )}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 8px 30px -12px ${color}40`,
      }}
      style={{
        borderColor: `${color}30`,
      }}
    >
      {/* Accent line at top */}
      <div
        className="absolute left-4 right-4 top-0 h-0.5 rounded-full"
        style={{ backgroundColor: color }}
      />

      {/* Label */}
      <Text
        variant="small"
        color="secondary"
        className={cn("mb-1", config.label)}
      >
        {kpi.label}
      </Text>

      {/* Value */}
      <Text
        variant="h2"
        className={cn("font-bold tabular-nums", config.value)}
        style={{ color }}
      >
        {formatKPIValue(kpi)}
      </Text>

      {/* Change indicator */}
      {kpi.change !== undefined && (
        <div className="mt-1 flex items-center gap-1">
          <TrendIcon
            className={cn(
              "h-3 w-3",
              kpi.trend === "up" && "text-[var(--g0-data-6)]",
              kpi.trend === "down" && "text-[var(--g0-data-4)]",
              kpi.trend === "flat" && "text-[var(--g0-text-muted)]"
            )}
          />
          <Text
            variant="small"
            className={cn(
              "tabular-nums",
              kpi.trend === "up" && "text-[var(--g0-data-6)]",
              kpi.trend === "down" && "text-[var(--g0-data-4)]",
              kpi.trend === "flat" && "text-[var(--g0-text-muted)]"
            )}
          >
            {formatChange(kpi.change, kpi.format !== "number")}
            {kpi.changeLabel && ` ${kpi.changeLabel}`}
          </Text>
        </div>
      )}

      {/* Runway indicator for cash */}
      {kpi.runway !== undefined && (
        <div className="mt-1 flex items-center gap-1">
          <Text variant="small" color="secondary">
            {kpi.runway} mo runway
          </Text>
        </div>
      )}
    </motion.div>
  );
}
