"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  Rocket,
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  Users,
  Calendar,
  Play,
  BarChart3,
  CheckCircle,
  Clock,
  Circle,
  Maximize2,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigationStore } from "@/lib/stores";
import { organization, findBoardById } from "@/lib/mock-data/organization";
import {
  launchCampaignData,
  formatSalesCurrency,
  formatSalesPercentage,
  type CampaignPhase,
  type CampaignChannel,
  type CampaignMetric,
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
    Calendar: Calendar,
    Play: Play,
    BarChart3: BarChart3,
  };
  const Icon = iconMap[subBoard.icon] || Calendar;

  return (
    <motion.button
      onClick={onClick}
      className="group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
      style={{ background: "#111111", border: "1px solid #1a1a1a" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.05 }}
      whileHover={{ background: "#1a1a1a", borderColor: "#f97316", scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="h-4 w-4 text-orange-500" />
      <span className="text-[12px] font-medium text-gray-300 group-hover:text-white transition-colors">
        {subBoard.name}
      </span>
      <ChevronRight className="h-3 w-3 text-gray-600 group-hover:text-orange-500 transition-colors" />
    </motion.button>
  );
}

// Phase timeline item
function PhaseItem({ phase, index }: { phase: CampaignPhase; index: number }) {
  const statusConfig = {
    completed: { color: "#22c55e", icon: CheckCircle, bg: "rgba(34, 197, 94, 0.1)" },
    active: { color: "#f97316", icon: Clock, bg: "rgba(249, 115, 22, 0.1)" },
    upcoming: { color: "#6b7280", icon: Circle, bg: "rgba(107, 114, 128, 0.1)" },
  };
  const config = statusConfig[phase.status];
  const Icon = config.icon;

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: config.bg }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-white truncate">{phase.name}</span>
          <span className="text-[9px] text-gray-500 ml-2">{phase.progress}%</span>
        </div>
        <div className="h-1 rounded-full mt-1 overflow-hidden" style={{ background: "#1a1a1a" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: config.color }}
            initial={{ width: 0 }}
            animate={{ width: `${phase.progress}%` }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// Channel row
function ChannelRow({ channel, maxLeads, index }: { channel: CampaignChannel; maxLeads: number; index: number }) {
  const width = (channel.leads / maxLeads) * 100;

  return (
    <motion.div
      className="flex items-center gap-2 py-1.5"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <span className="w-24 text-[10px] text-gray-400 truncate">{channel.name}</span>
      <div className="flex-1 h-4 rounded overflow-hidden" style={{ background: "#1a1a1a" }}>
        <motion.div
          className="h-full rounded flex items-center justify-end pr-1"
          style={{ background: "linear-gradient(90deg, #f97316 0%, #ea580c 100%)" }}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
        >
          <span className="text-[8px] font-medium text-white">{channel.leads}</span>
        </motion.div>
      </div>
      <span className="w-10 text-right text-[9px] text-lime-400">{formatSalesPercentage(channel.conversion)}</span>
      <span className="w-10 text-right text-[9px] text-cyan-400">{channel.roi}x</span>
    </motion.div>
  );
}

// KPI Card
function KPICard({ metric, index }: { metric: CampaignMetric; index: number }) {
  const colorMap: Record<string, string> = {
    blue: "#3b82f6",
    lime: "#84cc16",
    amber: "#f59e0b",
    green: "#22c55e",
    cyan: "#06b6d4",
    violet: "#8b5cf6",
  };
  const color = colorMap[metric.color || "blue"];

  const formatValue = () => {
    switch (metric.format) {
      case "currency": return formatSalesCurrency(metric.value);
      case "percentage": return formatSalesPercentage(metric.value);
      default: return metric.value.toLocaleString();
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
            <TrendingUp className="w-3 h-3 text-green-500" />
          ) : metric.trend === "down" ? (
            <TrendingDown className="w-3 h-3 text-green-500" />
          ) : null}
          <span className="text-[9px] text-green-500">
            {metric.change > 0 ? "+" : ""}{metric.format === "percentage" ? `${(metric.change * 100).toFixed(0)}pts` : `${(metric.change * 100).toFixed(0)}%`}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export function LaunchCampaignDashboard({ className }: { className?: string }) {
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

  const { entity, data } = launchCampaignData;
  const { title, period, campaignName, launchDate, metrics, phases, channels, subBoards } = data;
  const maxLeads = Math.max(...channels.map(c => c.leads));

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
              <Rocket className="h-5 w-5 text-orange-500" />
              <h1 className="text-base font-semibold text-white">{title}</h1>
            </div>
            <span className="text-xs text-gray-500 px-2 py-1 rounded" style={{ background: "#111111" }}>{campaignName}</span>
            <span className="text-xs text-orange-500">{period}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsPresentationMode(true)} className="p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors">
              <Maximize2 className="h-4 w-4 text-gray-400" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-xs text-gray-500">Live</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="absolute top-14 bottom-14 left-0 right-0 flex">
          {/* Left Panel - KPIs & Phases */}
          <div className="w-[280px] p-4 flex flex-col gap-3" style={{ borderRight: "1px solid #1a1a1a" }}>
            {/* KPIs 2x3 grid */}
            <div className="grid grid-cols-2 gap-2">
              {metrics.map((m, i) => (
                <KPICard key={m.id} metric={m} index={i} />
              ))}
            </div>

            {/* Campaign Timeline */}
            <motion.div
              className="flex-1 rounded-xl p-4"
              style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-gray-400 uppercase">Campaign Phases</span>
                <span className="text-[10px] text-orange-500">Launch: {launchDate}</span>
              </div>
              <div className="space-y-3">
                {phases.map((phase, i) => (
                  <PhaseItem key={phase.id} phase={phase} index={i} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Channels */}
          <div className="flex-1 p-4">
            <motion.div
              className="h-full rounded-xl p-4"
              style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-medium text-gray-400 uppercase">Channel Performance</span>
                <div className="flex items-center gap-4 text-[9px] text-gray-500">
                  <span>Leads</span>
                  <span>Conv%</span>
                  <span>ROI</span>
                </div>
              </div>
              <div className="space-y-1">
                {channels.map((channel, i) => (
                  <ChannelRow key={channel.id} channel={channel} maxLeads={maxLeads} index={i} />
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 pt-4 border-t border-[#1a1a1a] grid grid-cols-3 gap-4">
                <div>
                  <span className="text-[9px] text-gray-500 block">Total Leads</span>
                  <span className="text-lg font-bold text-blue-400">{channels.reduce((sum, c) => sum + c.leads, 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 block">Avg Conversion</span>
                  <span className="text-lg font-bold text-lime-400">{formatSalesPercentage(channels.reduce((sum, c) => sum + c.conversion, 0) / channels.length)}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 block">Total Spend</span>
                  <span className="text-lg font-bold text-amber-400">{formatSalesCurrency(channels.reduce((sum, c) => sum + c.spend, 0))}</span>
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
