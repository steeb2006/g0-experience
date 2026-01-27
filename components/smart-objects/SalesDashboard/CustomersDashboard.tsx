"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  Building2,
  TrendingUp,
  TrendingDown,
  Heart,
  PieChart,
  Users,
  AlertTriangle,
  CheckCircle,
  Maximize2,
  X,
  ChevronRight,
  Radar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigationStore } from "@/lib/stores";
import { organization, findBoardById } from "@/lib/mock-data/organization";
import {
  customersData,
  formatSalesCurrency,
  formatSalesPercentage,
  getHealthColor,
  getStatusColor,
  type CustomerSegment,
  type CustomerAccount,
  type CustomerMetric,
} from "@/lib/mock-data/sales-dashboard";

// Sub-board card
function SubBoardCard({
  subBoard,
  index,
  onClick,
}: {
  subBoard: { id: string; name: string; icon: string };
  index: number;
  onClick: () => void;
}) {
  const iconMap: Record<string, React.ElementType> = {
    PieChart: PieChart,
    Heart: Heart,
    TrendingUp: TrendingUp,
    Radar: Radar,
  };
  const Icon = iconMap[subBoard.icon] || PieChart;

  return (
    <motion.button
      onClick={onClick}
      className="group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
      style={{ background: "#111111", border: "1px solid #1a1a1a" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.05 }}
      whileHover={{ background: "#1a1a1a", borderColor: "#8b5cf6", scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="h-4 w-4 text-violet-500" />
      <span className="text-[12px] font-medium text-gray-300 group-hover:text-white transition-colors">
        {subBoard.name}
      </span>
      <ChevronRight className="h-3 w-3 text-gray-600 group-hover:text-violet-500 transition-colors" />
    </motion.button>
  );
}

// Segment donut chart slice
function SegmentDonut({ segments }: { segments: CustomerSegment[] }) {
  const total = segments.reduce((sum, s) => sum + s.revenue, 0);
  let currentAngle = -90;

  const colorMap: Record<string, string> = {
    blue: "#3b82f6",
    cyan: "#06b6d4",
    violet: "#8b5cf6",
  };

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg viewBox="0 0 100 100" className="transform -rotate-90">
        {segments.map((segment, i) => {
          const percentage = segment.revenue / total;
          const angle = percentage * 360;
          const startAngle = currentAngle;
          currentAngle += angle;

          const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
          const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);

          const largeArc = angle > 180 ? 1 : 0;

          return (
            <motion.path
              key={segment.id}
              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={colorMap[segment.color] || colorMap.blue}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            />
          );
        })}
        <circle cx="50" cy="50" r="25" fill="#0a0a0a" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-white">{segments.reduce((sum, s) => sum + s.count, 0)}</span>
        <span className="text-[9px] text-gray-500">Customers</span>
      </div>
    </div>
  );
}

// Customer row
function CustomerRow({ account, index }: { account: CustomerAccount; index: number }) {
  const statusColor = getStatusColor(account.status);
  const healthColor = getHealthColor(account.healthScore);

  return (
    <motion.div
      className="flex items-center gap-2 py-2 border-b border-[#1a1a1a] last:border-0"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: statusColor }} />
      <div className="flex-1 min-w-0">
        <span className="text-[11px] font-medium text-white truncate block">{account.name}</span>
        <span className="text-[9px] text-gray-500">{account.segment}</span>
      </div>
      <div className="w-16 text-right">
        <span className="text-[10px] text-cyan-400">{formatSalesCurrency(account.arr)}</span>
      </div>
      <div className="w-10 text-center">
        <span className="text-[10px] font-medium" style={{ color: healthColor }}>{account.healthScore}</span>
      </div>
      <div className="w-10 text-center">
        <span className="text-[10px] text-gray-400">{account.nps}</span>
      </div>
      <div className="w-14 text-right">
        {account.expansionPotential > 0 ? (
          <span className="text-[10px] text-lime-400">+{formatSalesCurrency(account.expansionPotential)}</span>
        ) : (
          <span className="text-[10px] text-gray-600">-</span>
        )}
      </div>
    </motion.div>
  );
}

