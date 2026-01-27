"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Text } from "../atomics";
import type { RecruitingPipelineStage } from "@/lib/mock-data/recruiting-dashboard";

interface PipelineFunnelProps {
  stages: RecruitingPipelineStage[];
  className?: string;
}

export function PipelineFunnel({ stages, className }: PipelineFunnelProps) {
  const maxCount = Math.max(...stages.map((s) => s.count));

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {stages.map((stage, index) => {
        const widthPercent = (stage.count / maxCount) * 100;

        return (
          <motion.div
            key={stage.id}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            {/* Stage name */}
            <div className="w-16 flex-shrink-0">
              <Text variant="small" color="secondary" className="truncate">
                {stage.name}
              </Text>
            </div>

            {/* Bar */}
            <div className="flex-1 h-5 bg-[var(--g0-bg-elevated-3)] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full flex items-center justify-end pr-2"
                style={{ backgroundColor: stage.color }}
                initial={{ width: 0 }}
                animate={{ width: `${widthPercent}%` }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.5, ease: "easeOut" }}
              >
                <span className="text-[10px] text-white tabular-nums">
                  {stage.count}
                </span>
              </motion.div>
            </div>

            {/* Conversion rate */}
            {stage.conversionRate !== undefined && (
              <div className="w-10 flex-shrink-0 text-right">
                <Text variant="small" color="muted" className="tabular-nums">
                  {(stage.conversionRate * 100).toFixed(0)}%
                </Text>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
