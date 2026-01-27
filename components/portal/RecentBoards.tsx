"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Clock, ArrowRight } from "lucide-react";
import { organization, workspaces } from "@/lib/mock-data/organization";

// Mock recent boards (in real app, would come from portal store)
const recentBoards = [
  { id: "board_overview", name: "Finance Overview", workspace: "Finance", workspaceId: "ws_finance", color: "#3b82f6" },
  { id: "board_customers", name: "Customers", workspace: "Sales", workspaceId: "ws_sales", color: "#a855f7" },
  { id: "board_hr_overview", name: "People & Culture", workspace: "HR", workspaceId: "ws_hr", color: "#22c55e" },
  { id: "board_forecast", name: "Forecast", workspace: "Finance", workspaceId: "ws_finance", color: "#3b82f6" },
];

export function RecentBoards() {
  const router = useRouter();

  const handleBoardClick = (board: typeof recentBoards[0]) => {
    router.push(`/${organization.id}/${board.workspaceId}/${board.id}`);
  };

  return (
    <div className="rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)] p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-3.5 w-3.5 text-[var(--g0-text-tertiary)]" />
        <h3 className="text-xs font-medium text-[var(--g0-text-tertiary)] uppercase tracking-wider">
          Recent
        </h3>
      </div>

      <div className="space-y-1">
        {recentBoards.map((board) => (
          <button
            key={board.id}
            onClick={() => handleBoardClick(board)}
            className={cn(
              "w-full flex items-center gap-3 p-2 -mx-2 rounded-lg",
              "hover:bg-[var(--g0-bg-elevated-2)] transition-colors duration-150",
              "group text-left"
            )}
          >
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: board.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--g0-text-primary)] truncate">
                {board.name}
              </p>
              <p className="text-xs text-[var(--g0-text-tertiary)]">
                {board.workspace}
              </p>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-[var(--g0-text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
}
