"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Text } from "../atomics";
import type { CandidateSource } from "@/lib/mock-data/recruiting-dashboard";

interface SourceDonutProps {
  sources: CandidateSource[];
  size?: number;
  className?: string;
}

export function SourceDonut({ sources, size = 100, className }: SourceDonutProps) {
  const total = sources.reduce((sum, s) => sum + s.candidates, 0);
  const strokeWidth = size * 0.15;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Donut Chart */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--g0-bg-elevated-3)"
            strokeWidth={strokeWidth}
          />

          {/* Segments */}
          {sources.map((source, index) => {
            const percent = source.candidates / total;
            const offset = cumulativePercent * circumference;
            const dashLength = percent * circumference;
            cumulativePercent += percent;

            return (
              <motion.circle
                key={source.name}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={source.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={-offset}
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray: `${dashLength} ${circumference - dashLength}` }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
              />
            );
          })}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Text variant="h2" className="tabular-nums text-sm">
            {total}
          </Text>
          <Text variant="small" color="muted" className="text-[9px]">
            Total
          </Text>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center">
        {sources.map((source) => (
          <div key={source.name} className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: source.color }}
            />
            <Text variant="small" color="muted" className="text-[10px]">
              {source.name}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
