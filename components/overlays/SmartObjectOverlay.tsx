"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOverlayStore } from "@/lib/stores";
import { PersonDetail } from "@/components/smart-objects/PersonDetail";

export function SmartObjectOverlay() {
  const { isOpen, overlayType, data, closeOverlay } = useOverlayStore();

  // Close on Escape key - stop propagation so chat doesn't also close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        e.stopPropagation();
        closeOverlay();
      }
    },
    [isOpen, closeOverlay]
  );

  useEffect(() => {
    if (isOpen) {
      // Use capture phase to intercept before other handlers
      window.addEventListener("keydown", handleKeyDown, true);
      return () => window.removeEventListener("keydown", handleKeyDown, true);
    }
  }, [isOpen, handleKeyDown]);

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        closeOverlay();
      }
    },
    [closeOverlay]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed inset-0 z-[60] flex items-center justify-center",
            "bg-black/70 backdrop-blur-md"
          )}
          onClick={handleBackdropClick}
        >
          {/* Overlay Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative"
          >
            {/* Close button - positioned outside the content */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              onClick={closeOverlay}
              className={cn(
                "absolute -top-4 -right-4 z-20",
                "w-10 h-10 rounded-full flex items-center justify-center",
                "bg-[#1a1a1a] hover:bg-[#2a2a2a]",
                "text-gray-400 hover:text-white",
                "border border-[#2a2a2a] hover:border-[#3a3a3a]",
                "transition-all shadow-lg shadow-black/50"
              )}
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* ESC hint - positioned below the content */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-20"
            >
              <span className="text-[11px] text-gray-500 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a]">
                Press <kbd className="font-mono text-gray-400">ESC</kbd> to close
              </span>
            </motion.div>

            {/* Smart Object Content */}
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
              {overlayType === "person-detail" && data && (
                <PersonDetail person={data} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
