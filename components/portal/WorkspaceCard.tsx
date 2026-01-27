"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { WorkspaceSummary } from "@/lib/mock-data/portal";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface WorkspaceCardProps {
  workspace: WorkspaceSummary;
  orgId: string;
}

export function WorkspaceCard({ workspace, orgId }: WorkspaceCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    // Navigate to first board in workspace
    if (workspace.boards.length > 0) {
      router.push(`/${orgId}/${workspace.id}/${workspace.boards[0].id}`);
    }
  };

  const handleBoardClick = (e: React.MouseEvent, boardId: string) => {
    e.stopPropagation();
    router.push(`/${orgId}/${workspace.id}/${boardId}`);
  };

  const getTrendIcon = (trend?: "up" | "down" | "flat") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-[var(--g0-status-success)]" />;
      case "down":
        return <TrendingDown className="h-3 w-3 text-[var(--g0-status-error)]" />;
      default:
        return <Minus className="h-3 w-3 text-[var(--g0-text-tertiary)]" />;
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "group relative rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)]",
        "p-4 cursor-pointer transition-all duration-200",
        "hover:bg-[var(--g0-bg-elevated-2)] hover:border-[var(--g0-bg-elevated-4)]",
        "hover:shadow-lg hover:shadow-black/20"
      )}
    >
      {/* Color accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ backgroundColor: workspace.color }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[var(--g0-text-primary)]">
            {workspace.name}
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded-md bg-[var(--g0-bg-elevated-3)] text-[var(--g0-text-secondary)]"
            style={{ borderLeft: `2px solid ${workspace.color}` }}
          >
            {workspace.entityOwner.name}
          </span>
        </div>
        <div
          className="text-xs px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${workspace.color}20`,
            color: workspace.color,
          }}
        >
          {workspace.healthScore}
        </div>
      </div>

      {/* KPIs */}
      <div className="space-y-2 mb-4">
        {workspace.kpis.map((kpi, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-[var(--g0-text-tertiary)]">{kpi.label}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--g0-text-primary)]">
                {kpi.value}
              </span>
              {getTrendIcon(kpi.trend)}
            </div>
          </div>
        ))}
      </div>

      {/* Board buttons */}
      <div className="flex flex-wrap gap-2">
        {workspace.boards.map((board) => (
          <button
            key={board.id}
            onClick={(e) => handleBoardClick(e, board.id)}
            className={cn(
              "text-xs px-2.5 py-1 rounded-md",
              "bg-[var(--g0-bg-elevated-2)] text-[var(--g0-text-secondary)]",
              "hover:bg-[var(--g0-bg-elevated-3)] hover:text-[var(--g0-text-primary)]",
              "transition-colors duration-150"
            )}
          >
            {board.name}
          </button>
        ))}
      </div>
    </div>
  );
}
