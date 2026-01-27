"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Text, Sparkline } from "../atomics";
import { RecruitingKPIBubble } from "./RecruitingKPIBubble";
import { PipelineFunnel } from "./PipelineFunnel";
import { CandidateCard } from "./CandidateCard";
import { DepartmentHiringBar } from "./DepartmentHiringBar";
import { SourceDonut } from "./SourceDonut";
import type { RecruitingDashboardData } from "@/lib/mock-data/recruiting-dashboard";

interface GridViewProps {
  data: RecruitingDashboardData;
  onSubBoardClick?: (boardId: string) => void;
  className?: string;
}

export function GridView({ data, onSubBoardClick, className }: GridViewProps) {
  const { entity, data: dashboardData } = data;
  const {
    title,
    period,
    kpis,
    pipeline,
    topCandidates,
    departmentHiring,
    sources,
    sparkline,
  } = dashboardData;

  // 16:9 container dimensions
  const containerWidth = 960;
  const containerHeight = 540;

  const maxOpenRoles = Math.max(...departmentHiring.map((d) => d.openRoles));

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
          {/* Entity Badge - Violet themed for recruiting */}
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
                background:
                  "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
              }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              className="absolute inset-0 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #111111 0%, #0a0a0a 100%)",
                border: "2px solid #8b5cf6",
                boxShadow: "0 0 30px rgba(139, 92, 246, 0.2)",
              }}
            >
              <span
                className="text-xs text-center px-2"
                style={{ color: "#a78bfa" }}
              >
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
            <div className="text-[18px] text-[var(--g0-text-primary)]">
              {title}
            </div>
            <div className="text-[11px] text-[var(--g0-text-muted)]">{period}</div>
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
      <div className="absolute top-20 left-6 right-6 bottom-4">
        <div className="grid grid-cols-12 gap-4 h-full">
          {/* Left Column - KPIs + Candidates + Departments */}
          <div className="col-span-9 flex flex-col gap-3">
            {/* KPI Grid - 4x2 */}
            <div className="grid grid-cols-4 grid-rows-2 gap-3">
              {kpis.slice(0, 8).map((kpi, index) => (
                <RecruitingKPIBubble
                  key={kpi.id}
                  kpi={kpi}
                  index={index}
                  className="w-full h-full"
                />
              ))}
            </div>

            {/* Bottom row - Candidates + Departments */}
            <div className="flex-1 grid grid-cols-2 gap-3">
              {/* Top Candidates */}
              <motion.div
                className="rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-2)] p-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Text variant="small" color="muted" className="mb-2">
                  Top Candidates
                </Text>
                <div className="flex flex-col">
                  {topCandidates.slice(0, 3).map((candidate, index) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      index={index}
                      compact
                    />
                  ))}
                </div>
              </motion.div>

              {/* Department Breakdown */}
              <motion.div
                className="rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-2)] p-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <Text variant="small" color="muted" className="mb-2">
                  Open Roles by Dept
                </Text>
                <div className="flex flex-col gap-1.5">
                  {departmentHiring.map((dept, index) => (
                    <DepartmentHiringBar
                      key={dept.name}
                      department={dept}
                      index={index}
                      maxRoles={maxOpenRoles}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column - Pipeline + Sparkline + Sources */}
          <div className="col-span-3 flex flex-col gap-3">
            {/* Pipeline Funnel */}
            <motion.div
              className="rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-2)] p-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Text variant="small" color="muted" className="mb-2">
                Hiring Pipeline
              </Text>
              <PipelineFunnel stages={pipeline} />
            </motion.div>

            {/* Applications Trend */}
            <motion.div
              className="rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-2)] p-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <Text variant="small" color="muted" className="mb-1">
                {sparkline.label}
              </Text>
              <div className="relative">
                <Sparkline
                  data={sparkline.data.map((d) => d.value)}
                  width={170}
                  height={50}
                  color="#8b5cf6"
                />
              </div>
              <div className="flex justify-between mt-1 text-[8px] text-[var(--g0-text-muted)]">
                {sparkline.data.slice(0, 6).map((d, i) => (
                  <span key={i}>{d.week}</span>
                ))}
              </div>
            </motion.div>

            {/* Source Breakdown */}
            <motion.div
              className="flex-1 rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-2)] p-3 flex flex-col"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Text variant="small" color="muted" className="mb-2">
                Candidate Sources
              </Text>
              <div className="flex-1 flex items-center justify-center">
                <SourceDonut sources={sources} size={90} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