// KPI Card
function KPICard({ metric, index }: { metric: CustomerMetric; index: number }) {
  const colorMap: Record<string, string> = {
    blue: "#3b82f6",
    cyan: "#06b6d4",
    lime: "#84cc16",
    green: "#22c55e",
    rose: "#f43f5e",
    violet: "#8b5cf6",
  };
  const color = colorMap[metric.color || "blue"];

  const formatValue = () => {
    switch (metric.format) {
      case "currency": return formatSalesCurrency(metric.value);
      case "percentage": return formatSalesPercentage(metric.value);
      default: return metric.value.toString();
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
      <div className="text-[9px] text-gray-500 uppercase mb-1">{metric.label}</div>
      <div className="text-lg font-bold" style={{ color }}>{formatValue()}</div>
      {metric.change !== undefined && (
        <div className="flex items-center gap-1 mt-0.5">
          {metric.trend === "up" ? (
            <TrendingUp className="w-3 h-3" style={{ color: metric.id === "churn_rate" ? "#22c55e" : "#22c55e" }} />
          ) : metric.trend === "down" ? (
            <TrendingDown className="w-3 h-3" style={{ color: metric.id === "churn_rate" ? "#22c55e" : "#ef4444" }} />
          ) : null}
          <span className="text-[9px]" style={{ color: "#22c55e" }}>
            {metric.change > 0 ? "+" : ""}{metric.format === "percentage" ? `${(metric.change * 100).toFixed(1)}pts` : metric.change}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export function CustomersDashboard({ className }: { className?: string }) {
  const router = useRouter();
  const { setCurrentBoard, addToBreadcrumb, currentBoardId, currentWorkspaceId } = useNavigationStore();
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubBoardClick = (boardId: string) => {
    const currentBoard = findBoardById(currentBoardId);
    if (currentBoard) {
      addToBreadcrumb({ id: currentBoardId, name: currentBoard.name });
    }
    setCurrentBoard(boardId);
    router.push(`/${organization.slug}/${currentWorkspaceId}/${boardId}`);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && isPresentationMode) {
      setIsPresentationMode(false);
    }
  }, [isPresentationMode]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const { entity, data } = customersData;
  const { title, period, metrics, segments, accounts, subBoards } = data;

  // Sort accounts by health score (lowest first)
  const sortedAccounts = [...accounts].sort((a, b) => a.healthScore - b.healthScore);

  const containerWidth = 960;
  const containerHeight = 540;

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
        className={cn("relative rounded-2xl overflow-hidden", className)}
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
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-violet-500" />
              <h1 className="text-base font-semibold text-white">{title}</h1>
            </div>
            <span className="text-xs text-gray-500 px-2 py-1 rounded" style={{ background: "#111111" }}>{period}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsPresentationMode(true)} className="p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors">
              <Maximize2 className="h-4 w-4 text-gray-400" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-xs text-gray-500">Live</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="absolute top-14 bottom-14 left-0 right-0 flex">
          {/* Left Panel - KPIs & Segments */}
          <div className="w-[280px] p-4 flex flex-col gap-3" style={{ borderRight: "1px solid #1a1a1a" }}>
            {/* KPIs 2x3 grid */}
            <div className="grid grid-cols-2 gap-2">
              {metrics.map((m, i) => (
                <KPICard key={m.id} metric={m} index={i} />
              ))}
            </div>

            {/* Segments */}
            <motion.div
              className="flex-1 rounded-xl p-4"
              style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-gray-400 uppercase">Revenue by Segment</span>
                <PieChart className="h-3.5 w-3.5 text-violet-500" />
              </div>
              <SegmentDonut segments={segments} />
              <div className="mt-3 space-y-2">
                {segments.map((seg, i) => {
                  const colorMap: Record<string, string> = { blue: "#3b82f6", cyan: "#06b6d4", violet: "#8b5cf6" };
                  return (
                    <div key={seg.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: colorMap[seg.color] }} />
                        <span className="text-[10px] text-gray-400">{seg.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white">{formatSalesCurrency(seg.revenue)}</span>
                        <span className="text-[9px] text-lime-400">+{(seg.growth * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Customer Accounts */}
          <div className="flex-1 p-4">
            <motion.div
              className="h-full rounded-xl p-4 flex flex-col"
              style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-gray-400 uppercase">Customer Accounts</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[9px] text-gray-500">Healthy</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-[9px] text-gray-500">Attention</span>
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
                <div className="flex-1 text-[9px] text-gray-500 uppercase">Account</div>
                <div className="w-16 text-right text-[9px] text-gray-500 uppercase">ARR</div>
                <div className="w-10 text-center text-[9px] text-gray-500 uppercase">Health</div>
                <div className="w-10 text-center text-[9px] text-gray-500 uppercase">NPS</div>
                <div className="w-14 text-right text-[9px] text-gray-500 uppercase">Expand</div>
              </div>

              {/* Customer list */}
              <div className="flex-1 overflow-y-auto">
                {sortedAccounts.map((account, i) => (
                  <CustomerRow key={account.id} account={account} index={i} />
                ))}
              </div>

              {/* Summary */}
              <div className="mt-3 pt-3 border-t border-[#1a1a1a] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-[10px] text-gray-400">
                    {accounts.filter(a => a.status === "at-risk" || a.status === "churning").length} accounts need attention
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-lime-500" />
                  <span className="text-[10px] text-gray-400">
                    {formatSalesCurrency(accounts.filter(a => a.expansionPotential > 0).reduce((sum, a) => sum + a.expansionPotential, 0))} expansion potential
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 h-14 px-6 flex items-center justify-center gap-3" style={{ borderTop: "1px solid #1a1a1a" }}>
          {subBoards.map((sb, i) => (
            <SubBoardCard key={sb.id} subBoard={sb} index={i} onClick={() => handleSubBoardClick(sb.id)} />
          ))}
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
