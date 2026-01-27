"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Users, AlertTriangle, Heart, Award, BookOpen, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Text, Sparkline } from "../atomics";
import { HRSubBoardCard } from "./HRSubBoardCard";
import { EngagementBar } from "./EngagementBar";
import type { HRDashboardData, HRKPI } from "@/lib/mock-data/hr-dashboard";
import { formatHRKPIValue, formatHRChange } from "@/lib/mock-data/hr-dashboard";

interface GridViewProps {
  data: HRDashboardData;
  onSubBoardClick?: (boardId: string) => void;
  className?: string;
}

const colorMap: Record<string, string> = {
  blue: "var(--g0-data-5)",
  green: "var(--g0-data-6)",
  lime: "#84cc16",
  amber: "var(--g0-data-1)",
  cyan: "var(--g0-data-3)",
  rose: "var(--g0-data-4)",
  violet: "var(--g0-data-2)",
};

const iconMap: Record<string, React.ElementType> = {
  headcount: Users,
  turnover: AlertTriangle,
  engagement: Heart,
  open_roles: UserCheck,
  tenure: Award,
  flight_risk: AlertTriangle,
  enps: Heart,
  training: BookOpen,
};

interface HRKPIBubbleProps {
  kpi: HRKPI;
  index?: number;
  className?: string;
}

function HRKPIBubble({ kpi, index = 0, className }: HRKPIBubbleProps) {
  const color = colorMap[kpi.color || "blue"] || colorMap.blue;
  const Icon = iconMap[kpi.id] || Users;

  const TrendIcon = kpi.trend === "up"
    ? TrendingUp
    : kpi.trend === "down"
    ? TrendingDown
    : Minus;

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
        className="font-bold tabular-nums text-xl"
        style={{ color }}
      >
        {formatHRKPIValue(kpi)}
      </Text>

      {/* Change indicator */}
      {kpi.change !== undefined && (
        <div className="mt-1 flex items-center gap-1">
          <TrendIcon
            className={cn(
              "h-3 w-3",
              kpi.trend === "up" && kpi.id !== "turnover" && "text-[var(--g0-data-6)]",
              kpi.trend === "down" && kpi.id !== "turnover" && "text-[var(--g0-data-4)]",
              kpi.trend === "up" && kpi.id === "turnover" && "text-[var(--g0-data-4)]",
              kpi.trend === "down" && kpi.id === "turnover" && "text-[var(--g0-data-6)]",
              kpi.trend === "flat" && "text-[var(--g0-text-muted)]"
            )}
          />
          <Text
            variant="small"
            className={cn(
              "tabular-nums",
              kpi.trend === "up" && kpi.id !== "turnover" && "text-[var(--g0-data-6)]",
              kpi.trend === "down" && kpi.id !== "turnover" && "text-[var(--g0-data-4)]",
              kpi.trend === "up" && kpi.id === "turnover" && "text-[var(--g0-data-4)]",
              kpi.trend === "down" && kpi.id === "turnover" && "text-[var(--g0-data-6)]",
              kpi.trend === "flat" && "text-[var(--g0-text-muted)]"
            )}
          >
            {formatHRChange(kpi.change, kpi.format === "number")}
            {kpi.changeLabel && ` ${kpi.changeLabel}`}
          </Text>
        </div>
      )}

      {/* For tenure, show years label */}
      {kpi.id === "tenure" && kpi.changeLabel && !kpi.change && (
        <Text variant="small" color="secondary" className="mt-1">
          {kpi.changeLabel}
        </Text>
      )}
    </motion.div>
  );
}

export function GridView({
  data,
  onSubBoardClick,
  className,
}: GridViewProps) {
  const { entity, data: dashboardData } = data;
  const { title, period, kpis, sparkline, subBoards, departmentStats } = dashboardData;

  // 16:9 container dimensions
  const containerWidth = 960;
  const containerHeight = 540;

  return (
    <motion.div
      className={cn(
        "relative bg-[var(--g0-bg-elevated-1)] rounded-2xl border border-[var(--g0-bg-elevated-3)]",
        "shadow-2xl shadow-black/30",
        className
      )}
      style={{ width: containerWidth, height: containerHeight }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="absolute top-4 left-6 right-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          {/* Entity Badge - HR themed (emerald) */}
          <motion.div
            className="relative"
            style={{ width: 72, height: 72 }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
              }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              className="absolute inset-0 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #111111 0%, #0a0a0a 100%)",
                border: "2px solid #10b981",
                boxShadow: "0 0 30px rgba(16, 185, 129, 0.2)",
              }}
            >
              <span className="font-semibold text-xs text-center px-2" style={{ color: "#34d399" }}>
                {entity.name}
              </span>
            </div>
            <motion.div
              className="absolute z-10"
              style={{
                bottom: 2,
                right: 2,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#22c55e",
                border: "2px solid #000000",
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <div>
            <div className="text-[18px] font-semibold text-[var(--g0-text-primary)]">
              {title}
            </div>
            <div className="text-[11px] text-[var(--g0-text-muted)]">
              {period}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[var(--g0-status-live)] animate-pulse" />
          <Text variant="small" color="muted">
            Live
          </Text>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="absolute top-20 left-6 right-6 bottom-16">
        <div className="grid grid-cols-4 gap-4 h-full">
          {/* KPI Grid - 3 columns */}
          <div className="col-span-3 grid grid-cols-4 grid-rows-2 gap-3">
            {kpis.slice(0, 8).map((kpi, index) => (
              <HRKPIBubble key={kpi.id} kpi={kpi} index={index} className="w-full h-full" />
            ))}
          </div>

          {/* Right Column - Charts & Department Stats */}
          <div className="flex flex-col gap-3">
            {/* Headcount Trend Sparkline */}
            <motion.div
              className="flex flex-col rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-2)] p-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Text variant="small" color="muted" className="mb-1">
                {sparkline.label}
              </Text>
              <div className="flex-1 relative">
                <Sparkline
                  data={sparkline.data.map((d) => d.value)}
                  width={170}
                  height={60}
                  color="#10b981"
                />
              </div>
              <div className="flex justify-between mt-1 text-[8px] text-[var(--g0-text-muted)]">
                {sparkline.data.map((d, i) => (
                  <span key={i}>{d.month}</span>
                ))}
              </div>
            </motion.div>

            {/* Department Engagement */}
            <motion.div
              className="flex-1 flex flex-col rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-2)] p-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <Text variant="small" color="muted" className="mb-2">
                Engagement by Dept
              </Text>
              <div className="flex flex-col gap-1.5 flex-1 justify-center">
                {departmentStats.slice(0, 4).map((dept, index) => (
                  <EngagementBar key={dept.name} department={dept} index={index} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom - Sub-boards */}
      <div className="absolute bottom-4 left-6 right-6 flex justify-center gap-3">
        {subBoards.map((subBoard, index) => (
          <HRSubBoardCard
            key={subBoard.id}
            subBoard={subBoard}
            index={index}
            onClick={() => onSubBoardClick?.(subBoard.id)}
            compact
          />
        ))}
      </div>
    </motion.div>
  );
}
