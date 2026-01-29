"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Circle, LayoutGrid, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/lib/stores";
import { Button } from "@/components/ui";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/Tooltip";

interface SmartObjectContainerProps {
  /**
   * Content for radial view mode. If only radialView is provided without gridView,
   * the view toggle will be hidden.
   */
  radialView?: React.ReactNode;

  /**
   * Content for grid view mode. If only gridView is provided without radialView,
   * the view toggle will be hidden.
   */
  gridView?: React.ReactNode;

  /**
   * Single content to display (no view toggle). Use this when there's only one view.
   */
  children?: React.ReactNode;

  /**
   * Fixed width of the container. Defaults to 960.
   */
  width?: number;

  /**
   * Fixed height of the container. Defaults to 540 (16:9 aspect ratio).
   */
  height?: number;

  /**
   * Additional CSS classes for the outer container.
   */
  className?: string;

  /**
   * Whether to show the view toggle buttons. Defaults to true if both views provided.
   */
  showViewToggle?: boolean;

  /**
   * Whether to show the presentation mode button. Defaults to true.
   */
  showPresentationMode?: boolean;

  /**
   * Scale factor for presentation mode. Defaults to 1.3.
   */
  presentationScale?: number;
}

/**
 * SmartObjectContainer - A reusable container for Smart Objects.
 *
 * Features:
 * - Fixed dimensions (default 960×540 at 16:9 aspect ratio)
 * - View mode toggle (radial/grid) when both views are provided
 * - Presentation mode (fullscreen with Esc to exit)
 * - Consistent outer frame styling (rounded corners, gradient background, border)
 * - Smooth transitions between views (AnimatePresence)
 *
 * Usage:
 *
 * // With both views (shows toggle):
 * <SmartObjectContainer
 *   radialView={<RadialView data={data} />}
 *   gridView={<GridView data={data} />}
 * />
 *
 * // With single view (no toggle):
 * <SmartObjectContainer>
 *   <MySingleViewContent />
 * </SmartObjectContainer>
 */
export function SmartObjectContainer({
  radialView,
  gridView,
  children,
  width = 960,
  height = 540,
  className,
  showViewToggle,
  showPresentationMode = true,
  presentationScale = 1.3,
}: SmartObjectContainerProps) {
  const { viewMode, setViewMode } = useCanvasStore();
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Determine if we have dual views
  const hasDualViews = Boolean(radialView && gridView);
  const shouldShowViewToggle = showViewToggle ?? hasDualViews;

  // Track mount state for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Escape key to exit presentation mode
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPresentationMode) {
        setIsPresentationMode(false);
      }
    },
    [isPresentationMode]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Determine which content to render
  const renderContent = () => {
    // Single view mode (children provided)
    if (children) {
      return children;
    }

    // Dual view mode
    if (hasDualViews) {
      return viewMode === "radial" ? radialView : gridView;
    }

    // Fallback: render whichever view is provided
    return radialView || gridView || null;
  };

  // Outer frame styling (consistent across all Smart Objects)
  const frameStyles = {
    width,
    height,
    background: "linear-gradient(180deg, #0a0a0a 0%, #000000 100%)",
    border: "1px solid #1a1a1a",
  };

  // Presentation mode overlay (rendered via portal to escape stacking context)
  const presentationOverlay =
    isPresentationMode && mounted
      ? createPortal(
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
              Press{" "}
              <kbd className="px-2 py-1 bg-[var(--g0-bg-elevated-2)] rounded border border-[var(--g0-bg-elevated-3)]">
                Esc
              </kbd>{" "}
              to exit
            </div>

            {/* Smart Object - scaled to fit */}
            <div style={{ transform: `scale(${presentationScale})` }}>
              <motion.div
                className={cn("relative rounded-2xl overflow-hidden", className)}
                style={frameStyles}
              >
                {renderContent()}
              </motion.div>
            </div>
          </motion.div>,
          document.body
        )
      : null;

  return (
    <>
      {presentationOverlay}
      <TooltipProvider delayDuration={300}>
        <div className="relative">
          {/* View Toggle & Presentation Mode Controls */}
          <div className="absolute -top-12 right-0 z-50 flex items-center gap-2">
            {/* View toggle */}
            {shouldShowViewToggle && (
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
                    <p>Radial view</p>
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
                    <p>Grid view</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}

            {/* Presentation mode button */}
            {showPresentationMode && (
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
            )}
          </div>

          {/* Content with AnimatePresence for smooth transitions */}
          <AnimatePresence mode="wait">
            {hasDualViews ? (
              viewMode === "radial" ? (
                <motion.div
                  key="radial"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className={cn(
                      "relative rounded-2xl overflow-hidden",
                      className
                    )}
                    style={frameStyles}
                  >
                    {radialView}
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className={cn(
                      "relative rounded-2xl overflow-hidden",
                      className
                    )}
                    style={frameStyles}
                  >
                    {gridView}
                  </motion.div>
                </motion.div>
              )
            ) : (
              <motion.div
                key="single"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className={cn(
                    "relative rounded-2xl overflow-hidden",
                    className
                  )}
                  style={frameStyles}
                >
                  {renderContent()}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </TooltipProvider>
    </>
  );
}
