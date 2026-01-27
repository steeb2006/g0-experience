"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCanvasStore, useNavigationStore, useChatStore, useCommandPaletteStore } from "@/lib/stores";
import { CanvasChrome } from "./CanvasChrome";
import { Breadcrumb } from "./Breadcrumb";

interface G0CanvasProps {
  className?: string;
  children?: React.ReactNode;
}

export function G0Canvas({ className, children }: G0CanvasProps) {
  const { zoom, setZoom, zoomIn, zoomOut, resetZoom, viewportX, viewportY, pan, resetViewport, activeZone, setActiveZone } = useCanvasStore();
  const { toggleDrawer } = useNavigationStore();
  const { togglePanel: toggleChat } = useChatStore();
  const { toggle: toggleCommandPalette } = useCommandPaletteStore();

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const isMeta = e.metaKey || e.ctrlKey;

      // Command palette: Cmd+K
      if (isMeta && e.key === "k") {
        e.preventDefault();
        toggleCommandPalette();
        return;
      }

      // Navigation drawer: Cmd+B or just B
      if ((isMeta && e.key === "b") || (!isMeta && e.key === "b")) {
        e.preventDefault();
        toggleDrawer();
        return;
      }

      // Chat panel: Cmd+J or just J
      if ((isMeta && e.key === "j") || (!isMeta && e.key === "j")) {
        e.preventDefault();
        toggleChat();
        return;
      }

      // Zoom controls
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        zoomIn();
        return;
      }

      if (e.key === "-") {
        e.preventDefault();
        zoomOut();
        return;
      }

      if (e.key === "0") {
        e.preventDefault();
        resetZoom();
        resetViewport();
        return;
      }
    },
    [toggleCommandPalette, toggleDrawer, toggleChat, zoomIn, zoomOut, resetZoom, resetViewport]
  );

  // Wheel/trackpad handling for zoom and pan
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      // Check if the event target is inside a scrollable container (chat panel, navigation drawer, etc.)
      const target = e.target as HTMLElement;
      const scrollableParent = target.closest('[data-scrollable="true"], .chat-messages, .overflow-y-auto, .overflow-auto');
      if (scrollableParent) {
        // Let the scrollable container handle the scroll
        return;
      }

      // Pinch-to-zoom on trackpad (ctrlKey is set for pinch gestures)
      if (e.ctrlKey) {
        e.preventDefault();
        // Much slower zoom for smoother trackpad experience
        const zoomSensitivity = 0.01;
        const delta = -e.deltaY * zoomSensitivity;
        setZoom(zoom + delta);
      } else {
        // 2-finger pan on trackpad (no modifier key)
        e.preventDefault();
        pan(-e.deltaX, -e.deltaY);
      }
    },
    [zoom, setZoom, pan]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [handleKeyDown, handleWheel]);

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-[var(--g0-bg-base)]",
        className
      )}
    >
      {/* Canvas Background */}
      <div className="absolute inset-0">
        {/* Subtle radial gradient for depth */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 50% 50%,
                rgba(139, 92, 246, 0.03) 0%,
                transparent 50%
              )
            `,
          }}
        />
      </div>

      {/* Zone indicators */}
      <div className="pointer-events-none absolute inset-0 flex flex-col">
        {/* Shared Zone Indicator */}
        <AnimatePresence>
          {activeZone === "shared" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-4 top-16"
            >
              <span className="rounded-full bg-[var(--g0-zone-shared)] px-3 py-1 text-xs font-medium text-[var(--g0-text-inverse)]">
                Shared Zone
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Private Zone Indicator */}
        <AnimatePresence>
          {activeZone === "private" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-16 left-4"
            >
              <span className="rounded-full bg-[var(--g0-zone-private)] px-3 py-1 text-xs font-medium text-white">
                Private Zone
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Canvas Content with zoom and pan */}
      <div
        className="relative h-full w-full overflow-hidden flex items-center justify-center"
      >
        <div
          className="relative"
          style={{
            transform: `translate(${viewportX}px, ${viewportY}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: "transform 50ms ease-out",
          }}
        >
          {children}
        </div>
      </div>

      {/* Chrome UI (always on top) */}
      <CanvasChrome />

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Zone hover areas - removed pointer-events to not block UI interactions */}
    </div>
  );
}
