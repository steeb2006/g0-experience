"use client";

import { motion } from "framer-motion";
import {
  UserPlus,
  Coins,
  GraduationCap,
  UserMinus,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { HRSubBoardLink } from "@/lib/mock-data/hr-dashboard";

interface HRSubBoardCardProps {
  subBoard: HRSubBoardLink;
  index?: number;
  onClick?: () => void;
  className?: string;
  compact?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  UserPlus: UserPlus,
  Coins: Coins,
  GraduationCap: GraduationCap,
  UserMinus: UserMinus,
};

export function HRSubBoardCard({
  subBoard,
  index = 0,
  onClick,
  className,
  compact = false,
}: HRSubBoardCardProps) {
  const Icon = iconMap[subBoard.icon] || UserPlus;

  if (compact) {
    return (
      <motion.button
        onClick={onClick}
        className={cn(
          "group flex items-center gap-2 px-4 py-2 rounded-lg",
          "transition-all duration-200",
          className
        )}
        style={{
          background: "#111111",
          border: "1px solid #1a1a1a",
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + index * 0.05 }}
        whileHover={{
          background: "#1a1a1a",
          borderColor: "#10b981",
          scale: 1.02,
        }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon className="h-4 w-4 text-emerald-500" />
        <span className="text-[12px] font-medium text-gray-300 group-hover:text-white transition-colors">
          {subBoard.name}
        </span>
        <ChevronRight className="h-3 w-3 text-gray-600 group-hover:text-emerald-500 transition-colors" />
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center w-28 h-28 rounded-xl",
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
        delay: 0.2 + index * 0.05,
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.02,
        borderColor: "#10b981",
        background: "#111111",
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="mb-2 h-6 w-6 text-gray-500 group-hover:text-emerald-500 transition-colors" />

      <span className="text-[12px] text-center font-medium text-gray-400 group-hover:text-white transition-colors">
        {subBoard.name}
      </span>

      <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-600 group-hover:text-emerald-500 transition-colors">
        <span>Enter</span>
        <ChevronRight className="h-3 w-3" />
      </div>
    </motion.button>
  );
}
