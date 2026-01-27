"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Grid3X3, Circle, Edit3, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadialView } from "./RadialView";
import { GridView } from "./GridView";
import { recruitingFullDashboardData } from "@/lib/mock-data/recruiting-dashboard";
import type { RecruitingDashboardData } from "@/lib/mock-data/recruiting-dashboard";

type ViewMode = "radial" | "grid";

interface RecruitingDashboardProps {
  data?: RecruitingDashboardData;
  initialView?: ViewMode;
  onSubBoardClick?: (boardId: string) => void;
  className?: string;
}

export function RecruitingDashboard({
  data = recruitingFullDashboardData,
  initialView = "radial",
  onSubBoardClick,
  className,
}: RecruitingDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(initialView);
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className={cn("relative", className)}>
      {/* View Toggle */}
      <motion.div
        className="absolute -top-12 right-0 flex items-center gap-2 z-20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        {/* Edit Mode Toggle (only in radial view) */}
        {viewMode === "radial" && (
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs",
              "transition-colors duration-200",
              isEditMode
                ? "bg-[var(--g0-accent-amber)] text-black"
                : "bg-[var(--g0-bg-elevated-2)] text-[var(--g0-text-secondary)] hover:bg-[var(--g0-bg-elevated-3)]"
            )}
          >
            {isEditMode ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Done
              </>
            ) : (
              <>
                <Edit3 className="h-3.5 w-3.5" />
                Edit
              </>
            )}
          </button>
        )}

        {/* View Mode Toggle */}
        <div className="flex items-center rounded-lg bg-[var(--g0-bg-elevated-2)] p-1">
          <button
            onClick={() => setViewMode("radial")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors duration-200",
              viewMode === "radial"
                ? "bg-[var(--g0-bg-elevated-3)] text-[var(--g0-text-primary)]"
                : "text-[var(--g0-text-secondary)] hover:text-[var(--g0-text-primary)]"
            )}
          >
            <Circle className="h-3.5 w-3.5" />
            Radial
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors duration-200",
              viewMode === "grid"
                ? "bg-[var(--g0-bg-elevated-3)] text-[var(--g0-text-primary)]"
                : "text-[var(--g0-text-secondary)] hover:text-[var(--g0-text-primary)]"
            )}
          >
            <Grid3X3 className="h-3.5 w-3.5" />
            Grid
          </button>
        </div>
      </motion.div>

      {/* Views */}
      <AnimatePresence mode="wait">
        {viewMode === "radial" ? (
          <motion.div
            key="radial"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <RadialView
              data={data}
              isEditMode={isEditMode}
              onSubBoardClick={onSubBoardClick}
            />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <GridView
              data={data}
              onSubBoardClick={onSubBoardClick}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Re-export components for individual use
export { RadialView } from "./RadialView";
export { GridView } from "./GridView";
export { FunnelCenter } from "./FunnelCenter";
export { RecruitingKPIOrb } from "./RecruitingKPIOrb";
export { RecruitingKPIBubble } from "./RecruitingKPIBubble";
export { CandidateCard } from "./CandidateCard";
export { PipelineFunnel } from "./PipelineFunnel";
export { DepartmentHiringBar } from "./DepartmentHiringBar";
export { SourceDonut } from "./SourceDonut";
export { InterviewSlotCard } from "./InterviewSlotCard";
