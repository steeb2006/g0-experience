"use client";

import { motion } from "framer-motion";
import { Star, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "../atomics";
import type { Candidate } from "@/lib/mock-data/recruiting-dashboard";
import { getScoreColor } from "@/lib/mock-data/recruiting-dashboard";

interface CandidateCardProps {
  candidate: Candidate;
  index?: number;
  compact?: boolean;
  className?: string;
}

export function CandidateCard({
  candidate,
  index = 0,
  compact = false,
  className,
}: CandidateCardProps) {
  const scoreColor = getScoreColor(candidate.score);

  if (compact) {
    return (
      <motion.div
        className={cn(
          "flex items-center gap-2 py-1.5",
          className
        )}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05, duration: 0.2 }}
      >
        {/* Avatar */}
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${scoreColor}20` }}
        >
          <User className="h-3 w-3" style={{ color: scoreColor }} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            {candidate.isStarred && (
              <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
            )}
            <Text variant="small" className="truncate">
              {candidate.name}
            </Text>
          </div>
          <Text variant="small" color="muted" className="truncate text-[10px]">
            {candidate.role} | {candidate.stage}
          </Text>
        </div>

        {/* Score */}
        <div
          className="px-1.5 py-0.5 rounded text-[10px] tabular-nums"
          style={{ backgroundColor: `${scoreColor}20`, color: scoreColor }}
        >
          {candidate.score}%
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl",
        "bg-[var(--g0-bg-elevated-2)] border border-[var(--g0-bg-elevated-3)]",
        "hover:border-[var(--g0-bg-elevated-4)] transition-colors",
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${scoreColor}20` }}
      >
        <User className="h-5 w-5" style={{ color: scoreColor }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {candidate.isStarred && (
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          )}
          <Text variant="body" className="truncate">
            {candidate.name}
          </Text>
        </div>
        <Text variant="small" color="muted" className="truncate">
          {candidate.role}
        </Text>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="text-[10px] px-1.5 py-0.5 rounded"
            style={{ backgroundColor: `${scoreColor}20`, color: scoreColor }}
          >
            {candidate.stage}
          </span>
          <Text variant="small" color="muted" className="text-[10px]">
            {candidate.source}
          </Text>
        </div>
      </div>

      {/* Score Circle */}
      <div className="flex flex-col items-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: `conic-gradient(${scoreColor} ${candidate.score * 3.6}deg, var(--g0-bg-elevated-3) 0deg)`,
          }}
        >
          <div className="w-9 h-9 rounded-full bg-[var(--g0-bg-elevated-2)] flex items-center justify-center">
            <span className="text-sm tabular-nums" style={{ color: scoreColor }}>
              {candidate.score}
            </span>
          </div>
        </div>
        <Text variant="small" color="muted" className="mt-1 text-[10px]">
          Fit Score
        </Text>
      </div>
    </motion.div>
  );
}
