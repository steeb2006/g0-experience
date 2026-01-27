"use client";

import { motion } from "framer-motion";
import { User, TrendingUp, TrendingDown, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Employee } from "@/lib/mock-data/hr-dashboard";

interface PersonCardProps {
  employee: Employee;
  size?: "sm" | "md" | "lg";
  showStats?: boolean;
  index?: number;
  className?: string;
}

export function PersonCard({
  employee,
  size = "md",
  showStats = true,
  index = 0,
  className,
}: PersonCardProps) {
  const sizeConfig = {
    sm: {
      container: "w-16 h-16",
      avatar: 32,
      nameText: "text-[9px]",
      titleText: "text-[7px]",
      statsText: "text-[7px]",
    },
    md: {
      container: "w-20 h-24",
      avatar: 40,
      nameText: "text-[10px]",
      titleText: "text-[8px]",
      statsText: "text-[8px]",
    },
    lg: {
      container: "w-28 h-32",
      avatar: 52,
      nameText: "text-xs",
      titleText: "text-[10px]",
      statsText: "text-[9px]",
    },
  };

  const config = sizeConfig[size];

  // Determine engagement color
  const getEngagementColor = (engagement?: number) => {
    if (!engagement) return "text-gray-400";
    if (engagement >= 90) return "text-green-500";
    if (engagement >= 80) return "text-lime-500";
    if (engagement >= 70) return "text-amber-500";
    return "text-rose-500";
  };

  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl p-2",
        "transition-all duration-200",
        className
      )}
      style={{
        background: "#0a0a0a",
        border: "1px solid #1a1a1a",
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.02,
        borderColor: "#3b82f6",
        boxShadow: "0 4px 20px rgba(59, 130, 246, 0.15)",
      }}
    >
      {/* Avatar */}
      <div
        className="relative rounded-full flex items-center justify-center mb-1.5"
        style={{
          width: config.avatar,
          height: config.avatar,
          background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
          border: "2px solid #3b82f6",
        }}
      >
        {employee.avatar ? (
          <img
            src={employee.avatar}
            alt={employee.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <User
            className="text-blue-400"
            style={{
              width: config.avatar * 0.5,
              height: config.avatar * 0.5,
            }}
          />
        )}

        {/* Status indicator */}
        <motion.div
          className="absolute -bottom-0.5 -right-0.5 rounded-full"
          style={{
            width: size === "lg" ? 12 : 8,
            height: size === "lg" ? 12 : 8,
            background: "#22c55e",
            border: "2px solid #0a0a0a",
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Name */}
      <span
        className={cn(
          "font-semibold text-white text-center leading-tight truncate w-full",
          config.nameText
        )}
      >
        {employee.name}
      </span>

      {/* Title */}
      <span
        className={cn(
          "text-gray-500 text-center leading-tight truncate w-full",
          config.titleText
        )}
      >
        {employee.title}
      </span>

      {/* Stats */}
      {showStats && (size === "md" || size === "lg") && (
        <div className="flex items-center gap-2 mt-1.5">
          {/* Team size */}
          {employee.teamSize !== undefined && (
            <div className="flex items-center gap-0.5">
              <Users className="h-2.5 w-2.5 text-gray-500" />
              <span className={cn("text-gray-400", config.statsText)}>
                {employee.teamSize}
              </span>
            </div>
          )}

          {/* Engagement */}
          {employee.engagement !== undefined && (
            <div className="flex items-center gap-0.5">
              <span
                className={cn(
                  "font-medium",
                  config.statsText,
                  getEngagementColor(employee.engagement)
                )}
              >
                {employee.engagement}%
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
