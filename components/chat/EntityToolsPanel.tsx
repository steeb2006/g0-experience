"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/smart-objects/atomics";
import { ToolCard } from "./ToolCard";
import { getToolsForEntity, type EntityTool } from "@/lib/mock-data/entity-tools";

interface EntityToolsPanelProps {
  entityName: string;
  onToolSelect: (tool: EntityTool) => void;
  className?: string;
}

export function EntityToolsPanel({
  entityName,
  onToolSelect,
  className,
}: EntityToolsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const tools = getToolsForEntity(entityName);

  // Don't render if no tools available
  if (tools.length === 0) {
    return null;
  }

  return (
    <div className={cn("border-b border-[var(--g0-bg-elevated-3)]", className)}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex w-full items-center justify-between px-4",
          isExpanded ? "py-2.5" : "py-1.5",
          "transition-all hover:bg-[var(--g0-bg-elevated-2)]"
        )}
      >
        <div className="flex items-center gap-2">
          <Text variant="small" className="font-medium">
            TOOLS
          </Text>
          <span className="rounded-full bg-[var(--g0-accent-primary)]/20 px-1.5 py-0.5 text-[10px] font-medium text-[var(--g0-accent-primary)]">
            {tools.length}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-[var(--g0-text-muted)] transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {/* Tool List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-3 space-y-0.5">
              {tools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onClick={() => onToolSelect(tool)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
