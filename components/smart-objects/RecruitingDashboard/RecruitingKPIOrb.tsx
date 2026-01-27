"use client";

import { motion, useDragControls, PanInfo } from "framer-motion";
import { useState } from "react";
import {
  Clock,
  Calendar,
  Star,
  CheckCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "../atomics";
import type { RecruitingKPI } from "@/lib/mock-data/recruiting-dashboard";
import { formatRecruitingKPIValue, formatRecruitingChange } from "@/lib/mock-data/recruiting-dashboard";

interface RecruitingKPIOrbProps {
  kpi: RecruitingKPI;
  x: number;
  y: number;
  index?: number;
  isEditMode?: boolean;
  onDragEnd?: (x: number, y: number) => void;
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
  time_to_hire: Clock,
  interviews_week: Calendar,
  quality_score: Star,
  offers_pending: CheckCircle,
  offer_acceptance: CheckCircle,
  budget_util: DollarSign,
};

export function RecruitingKPIOrb({
  kpi,
  x,
  y,
  index = 0,
  isEditMode = false,
  onDragEnd,
  className,
}: RecruitingKPIOrbProps) {
  const [position, setPosition] = useState({ x, y });
  const dragControls = useDragControls();
  const color = colorMap[kpi.color || "violet"] || colorMap.violet;
  const Icon = iconMap[kpi.id] || Star;
  const size = 80;

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const newX = position.x + info.offset.x;
    const newY = position.y + info.offset.y;
    setPosition({ x: newX, y: newY });
    onDragEnd?.(newX, newY);
  };

  const isPositiveTrend =
    kpi.trend === "down" && kpi.id === "time_to_hire"
      ? true
      : kpi.trend === "up";

  return (
    <motion.div
      className={cn(
        "absolute flex flex-col items-center justify-center rounded-full",
        "bg-[var(--g0-bg-elevated-1)] border-2",
        isEditMode && "cursor-grab active:cursor-grabbing",
        className
      )}
      style={{
        width: size,
        height: size,
        left: position.x - size / 2,
        top: position.y - size / 2,
        borderColor: color,
        boxShadow: `0 0 20px ${color}40`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay: index * 0.08,
        duration: 0.4,
        type: "spring",
        stiffness: 200,
      }}
      drag={isEditMode}
      dragControls={dragControls}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      whileHover={{
        scale: 1.05,
        boxShadow: `0 0 30px ${color}60`,
      }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Icon */}
      <Icon className="h-3.5 w-3.5 mb-0.5" style={{ color }} />

      {/* Value */}
      <Text
        variant="body"
        className="tabular-nums text-sm"
        style={{ color }}
      >
        {formatRecruitingKPIValue(kpi)}
      </Text>

      {/* Label */}
      <Text variant="small" color="muted" className="text-[8px] text-center px-1 leading-tight">
        {kpi.label}
      </Text>

      {/* Trend indicator */}
      {kpi.trend && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          {kpi.trend === "up" ? (
            <TrendingUp
              className={cn("h-2.5 w-2.5", isPositiveTrend ? "text-[#22c55e]" : "text-[#ef4444]")}
            />
          ) : (
            <TrendingDown
              className={cn("h-2.5 w-2.5", isPositiveTrend ? "text-[#22c55e]" : "text-[#ef4444]")}
            />
          )}
        </div>
      )}

      {/* Edit mode indicator */}
      {isEditMode && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--g0-accent-amber)]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
