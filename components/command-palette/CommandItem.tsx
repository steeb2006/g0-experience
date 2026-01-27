"use client";

import {
  LayoutDashboard,
  PieChart,
  Banknote,
  Users,
  TrendingUp,
  Plus,
  MessageSquare,
  PanelLeft,
  Maximize,
  FileText,
  DollarSign,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/smart-objects/atomics";
import type { Command } from "@/lib/stores/command-palette";

interface CommandItemProps {
  command: Command;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard: LayoutDashboard,
  PieChart: PieChart,
  Banknote: Banknote,
  Users: Users,
  TrendingUp: TrendingUp,
  Plus: Plus,
  MessageSquare: MessageSquare,
  PanelLeft: PanelLeft,
  Maximize: Maximize,
  FileText: FileText,
  DollarSign: DollarSign,
};

export function CommandItem({
  command,
  isSelected = false,
  onClick,
  className,
}: CommandItemProps) {
  const Icon = command.icon ? iconMap[command.icon] || LayoutDashboard : LayoutDashboard;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
        isSelected
          ? "bg-[var(--g0-accent-amber)]/10 text-[var(--g0-text-primary)]"
          : "text-[var(--g0-text-secondary)] hover:bg-[var(--g0-bg-elevated-2)] hover:text-[var(--g0-text-primary)]",
        className
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />

      <span className="flex-1 truncate">
        <Text variant="body">{command.label}</Text>
      </span>

      {command.shortcut && (
        <kbd className="rounded bg-[var(--g0-bg-elevated-3)] px-1.5 py-0.5 text-[10px] text-[var(--g0-text-muted)]">
          {command.shortcut}
        </kbd>
      )}
    </button>
  );
}
