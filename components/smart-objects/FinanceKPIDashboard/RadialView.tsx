"use client";

import { motion } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign, Wallet, Users, Flame, BarChart3, PieChart, Banknote, Activity, Repeat, Calculator, Move, Lock, Unlock } from "lucide-react";
import { EntityBadge } from "./EntityBadge";
import { SubBoardCard } from "./SubBoardCard";
import type { FinanceDashboardData } from "@/lib/mock-data/finance-dashboard";

interface Position {
  x: number;
  y: number;
}

interface RadialViewProps {
  data: FinanceDashboardData;
  onSubBoardClick?: (boardId: string) => void;
  className?: string;
}

// Format currency values
function formatValue(value: number, format: string): string {
  if (format === "currency") {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  }
  if (format === "percentage") {
    return `${(value * 100).toFixed(1)}%`;
  }
  return value.toString();
}

// Format change
function formatChange(change: number, isNumber: boolean = false): string {
  if (isNumber) {
    return `${change >= 0 ? "+" : ""}${change}`;
  }
  const sign = change >= 0 ? "+" : "";
  return `${sign}${(change * 100).toFixed(1)}%`;
}

// Draggable component
function DraggableItem({
  id,
  position,
  onDrag,
  isEditMode,
  children
}: {
  id: string;
  position: Position;
  onDrag: (id: string, pos: Position) => void;
  isEditMode: boolean;
  children: React.ReactNode;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      startX: position.x,
      startY: position.y,
    };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    onDrag(id, {
      x: dragStart.current.startX + dx,
      y: dragStart.current.startY + dy,
    });
  }, [isDragging, id, onDrag]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  // Attach global mouse events when dragging
  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: MouseEvent) => handleMouseMove(e);
    const onUp = () => handleMouseUp();

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={cn(
        "absolute",
        isEditMode && "cursor-move",
        isDragging && "z-50"
      )}
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
      }}
      onMouseDown={handleMouseDown}
    >
      {isEditMode && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center z-10">
          <Move className="w-2.5 h-2.5 text-white" />
        </div>
      )}
      {children}
    </div>
  );
}

