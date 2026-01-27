"use client";

import { motion } from "framer-motion";
import { Heart, Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PersonDetailData } from "@/lib/mock-data/person-detail";

interface PersonMetricsProps {
  person: PersonDetailData;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  subValue,
  color,
  index,
  showProgress,
  progressValue,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
  index: number;
  showProgress?: boolean;
  progressValue?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
      className={cn(
        "flex-1 rounded-xl p-3",
        "bg-[var(--g0-bg-elevated-2)] border border-[var(--g0-bg-elevated-3)]"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn("h-4 w-4", color)} />
        <span className="text-[10px] font-medium text-[var(--g0-text-muted)] uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="text-xl font-bold text-[var(--g0-text-primary)]">
        {value}
      </div>
      {subValue && (
        <div className="text-[10px] text-[var(--g0-text-muted)] mt-0.5">
          {subValue}
        </div>
      )}
      {showProgress && progressValue !== undefined && (
        <div className="mt-2 h-1.5 rounded-full overflow-hidden bg-[var(--g0-bg-elevated-3)]">
          <motion.div
            className={cn("h-full rounded-full", color.replace("text-", "bg-"))}
            initial={{ width: 0 }}
            animate={{ width: `${progressValue}%` }}
            transition={{ delay: 0.4, duration: 0.5 }}
          />
        </div>
      )}
    </motion.div>
  );
}

export function PersonMetrics({ person }: PersonMetricsProps) {
  const getEngagementColor = (engagement: number) => {
    if (engagement >= 90) return "text-green-500";
    if (engagement >= 80) return "text-lime-500";
    if (engagement >= 70) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="flex gap-3 p-4">
      <MetricCard
        icon={Heart}
        label="Engagement"
        value={`${person.engagement}%`}
        color={getEngagementColor(person.engagement)}
        index={0}
        showProgress
        progressValue={person.engagement}
      />
      <MetricCard
        icon={Users}
        label="Team Size"
        value={person.teamSize}
        subValue="people"
        color="text-blue-500"
        index={1}
      />
      <MetricCard
        icon={Calendar}
        label="Tenure"
        value={person.tenure}
        color="text-cyan-500"
        index={2}
      />
    </div>
  );
}
