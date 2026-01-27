"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/smart-objects/atomics";
import { ArtifactCard } from "./ArtifactCard";
import { useChatStore } from "@/lib/stores";

interface ArtifactsPanelProps {
  className?: string;
}

export function ArtifactsPanel({ className }: ArtifactsPanelProps) {
  const { artifacts, isArtifactsPanelExpanded, toggleArtifactsPanel } =
    useChatStore();

  if (artifacts.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "border-b border-[var(--g0-bg-elevated-3)]",
        className
      )}
    >
      {/* Header */}
      <button
        onClick={toggleArtifactsPanel}
        className={cn(
          "flex w-full items-center justify-between px-4",
          isArtifactsPanelExpanded ? "py-2.5" : "py-1.5",
          "transition-all hover:bg-[var(--g0-bg-elevated-2)]"
        )}
      >
        <div className="flex items-center gap-2">
          <Text variant="small" className="font-medium">
            ARTIFACTS
          </Text>
          <span className="rounded-full bg-[var(--g0-accent-violet)]/20 px-2 py-0.5 text-[10px] font-medium text-[var(--g0-accent-violet)]">
            {artifacts.length}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-[var(--g0-text-muted)] transition-transform",
            isArtifactsPanelExpanded && "rotate-180"
          )}
        />
      </button>

      {/* Artifacts Row */}
      <AnimatePresence>
        {isArtifactsPanelExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div data-scrollable="true" className="flex gap-3 overflow-x-auto px-4 pb-4">
              {artifacts.map((artifact) => (
                <ArtifactCard
                  key={artifact.id}
                  artifact={artifact}
                  size="md"
                  onDragStart={(e) => {
                    e.dataTransfer.setData("artifact", JSON.stringify(artifact));
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
