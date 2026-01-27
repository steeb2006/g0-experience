"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Text } from "../atomics";
import { FunnelCenter } from "./FunnelCenter";
import { RecruitingKPIOrb } from "./RecruitingKPIOrb";
import { CandidateCard } from "./CandidateCard";
import { InterviewSlotCard } from "./InterviewSlotCard";
import { PipelineFunnel } from "./PipelineFunnel";
import { SourceDonut } from "./SourceDonut";
import type { RecruitingDashboardData, RecruitingKPI } from "@/lib/mock-data/recruiting-dashboard";

interface RadialViewProps {
  data: RecruitingDashboardData;
  isEditMode?: boolean;
  onSubBoardClick?: (boardId: string) => void;
  className?: string;
}

// Orbital positions for KPIs around the funnel
const getOrbitalPositions = (centerX: number, centerY: number, radius: number, count: number) => {
  const positions: Array<{ x: number; y: number }> = [];
  const startAngle = -Math.PI / 2; // Start from top

  for (let i = 0; i < count; i++) {
    const angle = startAngle + (2 * Math.PI * i) / count;
    positions.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }

  return positions;
};

export function RadialView({
  data,
  isEditMode = false,
  onSubBoardClick,
  className,
}: RadialViewProps) {
  const { entity, data: dashboardData } = data;
  const {
    title,
    period,
    kpis,
    pipeline,
    topCandidates,
    upcomingInterviews,
    sources,
  } = dashboardData;

  // 16:9 container dimensions
  const containerWidth = 960;
  const containerHeight = 540;

  // Center zone dimensions
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2 + 20; // Slightly lower to account for header
  const funnelSize = 180;
  const orbitalRadius = 180;

  // Select 6 KPIs for the orbital display
  const orbitalKPIs = kpis.filter((k) =>
    ["time_to_hire", "interviews_week", "quality_score", "offers_pending", "offer_acceptance", "budget_util"].includes(
      k.id
    )
  );

  const orbPositions = getOrbitalPositions(centerX, centerY, orbitalRadius, orbitalKPIs.length);

  // State for draggable orb positions
  const [orbPositionsState, setOrbPositionsState] = useState(
    orbPositions.map((pos, i) => ({ ...pos, kpi: orbitalKPIs[i] }))
  );

  const handleOrbDragEnd = (index: number, x: number, y: number) => {
    setOrbPositionsState((prev) =>
      prev.map((pos, i) => (i === index ? { ...pos, x, y } : pos))
    );
  };

  return (
    <motion.div
      className={cn(
        "relative bg-[var(--g0-bg-elevated-1)] rounded-2xl border border-[var(--g0-bg-elevated-3)]",
        "shadow-2xl shadow-black/30 overflow-hidden",
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
          {/* Entity Badge - Violet themed */}
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
              <span className="text-xs text-center px-2" style={{ color: "#a78bfa" }}>
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
            <div className="text-[18px] text-[var(--g0-text-primary)]">{title}</div>
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

      {/* Left Panel */}
      <div className="absolute left-6 top-20 bottom-4 w-52 flex flex-col gap-3">
        {/* Open Positions & Pipeline Summary */}
        <motion.div
          className="rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-2)] p-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Text variant="small" color="muted">
              Open Positions
            </Text>
            <Text variant="h2" className="text-2xl" style={{ color: "#3b82f6" }}>
              {kpis.find((k) => k.id === "open_positions")?.value || 23}
            </Text>
          </div>
          <Text variant="small" color="muted" className="text-[10px]">
            +{kpis.find((k) => k.id === "open_positions")?.change || 5} this month
          </Text>
        </motion.div>

        {/* Pipeline Breakdown */}
        <motion.div
          className="flex-1 rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-2)] p-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Text variant="small" color="muted" className="mb-2">
            Pipeline Breakdown
          </Text>
          <PipelineFunnel stages={pipeline} />
        </motion.div>

        {/* Sources */}
        <motion.div
          className="rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-2)] p-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Text variant="small" color="muted" className="mb-2">
            Sources
          </Text>
          <SourceDonut sources={sources} size={80} />
        </motion.div>
      </div>

      {/* Center Zone - Funnel + Orbitals */}
      <div
        className="absolute"
        style={{
          left: centerX - funnelSize / 2,
          top: centerY - funnelSize / 2,
        }}
      >
        {/* Orbital rings (decorative) */}
        <motion.div
          className="absolute rounded-full border border-dashed border-[var(--g0-bg-elevated-3)]"
          style={{
            left: funnelSize / 2 - orbitalRadius,
            top: funnelSize / 2 - orbitalRadius,
            width: orbitalRadius * 2,
            height: orbitalRadius * 2,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />

        {/* Funnel */}
        <FunnelCenter stages={pipeline} size={funnelSize} />
      </div>

      {/* Orbital KPIs */}
      {orbPositionsState.map((pos, index) => (
        <RecruitingKPIOrb
          key={pos.kpi.id}
          kpi={pos.kpi}
          x={pos.x}
          y={pos.y}
          index={index}
          isEditMode={isEditMode}
          onDragEnd={(x, y) => handleOrbDragEnd(index, x, y)}
        />
      ))}

      {/* Right Panel */}
      <div className="absolute right-6 top-20 bottom-4 w-52 flex flex-col gap-3">
        {/* Top Candidates */}
        <motion.div
          className="rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-2)] p-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
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

        {/* Upcoming Interviews */}
        <motion.div
          className="flex-1 rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-2)] p-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Text variant="small" color="muted" className="mb-2">
            Upcoming Interviews
          </Text>
          <div className="flex flex-col">
            {upcomingInterviews.map((interview, index) => (
              <InterviewSlotCard
                key={interview.id}
                interview={interview}
                index={index}
              />
            ))}
          </div>
        </motion.div>

        {/* Active Candidates Badge */}
        <motion.div
          className="rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-2)] p-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <Text variant="small" color="muted">
              Active Candidates
            </Text>
            <Text variant="h2" className="text-2xl" style={{ color: "#06b6d4" }}>
              {kpis.find((k) => k.id === "active_candidates")?.value || 156}
            </Text>
          </div>
          <Text variant="small" color="muted" className="text-[10px]">
            +{kpis.find((k) => k.id === "active_candidates")?.change || 32} this week
          </Text>
        </motion.div>
      </div>
    </motion.div>
  );
}
