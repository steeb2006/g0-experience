"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Clock,
  CheckCircle,
  Briefcase,
  Calendar,
  Target,
  DollarSign,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "../atomics";
import type { RecruitingKPI } from "@/lib/mock-data/recruiting-dashboard";
import { formatRecruitingKPIValue, formatRecruitingChange } from "@/lib/mock-data/recruiting-dashboard";

interface RecruitingKPIBubbleProps {
  kpi: RecruitingKPI;
  index?: number;
  className?: string;
}

const colorMap: Record<string, string> = {
  blue: "#3b82f6",
  cyan: "#06b6d4",
  violet: "#8b5cf6",
  amber: "#f59e0b",
  green: "#22c55e",
  lime: "#84cc16",
  teal: "#14b8a6",
  rose: "#f43f5e",
};

const iconMap: Record<string, React.ElementType> = {
  open_positions: Briefcase,
  active_candidates: Users,
  interviews_week: Calendar,
  offers_pending: CheckCircle,
  time_to_hire: Clock,
  offer_acceptance: CheckCircle,
  quality_score: Star,
  budget_util: DollarSign,
};

export function RecruitingKPIBubble({ kpi, index = 0, className }: RecruitingKPIBubbleProps) {
  const color = colorMap[kpi.color || "violet"] || colorMap.violet;
  const Icon = iconMap[kpi.id] || Target;

  const TrendIcon =
    kpi.trend === "up"
      ? TrendingUp
      : kpi.trend === "down"
      ? TrendingDown
      : Minus;

  // For time_to_hire, down is good
  const isPositiveTrend =
    kpi.trend === "down" && kpi.id === "time_to_hire"
      ? true
      : kpi.trend === "up";

  return (
    <motion.div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl p-4",
        "bg-[var(--g0-bg-elevated-1)] border border-[var(--g0-bg-elevated-3)]",
        "transition-all duration-200 hover:border-opacity-60",
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

      {/* Icon and Label */}
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3.5 w-3.5" style={{ color }} />
        <Text variant="small" color="secondary">
          {kpi.label}
        </Text>
      </div>

      {/* Value */}
      <Text
        variant="h2"
        className="tabular-nums text-xl"
        style={{ color }}
      >
        {formatRecruitingKPIValue(kpi)}
      </Text>

      {/* Target indicator for quality score */}
      {kpi.target !== undefined && (
        <Text variant="small" color="muted" className="mt-0.5">
          / {kpi.target}
        </Text>
      )}

      {/* Change indicator */}
      {kpi.change !== undefined && kpi.trend && (
        <div className="mt-1 flex items-center gap-1">
          <TrendIcon
            className={cn(
              "h-3 w-3",
              isPositiveTrend ? "text-[#22c55e]" : "text-[#ef4444]"
            )}
          />
          <Text
            variant="small"
            className={cn(
              "tabular-nums",
              isPositiveTrend ? "text-[#22c55e]" : "text-[#ef4444]"
            )}
          >
            {formatRecruitingChange(kpi.change, kpi.format)}
          </Text>
        </div>
      )}

      {/* Change label without trend */}
      {kpi.changeLabel && !kpi.trend && (
        <Text variant="small" color="muted" className="mt-1">
          {kpi.change !== undefined && `+${kpi.change} `}
          {kpi.changeLabel}
        </Text>
      )}
    </motion.div>
  );
}
