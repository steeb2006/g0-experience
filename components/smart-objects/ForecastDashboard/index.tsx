"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Maximize2,
  X,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/smart-objects/atomics";
import { useNavigationStore } from "@/lib/stores";
import { findBoardById } from "@/lib/mock-data/organization";
import {
  forecastDashboardData,
  formatForecastCurrency,
  formatForecastPercentage,
  getStatusColor,
  getStatusLabel,
  type Customer,
  type PipelineStage,
  type ForecastKPI
} from "@/lib/mock-data/forecast-dashboard";

interface ForecastDashboardProps {
  className?: string;
}

// Pipeline Stage Bar
function PipelineBar({ stage, maxValue, index }: { stage: PipelineStage; maxValue: number; index: number }) {
  const width = (stage.value / maxValue) * 100;

  const colorMap: Record<string, string> = {
    slate: "#64748b",
    blue: "#3b82f6",
    cyan: "#06b6d4",
    amber: "#f59e0b",
    lime: "#84cc16",
  };

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="w-24 text-[10px] text-gray-400 truncate">{stage.name}</div>
      <div className="flex-1 h-6 rounded overflow-hidden" style={{ background: "#1a1a1a" }}>
        <motion.div
          className="h-full rounded flex items-center justify-end pr-2"
          style={{ background: colorMap[stage.color] || colorMap.blue }}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
        >
          <span className="text-[9px] font-medium text-white">
            {formatForecastCurrency(stage.value)}
          </span>
        </motion.div>
      </div>
      <div className="w-12 text-right">
        <span className="text-[10px] text-gray-500">{stage.count} deals</span>
      </div>
      <div className="w-10 text-right">
        <span className="text-[10px] font-medium" style={{ color: colorMap[stage.color] }}>
          {formatForecastPercentage(stage.probability)}
        </span>
      </div>
    </motion.div>
  );
}

// Customer Row
function CustomerRow({ customer, index }: { customer: Customer; index: number }) {
  const statusColor = getStatusColor(customer.status);

  return (
    <motion.div
      className="flex items-center gap-2 py-2 border-b border-[#1a1a1a] last:border-0"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* Status indicator */}
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: statusColor }}
      />

      {/* Customer name */}
      <div className="flex-1 min-w-0">
        <span className="text-[11px] font-medium text-white truncate block">
          {customer.name}
        </span>
      </div>

      {/* Value */}
      <div className="w-16 text-right">
        <span className="text-[10px] text-gray-300">
          {formatForecastCurrency(customer.value)}
        </span>
      </div>

      {/* Probability */}
      <div className="w-10 text-right">
        <span className="text-[10px] text-cyan-400">
          {formatForecastPercentage(customer.probability)}
        </span>
      </div>

      {/* Delta */}
      <div className="w-12 text-right flex items-center justify-end gap-0.5">
        {customer.delta > 0 ? (
          <ArrowUpRight className="w-3 h-3 text-green-500" />
        ) : customer.delta < 0 ? (
          <ArrowDownRight className="w-3 h-3 text-rose-500" />
        ) : (
          <Minus className="w-3 h-3 text-gray-500" />
        )}
        <span className={cn(
          "text-[10px] font-medium",
          customer.delta > 0 ? "text-green-500" : customer.delta < 0 ? "text-rose-500" : "text-gray-500"
        )}>
          {customer.delta > 0 ? "+" : ""}{(customer.delta * 100).toFixed(0)}%
        </span>
      </div>

      {/* Status badge */}
      <div
        className="w-14 text-center py-0.5 rounded text-[8px] font-medium"
        style={{
          background: `${statusColor}20`,
          color: statusColor,
        }}
      >
        {getStatusLabel(customer.status)}
      </div>
    </motion.div>
  );
}

// KPI Card
function KPICard({ kpi, index }: { kpi: ForecastKPI; index: number }) {
  const colorMap: Record<string, string> = {
    blue: "#3b82f6",
    cyan: "#06b6d4",
    lime: "#84cc16",
    amber: "#f59e0b",
    green: "#22c55e",
    rose: "#ef4444",
  };

  const color = colorMap[kpi.color || "blue"];

  const formatValue = () => {
    switch (kpi.format) {
      case "currency":
        return formatForecastCurrency(kpi.value);
      case "percentage":
        return formatForecastPercentage(kpi.value);
      default:
        return kpi.value.toString();
    }
  };

  return (
    <motion.div
      className="rounded-xl p-3"
      style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="text-[10px] text-gray-500 uppercase mb-1">{kpi.label}</div>
      <div className="text-lg font-bold" style={{ color }}>{formatValue()}</div>
      {kpi.change !== undefined && (
        <div className="flex items-center gap-1 mt-1">
          {kpi.trend === "up" ? (
            <TrendingUp className="w-3 h-3 text-green-500" />
          ) : kpi.trend === "down" ? (
            <TrendingDown className="w-3 h-3 text-rose-500" />
          ) : null}
          <span className={cn(
            "text-[10px]",
            kpi.trend === "up" ? "text-green-500" : kpi.trend === "down" ? "text-rose-500" : "text-gray-500"
          )}>
            {kpi.change > 0 ? "+" : ""}{(kpi.change * 100).toFixed(0)}%
          </span>
        </div>
      )}
    </motion.div>
  );
}

