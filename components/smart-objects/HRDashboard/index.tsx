"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Circle, LayoutGrid, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCanvasStore, useNavigationStore } from "@/lib/stores";
import { Button } from "@/components/ui";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/Tooltip";
import { RadialView } from "./RadialView";
import { GridView } from "./GridView";
import { hrDashboardData } from "@/lib/mock-data/hr-dashboard";
import { findBoardById } from "@/lib/mock-data/organization";

interface HRDashboardProps {
  className?: string;
}

export function HRDashboard({ className }: HRDashboardProps) {
  const router = useRouter();
  const { viewMode, setViewMode } = useCanvasStore();
  const { setCurrentBoard, addToBreadcrumb, currentBoardId, currentOrgId } = useNavigationStore();
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Track mount state for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubBoardClick = (boardId: string) => {
    const currentBoard = findBoardById(currentBoardId);
    if (currentBoard) {
      addToBreadcrumb({ id: currentBoardId, name: currentBoard.name });
    }
    setCurrentBoard(boardId);
    // Navigate to the sub-board URL
    router.push(`/${currentOrgId}/ws_hr/${boardId}`);
  };

  // Handle Escape key to exit presentation mode
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && isPresentationMode) {
      setIsPresentationMode(false);
    }
  }, [isPresentationMode]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Presentation mode overlay (rendered via portal to escape stacking context)
  const presentationOverlay = isPresentationMode && mounted ? createPortal(
    <motion.div
      className="fixed inset-0 z-[9999] bg-[var(--g0-bg-base)] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Close button */}
      <button
        onClick={() => setIsPresentationMode(false)}
        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-[var(--g0-bg-elevated-2)] border border-[var(--g0-bg-elevated-3)] hover:bg-[var(--g0-bg-elevated-3)] transition-colors"
      >
        <X className="h-5 w-5 text-[var(--g0-text-secondary)]" />
      </button>

      {/* Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[12px] text-[var(--g0-text-muted)]">
        Press <kbd className="px-2 py-1 bg-[var(--g0-bg-elevated-2)] rounded border border-[var(--g0-bg-elevated-3)]">Esc</kbd> to exit
      </div>

      {/* Smart Object - scaled to fit */}
      <div className="transform scale-[1.3]">
        {viewMode === "radial" ? (
          <RadialView
            data={hrDashboardData}
            onSubBoardClick={handleSubBoardClick}
          />
        ) : (
          <GridView
            data={hrDashboardData}
            onSubBoardClick={handleSubBoardClick}
          />
        )}
      </div>
    </motion.div>,
    document.body
  ) : null;

  return (
    <>
      {presentationOverlay}
    <TooltipProvider delayDuration={300}>
      <div className="relative">
        {/* View Toggle & Presentation Mode */}
        <div className="absolute -top-12 right-0 z-50 flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-2)] p-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === "radial" ? "amber" : "ghost"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewMode("radial")}
                >
                  <Circle className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Org chart view</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === "grid" ? "amber" : "ghost"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Metrics grid</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Presentation mode button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-2)]"
                onClick={() => setIsPresentationMode(true)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Presentation mode</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Content */}
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
                data={hrDashboardData}
                onSubBoardClick={handleSubBoardClick}
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
                data={hrDashboardData}
                onSubBoardClick={handleSubBoardClick}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
    </>
  );
}

export { PersonCard } from "./PersonCard";
export { EngagementBar } from "./EngagementBar";
export { HRSubBoardCard } from "./HRSubBoardCard";
export { RadialView } from "./RadialView";
export { GridView } from "./GridView";
