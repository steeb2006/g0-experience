"use client";

import { cn } from "@/lib/utils";
import { crossWorkspaceInsights } from "@/lib/mock-data/portal";
import { Sparkles, ArrowUpRight } from "lucide-react";

const workspaceColors: Record<string, string> = {
  Finance: "#3b82f6",
  HR: "#22c55e",
  Sales: "#a855f7",
  Operations: "#f97316",
};

export function CrossWorkspaceInsights() {
  return (
    <div className="rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)] p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-3.5 w-3.5 text-[var(--g0-accent-amber)]" />
        <h3 className="text-xs font-medium text-[var(--g0-text-tertiary)] uppercase tracking-wider">
          AI Insights
        </h3>
      </div>

      <div className="space-y-3">
        {crossWorkspaceInsights.map((item) => (
          <div
            key={item.id}
            className={cn(
              "p-3 rounded-lg",
              "bg-[var(--g0-bg-elevated-2)]/50 border border-[var(--g0-bg-elevated-3)]",
              "hover:bg-[var(--g0-bg-elevated-2)] transition-colors duration-150",
              "cursor-pointer group"
            )}
          >
            <p className="text-sm text-[var(--g0-text-primary)] leading-relaxed mb-2">
              {item.insight}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {item.involvedWorkspaces.map((ws) => (
                <span
                  key={ws}
                  className="text-[10px] px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: `${workspaceColors[ws]}20`,
                    color: workspaceColors[ws],
                  }}
                >
                  {ws}
                </span>
              ))}
              <ArrowUpRight className="h-3 w-3 text-[var(--g0-text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
