"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Text } from "../atomics";
import type { DepartmentHiring } from "@/lib/mock-data/recruiting-dashboard";

interface DepartmentHiringBarProps {
  department: DepartmentHiring;
  index?: number;
  maxRoles?: number;
  className?: string;
}

const departmentColors: Record<string, string> = {
  Engineering: "#8b5cf6",
  Sales: "#f59e0b",
  Product: "#3b82f6",
  Design: "#ec4899",
  Marketing: "#10b981",
  HR: "#22c55e",
  Finance: "#06b6d4",
  Operations: "#f97316",
};

export function DepartmentHiringBar({
  department,
  index = 0,
  maxRoles = 10,
  className,
}: DepartmentHiringBarProps) {
  const color = departmentColors[department.name] || "#8b5cf6";
  const widthPercent = (department.openRoles / maxRoles) * 100;

  return (
    <motion.div
      className={cn("flex items-center gap-2", className)}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
    >
      {/* Department name */}
      <div className="w-20 flex-shrink-0">
        <Text variant="small" color="secondary" className="truncate">
          {department.name}
        </Text>
      </div>

      {/* Bar */}
      <div className="flex-1 h-4 bg-[var(--g0-bg-elevated-3)] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${widthPercent}%` }}
          transition={{ delay: index * 0.08 + 0.2, duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Count */}
      <div className="w-8 flex-shrink-0 text-right">
        <Text variant="small" className="tabular-nums" style={{ color }}>
          {department.openRoles}
        </Text>
      </div>
    </motion.div>
  );
}