export function ForecastDashboard({ className }: ForecastDashboardProps) {
  const { breadcrumb, clearBreadcrumb, setCurrentBoard } = useNavigationStore();
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBack = () => {
    if (breadcrumb.length > 0) {
      const parentBoard = breadcrumb[breadcrumb.length - 1];
      clearBreadcrumb();
      setCurrentBoard(parentBoard.id);
    }
  };

  // Handle Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && isPresentationMode) {
      setIsPresentationMode(false);
    }
  }, [isPresentationMode]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const { entity, data } = forecastDashboardData;
  const { title, period, kpis, pipeline, customers, weightedPipeline, closingRatio } = data;

  // Sort customers by status priority
  const sortedCustomers = [...customers].sort((a, b) => {
    const priority = { "at-risk": 0, "underperforming": 1, "on-track": 2, "overperforming": 3 };
    return priority[a.status] - priority[b.status];
  });

  // Get max pipeline value for scaling
  const maxPipelineValue = Math.max(...pipeline.map(s => s.value));

  // Container dimensions
  const containerWidth = 960;
  const containerHeight = 540;

  // Presentation overlay
  const presentationOverlay = isPresentationMode && mounted ? createPortal(
    <motion.div
      className="fixed inset-0 z-[9999] bg-[var(--g0-bg-base)] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        onClick={() => setIsPresentationMode(false)}
        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-[var(--g0-bg-elevated-2)] border border-[var(--g0-bg-elevated-3)] hover:bg-[var(--g0-bg-elevated-3)] transition-colors"
      >
        <X className="h-5 w-5 text-[var(--g0-text-secondary)]" />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[12px] text-[var(--g0-text-muted)]">
        Press <kbd className="px-2 py-1 bg-[var(--g0-bg-elevated-2)] rounded border border-[var(--g0-bg-elevated-3)]">Esc</kbd> to exit
      </div>
      <div className="transform scale-[1.3]">
        <DashboardContent />
      </div>
    </motion.div>,
    document.body
  ) : null;

  function DashboardContent() {
    return (
      <motion.div
        className={cn(
          "relative rounded-2xl overflow-hidden",
          className
        )}
        style={{
          width: containerWidth,
          height: containerHeight,
          background: "linear-gradient(180deg, #0a0a0a 0%, #000000 100%)",
          border: "1px solid #1a1a1a",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 h-14 px-6 flex items-center justify-between z-10" style={{ borderBottom: "1px solid #1a1a1a" }}>
          <div className="flex items-center gap-4">
            {breadcrumb.length > 0 && (
              <button
                onClick={handleBack}
                className="p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors"
              >
                <ArrowLeft className="h-4 w-4 text-gray-400" />
              </button>
            )}
            <h1 className="text-base font-semibold text-white">{title}</h1>
            <span className="text-xs text-gray-500 px-2 py-1 rounded" style={{ background: "#111111" }}>{period}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPresentationMode(true)}
              className="p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors"
            >
              <Maximize2 className="h-4 w-4 text-gray-400" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-gray-500">Live</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="absolute top-14 bottom-0 left-0 right-0 flex">
          {/* Left Panel - KPIs & Pipeline */}
          <div className="w-[340px] p-4 flex flex-col gap-3" style={{ borderRight: "1px solid #1a1a1a" }}>
            {/* Top KPIs - 2x2 grid */}
            <div className="grid grid-cols-2 gap-2">
              {kpis.slice(0, 4).map((kpi, i) => (
                <KPICard key={kpi.id} kpi={kpi} index={i} />
              ))}
            </div>

            {/* Pipeline Funnel */}
            <motion.div
              className="flex-1 rounded-xl p-4"
              style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-gray-400 uppercase">Pipeline by Stage</span>
                <Target className="h-3.5 w-3.5 text-cyan-500" />
              </div>
              <div className="space-y-2">
                {pipeline.map((stage, i) => (
                  <PipelineBar key={stage.id} stage={stage} maxValue={maxPipelineValue} index={i} />
                ))}
              </div>
            </motion.div>

            {/* Bottom KPIs */}
            <div className="grid grid-cols-2 gap-2">
              {kpis.slice(4, 6).map((kpi, i) => (
                <KPICard key={kpi.id} kpi={kpi} index={i + 4} />
              ))}
            </div>
          </div>

          {/* Right Panel - Customer Performance */}
          <div className="flex-1 p-4 flex flex-col">
            <motion.div
              className="flex-1 rounded-xl p-4 flex flex-col"
              style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-gray-400 uppercase">Customer Performance</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[9px] text-gray-500">Over</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[9px] text-gray-500">On Track</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-[9px] text-gray-500">Under</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-[9px] text-gray-500">At Risk</span>
                  </div>
                </div>
              </div>

              {/* Table header */}
              <div className="flex items-center gap-2 py-2 border-b border-[#2a2a2a] mb-1">
                <div className="w-2" />
                <div className="flex-1 text-[9px] text-gray-500 uppercase">Customer</div>
                <div className="w-16 text-right text-[9px] text-gray-500 uppercase">Value</div>
                <div className="w-10 text-right text-[9px] text-gray-500 uppercase">Prob</div>
                <div className="w-12 text-right text-[9px] text-gray-500 uppercase">vs Fcst</div>
                <div className="w-14 text-center text-[9px] text-gray-500 uppercase">Status</div>
              </div>

              {/* Customer list */}
              <div className="flex-1 overflow-y-auto">
                {sortedCustomers.map((customer, i) => (
                  <CustomerRow key={customer.id} customer={customer} index={i} />
                ))}
              </div>

              {/* Summary footer */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#2a2a2a]">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[9px] text-gray-500 block">Weighted Pipeline</span>
                    <span className="text-sm font-bold text-cyan-400">{formatForecastCurrency(weightedPipeline)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 block">Closing Ratio</span>
                    <span className="text-sm font-bold text-lime-400">{formatForecastPercentage(closingRatio)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-[10px] text-gray-400">
                    {customers.filter(c => c.status === "overperforming" || c.status === "on-track").length} of {customers.length} on track
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {presentationOverlay}
      <DashboardContent />
    </>
  );
}
