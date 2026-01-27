"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EntityBadge } from "./EntityBadge";
import { KPIBubble } from "./KPIBubble";
import { SubBoardCard } from "./SubBoardCard";
import { Text, Sparkline } from "../atomics";
import type { FinanceDashboardData } from "@/lib/mock-data/finance-dashboard";

interface GridViewProps {
  data: FinanceDashboardData;
  onSubBoardClick?: (boardId: string) => void;
  className?: string;
}

export function GridView({
  data,
  onSubBoardClick,
  className,
}: GridViewProps) {
  const { entity, data: dashboardData } = data;
  const { title, period, kpis, sparkline, subBoards } = dashboardData;

  // 16:9 container dimensions (same as RadialView)
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
          <EntityBadge
            name={entity.name}
            avatar={entity.avatar}
            isActive={true}
            size="sm"
          />
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
          <div className="col-span-3 grid grid-cols-3 grid-rows-2 gap-3">
            {kpis.slice(0, 6).map((kpi, index) => (
              <motion.div
                key={kpi.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
              >
                <KPIBubble kpi={kpi} index={index} size="md" className="w-full h-full" />
              </motion.div>
            ))}
          </div>

          {/* Charts Section - 1 column with 2 charts stacked */}
          <div className="flex flex-col gap-3">
            {/* Revenue Trend Sparkline */}
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
                  height={80}
                  color="var(--g0-data-6)"
                />
              </div>
              {/* X-axis labels */}
              <div className="flex justify-between mt-1 text-[8px] text-[var(--g0-text-muted)]">
                {sparkline.data.filter((_, i) => i % 3 === 0).map((d, i) => (
                  <span key={i}>{d.month}</span>
                ))}
              </div>
            </motion.div>

            {/* Cash Flow Trend */}
            <motion.div
              className="flex flex-col rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-2)] p-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <Text variant="small" color="muted" className="mb-1">
                Cash Flow
              </Text>
              <div className="flex-1 relative">
                <Sparkline
                  data={[3800, 3900, 4000, 4100, 4150, 4200]}
                  width={170}
                  height={80}
                  color="var(--g0-data-3)"
                />
              </div>
              {/* X-axis labels */}
              <div className="flex justify-between mt-1 text-[8px] text-[var(--g0-text-muted)]">
                <span>Jul</span>
                <span>Oct</span>
                <span>Dec</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom - Sub-boards */}
      <div className="absolute bottom-4 left-6 right-6 flex justify-center gap-3">
        {subBoards.map((subBoard, index) => (
          <SubBoardCard
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
