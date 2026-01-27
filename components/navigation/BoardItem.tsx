"use client";

import {
  LayoutDashboard,
  PieChart,
  Banknote,
  Users,
  TrendingUp,
  Workflow,
  ChevronRight,
  UserPlus,
  Coins,
  GraduationCap,
  UserMinus,
  Rocket,
  Calendar,
  Play,
  BarChart3,
  Building2,
  Heart,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/smart-objects/atomics";
import type { Board } from "@/lib/mock-data/organization";

interface BoardItemProps {
  board: Board;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard: LayoutDashboard,
  PieChart: PieChart,
  Banknote: Banknote,
  Users: Users,
  TrendingUp: TrendingUp,
  Workflow: Workflow,
  UserPlus: UserPlus,
  Coins: Coins,
  GraduationCap: GraduationCap,
  UserMinus: UserMinus,
  Rocket: Rocket,
  Calendar: Calendar,
  Play: Play,
  BarChart3: BarChart3,
  Building2: Building2,
  Heart: Heart,
};

export function BoardItem({
  board,
  isActive = false,
  onClick,
  className,
}: BoardItemProps) {
  const Icon = board.icon ? iconMap[board.icon] || LayoutDashboard : LayoutDashboard;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-all duration-150",
        isActive
          ? "bg-[var(--g0-accent-amber)]/10 text-[var(--g0-accent-amber)]"
          : "text-[var(--g0-text-secondary)] hover:bg-[var(--g0-bg-elevated-2)] hover:text-[var(--g0-text-primary)]",
        className
      )}
    >
      {/* Status indicator */}
      <div
        className={cn(
          "h-2 w-2 rounded-full transition-colors",
          isActive
            ? "bg-[var(--g0-accent-amber)]"
            : "border border-[var(--g0-text-muted)]"
        )}
      />

      {/* Icon */}
      <Icon className="h-4 w-4 flex-shrink-0" />

      {/* Board name */}
      <Text
        variant="body"
        className={cn(
          "flex-1 truncate",
          isActive && "font-medium"
        )}
      >
        {board.name}
      </Text>

      {/* Arrow on hover */}
      <ChevronRight
        className={cn(
          "h-4 w-4 flex-shrink-0 opacity-0 transition-opacity",
          "group-hover:opacity-100"
        )}
      />
    </button>
  );
}
