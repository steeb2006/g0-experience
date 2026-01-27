"use client";

import { cn } from "@/lib/utils";
import { workspaceSummaries, getOrgHealthScore } from "@/lib/mock-data/portal";
import { Gauge } from "lucide-react";

export function OrgHealthScore() {
  const orgScore = getOrgHealthScore();

  const getScoreColor = (score: number) => {
    if (score >= 85) return "var(--g0-status-success)";
    if (score >= 70) return "var(--g0-accent-amber)";
    if (score >= 50) return "var(--g0-status-warning)";
    return "var(--g0-status-error)";
  };

  return (
    <div className="rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)] p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="h-3.5 w-3.5 text-[var(--g0-text-tertiary)]" />
        <h3 className="text-xs font-medium text-[var(--g0-text-tertiary)] uppercase tracking-wider">
          Org Health
        </h3>
      </div>

      {/* Main score */}
      <div className="flex items-center justify-center mb-4">
        <div
          className="relative w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: `conic-gradient(${getScoreColor(orgScore)} ${orgScore * 3.6}deg, var(--g0-bg-elevated-3) 0deg)`,
          }}
        >
          <div className="absolute inset-2 rounded-full bg-[var(--g0-bg-elevated-1)] flex items-center justify-center">
            <span
              className="text-2xl"
              style={{ color: getScoreColor(orgScore) }}
            >
              {orgScore}
            </span>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-[var(--g0-text-tertiary)] mb-4">
        Organization Health
      </p>

      {/* Workspace breakdown */}
      <div className="space-y-2.5">
        {workspaceSummaries.map((ws) => (
          <div key={ws.id} className="flex items-center gap-2">
            <span className="text-xs text-[var(--g0-text-secondary)] w-16 truncate">
              {ws.name}
            </span>
            <div className="flex-1 h-1.5 bg-[var(--g0-bg-elevated-3)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${ws.healthScore}%`,
                  backgroundColor: ws.color,
                }}
              />
            </div>
            <span
              className="text-xs w-6 text-right"
              style={{ color: ws.color }}
            >
              {ws.healthScore}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
