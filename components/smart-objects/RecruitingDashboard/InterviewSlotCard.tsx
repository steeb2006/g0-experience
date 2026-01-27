"use client";

import { motion } from "framer-motion";
import { Video, Phone, MapPin, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "../atomics";
import type { InterviewSlot } from "@/lib/mock-data/recruiting-dashboard";

interface InterviewSlotCardProps {
  interview: InterviewSlot;
  index?: number;
  className?: string;
}

const typeIcons: Record<InterviewSlot["type"], React.ElementType> = {
  video: Video,
  phone: Phone,
  onsite: MapPin,
  panel: Users,
};

const typeColors: Record<InterviewSlot["type"], string> = {
  video: "#3b82f6",
  phone: "#22c55e",
  onsite: "#f59e0b",
  panel: "#8b5cf6",
};

export function InterviewSlotCard({
  interview,
  index = 0,
  className,
}: InterviewSlotCardProps) {
  const Icon = typeIcons[interview.type];
  const color = typeColors[interview.type];

  return (
    <motion.div
      className={cn(
        "flex items-center gap-2 py-2 border-b border-[var(--g0-bg-elevated-3)] last:border-0",
        className
      )}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      {/* Type icon */}
      <div
        className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="h-3 w-3" style={{ color }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <User className="h-2.5 w-2.5 text-[var(--g0-text-muted)]" />
          <Text variant="small" className="truncate">
            {interview.candidateName}
          </Text>
        </div>
        <Text variant="small" color="muted" className="text-[10px] truncate">
          {interview.role}
        </Text>
      </div>

      {/* Time */}
      <div className="text-right flex-shrink-0">
        <Text variant="small" className="text-[10px]" style={{ color }}>
          {interview.time.split(",")[0]}
        </Text>
        <Text variant="small" color="muted" className="text-[9px]">
          {interview.time.split(",")[1]?.trim()}
        </Text>
      </div>
    </motion.div>
  );
}
