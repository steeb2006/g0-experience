"use client";

import {
  FileText,
  PieChart,
  TrendingUp,
  Calculator,
  Network,
  Heart,
  AlertTriangle,
  UserPlus,
  DollarSign,
  Users,
  Megaphone,
  Target,
  HeartPulse,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EntityTool } from "@/lib/mock-data/entity-tools";

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  FileText,
  PieChart,
  TrendingUp,
  Calculator,
  Network,
  Heart,
  AlertTriangle,
  UserPlus,
  DollarSign,
  Users,
  Megaphone,
  Target,
  HeartPulse,
  AlertCircle,
  Sparkles,
};

interface ToolCardProps {
  tool: EntityTool;
  onClick: () => void;
  compact?: boolean;
  isSelected?: boolean;
  className?: string;
}

export function ToolCard({ tool, onClick, compact = false, isSelected = false, className }: ToolCardProps) {
  const Icon = iconMap[tool.icon] || Zap;

  if (compact) {
    // Compact version for popover
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex w-full items-center gap-2 px-2 py-1.5 rounded-lg",
          "transition-colors text-left",
          isSelected
            ? "bg-[var(--g0-accent-primary)]/20 text-[var(--g0-accent-primary)]"
            : "hover:bg-[var(--g0-bg-elevated-2)]",
          className
        )}
      >
        <Icon className={cn(
          "h-3.5 w-3.5",
          isSelected ? "text-[var(--g0-accent-primary)]" : "text-[var(--g0-accent-primary)]"
        )} />
        <span className={cn(
          "text-[11px] font-medium truncate",
          isSelected ? "text-[var(--g0-accent-primary)]" : "text-[var(--g0-text-primary)]"
        )}>
          {tool.displayName}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 px-3 py-2.5 rounded-lg",
        "hover:bg-[var(--g0-bg-elevated-2)] transition-all duration-150",
        "border border-transparent hover:border-[var(--g0-bg-elevated-3)]",
        className
      )}
    >
      {/* Icon container */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          "bg-[var(--g0-accent-primary)]/10 text-[var(--g0-accent-primary)]",
          "group-hover:bg-[var(--g0-accent-primary)]/20 transition-colors"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <span className="block text-[12px] font-medium text-[var(--g0-text-primary)] truncate">
          {tool.displayName}
        </span>
        <span className="block text-[10px] text-[var(--g0-text-muted)] truncate">
          {tool.description}
        </span>
      </div>

      {/* Arrow - shows on hover */}
      <ChevronRight
        className={cn(
          "h-4 w-4 shrink-0 text-[var(--g0-text-muted)]",
          "opacity-0 group-hover:opacity-100 transition-opacity"
        )}
      />
    </button>
  );
}
