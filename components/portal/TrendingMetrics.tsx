"use client";

import { cn } from "@/lib/utils";
import { trendingMetrics, formatTrendingChange, type TrendingMetric } from "@/lib/mock-data/portal";
import { Sparkline } from "@/components/smart-objects/atomics/Sparkline";
import { TrendingUp } from "lucide-react";

interface TrendingItemProps {
  metric: TrendingMetric;
}

function TrendingItem({ metric }: TrendingItemProps) {
  const changeText = formatTrendingChange(metric);
  const isPositive = metric.trend === "up" || (metric.trend === "flat" && metric.change >= 0);

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-sm text-[var(--g0-text-secondary)]">
          {metric.label}
        </span>
        <span
          className={cn(
            "text-sm",
            isPositive
              ? "text-[var(--g0-status-success)]"
              : "text-[var(--g0-status-error)]"
          )}
        >
          {changeText}
        </span>
      </div>
      <Sparkline
        data={metric.sparklineData}
        width={60}
        height={18}
        color={isPositive ? "#22c55e" : "#ef4444"}
        showArea={false}
      />
    </div>
  );
}

export function TrendingMetrics() {
  return (
    <div className="rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)] p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-3.5 w-3.5 text-[var(--g0-status-success)]" />
        <h3 className="text-xs font-medium text-[var(--g0-text-tertiary)] uppercase tracking-wider">
          Trending (7d)
        </h3>
      </div>

      <div className="divide-y divide-[var(--g0-bg-elevated-3)]">
        {trendingMetrics.map((metric) => (
          <TrendingItem key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
}
