"use client";

import { Monitor, Link2, ArrowRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/Tooltip";
import { G0Logo } from "./G0Logo";
import { useCanvasStore, useNavigationStore } from "@/lib/stores";
import { cn } from "@/lib/utils";

interface CanvasChromeProps {
  className?: string;
}

export function CanvasChrome({ className }: CanvasChromeProps) {
  const { zoom, zoomIn, zoomOut, resetZoom } = useCanvasStore();
  const { toggleDrawer } = useNavigationStore();

  const zoomPercentage = Math.round(zoom * 100);

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn("pointer-events-none absolute inset-0 z-10", className)}>
        {/* Top Bar */}
        <div className="pointer-events-auto absolute left-4 right-4 top-4 flex items-center justify-between">
          {/* Left: Logo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <G0Logo onClick={toggleDrawer} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Open navigation</p>
              <kbd className="ml-2 rounded bg-[var(--g0-bg-elevated-3)] px-1.5 py-0.5 text-[10px]">
                B
              </kbd>
            </TooltipContent>
          </Tooltip>

          {/* Right: Action Icons */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Monitor className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Presentation mode</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Link2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Bottom Left: Zoom Controls */}
        <div className="pointer-events-auto absolute bottom-4 left-4">
          <div className="flex items-center gap-1 rounded-lg border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)] p-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={zoomOut}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Zoom out</p>
                <kbd className="ml-2 rounded bg-[var(--g0-bg-elevated-3)] px-1.5 py-0.5 text-[10px]">
                  -
                </kbd>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={resetZoom}
                  className="min-w-[48px] rounded px-2 py-1 text-xs font-medium text-[var(--g0-text-secondary)] transition-colors hover:bg-[var(--g0-bg-elevated-2)] hover:text-[var(--g0-text-primary)]"
                >
                  {zoomPercentage}%
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Reset zoom</p>
                <kbd className="ml-2 rounded bg-[var(--g0-bg-elevated-3)] px-1.5 py-0.5 text-[10px]">
                  0
                </kbd>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={zoomIn}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Zoom in</p>
                <kbd className="ml-2 rounded bg-[var(--g0-bg-elevated-3)] px-1.5 py-0.5 text-[10px]">
                  +
                </kbd>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
