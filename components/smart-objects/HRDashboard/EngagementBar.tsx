"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { DepartmentStats } from "@/lib/mock-data/hr-dashboard";

interface EngagementBarProps {
  department: DepartmentStats;
  index?: number;
  className?: string;
}

export function EngagementBar({
  department,
  index = 0,
  className,
}: EngagementBarProps) {
  // Determine bar color based on engagement
  const getBarColor = (engagement: number) => {
    if (engagement >= 90) return "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)";
    if (engagement >= 80) return "linear-gradient(90deg, #84cc16 0%, #65a30d 100%)";
    if (engagement >= 70) return "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)";
    return "linear-gradient(90deg, #ef4444 0%, #dc2626 100%)";
  };

  // Text color based on engagement
  const getTextColor = (engagement: number) => {
    if (engagement >= 90) return "text-green-500";
    if (engagement >= 80) return "text-lime-500";
    if (engagement >= 70) return "text-amber-500";
    return "text-rose-500";
  };

  return (
    <motion.div
      className={cn("flex items-center gap-3", className)}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
    >
      {/* Department name */}
      <span className="text-[10px] font-medium text-gray-400 w-20 truncate">
        {department.name}
      </span>

      {/* Progress bar */}
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#1a1a1a" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: getBarColor(department.engagement) }}
          initial={{ width: 0 }}
          animate={{ width: `${department.engagement}%` }}
          transition={{ delay: 0.2 + index * 0.05, duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Percentage */}
      <span className={cn("text-[10px] font-semibold w-9 text-right", getTextColor(department.engagement))}>
        {department.engagement}%
      </span>
    </motion.div>
  );
}