export function RadialView({
  data,
  onSubBoardClick,
  className,
}: RadialViewProps) {
  const { entity, data: dashboardData } = data;
  const { title, period, kpis, sparkline, subBoards } = dashboardData;

  const [isEditMode, setIsEditMode] = useState(false);
  const centerRef = useRef<HTMLDivElement>(null);

  // Container dimensions
  const containerWidth = 960;
  const containerHeight = 540;

  // Get specific KPIs
  const revenueKPI = kpis.find(k => k.id === "revenue");
  const costsKPI = kpis.find(k => k.id === "costs");
  const marginKPI = kpis.find(k => k.id === "margin");
  const cashKPI = kpis.find(k => k.id === "cash");
  const burnKPI = kpis.find(k => k.id === "burn");
  const headcountKPI = kpis.find(k => k.id === "headcount");
  const ebitdaKPI = kpis.find(k => k.id === "ebitda");
  const opexKPI = kpis.find(k => k.id === "opex");
  const arrKPI = kpis.find(k => k.id === "arr");
  const nrrKPI = kpis.find(k => k.id === "nrr");

  // Initial positions - center of the area
  const centerX = 260;
  const centerY = 200;
  const radius = 130;

  // Calculate initial KPI positions
  const getInitialPositions = () => {
    const angles = [-90, -30, 30, 90, 150, -150];
    const kpiIds = ['arr', 'cash', 'ebitda', 'burn', 'headcount', 'nrr'];
    const positions: Record<string, Position> = {
      entity: { x: centerX, y: centerY },
    };
    kpiIds.forEach((id, i) => {
      const rad = (angles[i] * Math.PI) / 180;
      positions[id] = {
        x: centerX + Math.cos(rad) * radius,
        y: centerY + Math.sin(rad) * radius,
      };
    });
    return positions;
  };

  const [positions, setPositions] = useState<Record<string, Position>>(getInitialPositions);

  const handleDrag = useCallback((id: string, pos: Position) => {
    setPositions(prev => ({ ...prev, [id]: pos }));
  }, []);

  // Cash flow data
  const cashFlowData = [
    { month: "Oct", value: 3800000 },
    { month: "Nov", value: 4000000 },
    { month: "Dec", value: 4100000 },
    { month: "Jan", value: 4200000 },
  ];

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
          <h1 className="text-base font-semibold text-white">{title}</h1>
          <span className="text-xs text-gray-500 px-2 py-1 rounded" style={{ background: "#111111" }}>{period}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>

      {/* Main 3-column layout */}
      <div className="absolute top-14 bottom-14 left-0 right-0 flex">

        {/* Left Panel */}
        <div className="w-[220px] p-4 flex flex-col gap-3" style={{ borderRight: "1px solid #1a1a1a" }}>

          {/* Revenue Trend - Premium Chart */}
          <motion.div
            className="flex-1 rounded-xl p-4"
            style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Revenue</span>
              <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
            </div>
            {/* Bar Chart */}
            <div className="flex items-end gap-2 h-16 mb-2">
              {sparkline?.data.slice(-4).map((point, i) => {
                const maxVal = Math.max(...sparkline.data.map(d => d.value));
                const height = (point.value / maxVal) * 100;
                return (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${height}%`,
                      background: `linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)`,
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between">
              {sparkline?.data.slice(-4).map((point, i) => (
                <span key={i} className="text-[9px] text-gray-600">{point.month}</span>
              ))}
            </div>
          </motion.div>

          {/* Revenue KPI */}
          {revenueKPI && (
            <motion.div
              className="rounded-xl p-4"
              style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                <span className="text-[11px] font-medium text-gray-400 uppercase">Revenue</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {formatValue(revenueKPI.value, revenueKPI.format)}
              </div>
              <span className="text-xs font-medium text-green-500">
                {formatChange(revenueKPI.change || 0)} <span className="text-gray-500">YoY</span>
              </span>
            </motion.div>
          )}

          {/* Margin KPI */}
          {marginKPI && (
            <motion.div
              className="rounded-xl p-4"
              style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-green-500" />
                <span className="text-[11px] font-medium text-gray-400 uppercase">Margin</span>
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                {formatValue(marginKPI.value, marginKPI.format)}
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#1a1a1a" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${marginKPI.value * 100}%` }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Center - Radial Zone */}
        <div ref={centerRef} className="flex-1 relative overflow-visible" style={{ background: isEditMode ? "rgba(59, 130, 246, 0.02)" : "transparent" }}>
          {/* Edit mode toggle */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={cn(
              "absolute top-2 right-2 z-30 flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium transition-all",
              isEditMode
                ? "bg-blue-500 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            )}
          >
            {isEditMode ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            {isEditMode ? "Editing" : "Edit"}
          </button>

          {/* SVG rings - more visible */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
            {/* Grid lines for edit mode */}
            {isEditMode && (
              <g opacity="0.1">
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#3b82f6" strokeWidth="1" />
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#3b82f6" strokeWidth="1" />
              </g>
            )}
            {/* Inner ring */}
            <circle
              cx={positions.entity.x}
              cy={positions.entity.y}
              r="65"
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="1.5"
            />
            {/* Outer ring */}
            <circle
              cx={positions.entity.x}
              cy={positions.entity.y}
              r={radius}
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
          </svg>

          {/* Entity Badge - draggable */}
          <DraggableItem
            id="entity"
            position={positions.entity}
            onDrag={handleDrag}
            isEditMode={isEditMode}
          >
            <EntityBadge
              name={entity.name}
              avatar={entity.avatar}
              isActive={true}
              size="lg"
            />
          </DraggableItem>

          {/* 6 Orbital KPIs - draggable */}
          {[
            { kpi: arrKPI, id: "arr", icon: Repeat, label: "ARR", color: "text-blue-400" },
            { kpi: cashKPI, id: "cash", icon: Wallet, label: "Cash", color: "text-cyan-400" },
            { kpi: ebitdaKPI, id: "ebitda", icon: Calculator, label: "EBITDA", color: "text-green-400" },
            { kpi: burnKPI, id: "burn", icon: Flame, label: "Burn", color: "text-orange-400" },
            { kpi: headcountKPI, id: "headcount", icon: Users, label: "Team", color: "text-blue-400" },
            { kpi: nrrKPI, id: "nrr", icon: Activity, label: "NRR", color: "text-cyan-400" },
          ].map(({ kpi, id, icon: Icon, label, color }) => {
            if (!kpi || !positions[id]) return null;

            return (
              <DraggableItem
                key={id}
                id={id}
                position={positions[id]}
                onDrag={handleDrag}
                isEditMode={isEditMode}
              >
                <div
                  className={cn(
                    "w-[76px] rounded-lg p-1.5 text-center transition-all",
                    isEditMode && "ring-1 ring-blue-500/30"
                  )}
                  style={{
                    background: "#0a0a0a",
                    border: "1px solid #1a1a1a",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
                  }}
                >
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Icon className={cn("h-3 w-3", color)} />
                    <span className="text-[8px] font-medium text-gray-500 uppercase">{label}</span>
                  </div>
                  <div className="text-[11px] font-bold text-white leading-tight">
                    {kpi.format === "number" ? kpi.value : formatValue(kpi.value, kpi.format)}
                  </div>
                  {kpi.change !== undefined && (
                    <span className={cn("text-[8px]", kpi.change >= 0 ? "text-green-500" : "text-red-500")}>
                      {kpi.format === "number"
                        ? `${formatChange(kpi.change, true)} ${kpi.changeLabel || ""}`
                        : formatChange(kpi.change)}
                    </span>
                  )}
                  {kpi.runway && (
                    <span className="text-[8px] text-cyan-500">{kpi.runway}mo</span>
                  )}
                </div>
              </DraggableItem>
            );
          })}
        </div>

        {/* Right Panel */}
        <div className="w-[220px] p-4 flex flex-col gap-3" style={{ borderLeft: "1px solid #1a1a1a" }}>

          {/* Cash Flow Chart */}
          <motion.div
            className="flex-1 rounded-xl p-4"
            style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Cash Flow</span>
              <Banknote className="h-3.5 w-3.5 text-cyan-500" />
            </div>
            <div className="flex items-end gap-2 h-16 mb-2">
              {cashFlowData.map((point, i) => {
                const minVal = Math.min(...cashFlowData.map(d => d.value));
                const maxVal = Math.max(...cashFlowData.map(d => d.value));
                const range = maxVal - minVal;
                const height = 40 + ((point.value - minVal) / range) * 60;
                return (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${height}%`,
                      background: `linear-gradient(180deg, #06b6d4 0%, #0891b2 100%)`,
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between">
              {cashFlowData.map((point, i) => (
                <span key={i} className="text-[9px] text-gray-600">{point.month}</span>
              ))}
            </div>
          </motion.div>

          {/* Cash Position */}
          {cashKPI && (
            <motion.div
              className="rounded-xl p-4"
              style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-4 w-4 text-cyan-500" />
                <span className="text-[11px] font-medium text-gray-400 uppercase">Cash Position</span>
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                {formatValue(cashKPI.value, cashKPI.format)}
              </div>
              {cashKPI.runway && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#1a1a1a" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #06b6d4 0%, #0891b2 100%)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((cashKPI.runway / 24) * 100, 100)}%` }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    />
                  </div>
                  <span className="text-xs font-medium text-cyan-500">{cashKPI.runway}mo</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Costs */}
          {costsKPI && (
            <motion.div
              className="rounded-xl p-4"
              style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-[11px] font-medium text-gray-400 uppercase">Costs</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {formatValue(costsKPI.value, costsKPI.format)}
              </div>
              <span className="text-xs font-medium text-red-500">
                {formatChange(costsKPI.change || 0)} <span className="text-gray-500">YoY</span>
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer - Sub-boards */}
      <div
        className="absolute bottom-0 left-0 right-0 h-14 px-6 flex items-center justify-center gap-3"
        style={{ borderTop: "1px solid #1a1a1a" }}
      >
        {subBoards.map((subBoard, index) => (
          <SubBoardCard
            key={subBoard.id}
            subBoard={subBoard}
            index={index}
            onClick={() => onSubBoardClick?.(subBoard.id)}
            compact
          />
        ))}
      </div>
    </motion.div>
  );
}
