"use client";

import { motion } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Users, Heart, AlertTriangle, UserPlus, TrendingUp, TrendingDown, Move, Lock, Unlock, User } from "lucide-react";
import { HRSubBoardCard } from "./HRSubBoardCard";
import { EngagementBar } from "./EngagementBar";
import type { HRDashboardData, Employee } from "@/lib/mock-data/hr-dashboard";
import { useOverlayStore } from "@/lib/stores";
import { getPersonDetailById } from "@/lib/mock-data/person-detail";

interface Position {
  x: number;
  y: number;
}

interface RadialViewProps {
  data: HRDashboardData;
  onSubBoardClick?: (boardId: string) => void;
  className?: string;
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
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center z-10">
          <Move className="w-2.5 h-2.5 text-white" />
        </div>
      )}
      {children}
    </div>
  );
}

// Leader Card Component
function LeaderCard({
  employee,
  isEditMode,
  onClick,
}: {
  employee: Employee;
  isEditMode: boolean;
  onClick?: () => void;
}) {
  const getEngagementColor = (engagement?: number) => {
    if (!engagement) return "#6b7280";
    if (engagement >= 90) return "#22c55e";
    if (engagement >= 80) return "#84cc16";
    if (engagement >= 70) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div
      className={cn(
        "w-[90px] rounded-xl p-2 text-center transition-all",
        isEditMode && "ring-1 ring-emerald-500/30",
        !isEditMode && "cursor-pointer hover:ring-1 hover:ring-emerald-500/50 hover:scale-105"
      )}
      style={{
        background: "#0a0a0a",
        border: "1px solid #1a1a1a",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
      }}
      onClick={!isEditMode ? onClick : undefined}
    >
      {/* Avatar */}
      <div
        className="mx-auto rounded-full flex items-center justify-center mb-1.5"
        style={{
          width: 36,
          height: 36,
          background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
          border: "2px solid #10b981",
        }}
      >
        {employee.avatar ? (
          <img src={employee.avatar} alt={employee.name} className="w-full h-full rounded-full object-cover" />
        ) : (
          <User className="w-4 h-4 text-emerald-400" />
        )}
      </div>

      {/* Name */}
      <div className="text-[10px] font-semibold text-white leading-tight truncate">
        {employee.name.split(' ')[0]}
      </div>

      {/* Title */}
      <div className="text-[8px] text-gray-500 leading-tight truncate mb-1">
        {employee.title.replace('VP ', '')}
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-center gap-2">
        {/* Team size */}
        <div className="flex items-center gap-0.5">
          <Users className="h-2.5 w-2.5 text-gray-500" />
          <span className="text-[8px] text-gray-400">{employee.teamSize}</span>
        </div>

        {/* Engagement */}
        {employee.engagement && (
          <span
            className="text-[8px] font-medium"
            style={{ color: getEngagementColor(employee.engagement) }}
          >
            {employee.engagement}%
          </span>
        )}
      </div>
    </div>
  );
}

export function RadialView({
  data,
  onSubBoardClick,
  className,
}: RadialViewProps) {
  const { entity, data: dashboardData } = data;
  const { title, period, kpis, orgChart, departmentStats, subBoards } = dashboardData;

  const [isEditMode, setIsEditMode] = useState(false);
  const centerRef = useRef<HTMLDivElement>(null);
  const { openPersonDetail } = useOverlayStore();

  // Handle clicking on a person to open their detail overlay
  const handlePersonClick = useCallback((employeeId: string) => {
    const personDetail = getPersonDetailById(employeeId);
    if (personDetail) {
      openPersonDetail(personDetail);
    }
  }, [openPersonDetail]);

  // Container dimensions
  const containerWidth = 960;
  const containerHeight = 540;

  // Get specific KPIs
  const headcountKPI = kpis.find(k => k.id === "headcount");
  const engagementKPI = kpis.find(k => k.id === "engagement");
  const turnoverKPI = kpis.find(k => k.id === "turnover");
  const openRolesKPI = kpis.find(k => k.id === "open_roles");
  const flightRiskKPI = kpis.find(k => k.id === "flight_risk");
  const enpsKPI = kpis.find(k => k.id === "enps");

  // Center of the radial zone
  const centerX = 260;
  const centerY = 200;
  const radius = 140;

  // Calculate initial positions for leaders
  const getInitialPositions = () => {
    const angles = [-90, -30, 30, 90, 150, -150]; // 6 positions around
    const positions: Record<string, Position> = {
      ceo: { x: centerX, y: centerY },
    };
    orgChart.leaders.forEach((leader, i) => {
      const rad = (angles[i] * Math.PI) / 180;
      positions[leader.id] = {
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

        {/* Left Panel - Key Metrics */}
        <div className="w-[220px] p-4 flex flex-col gap-3" style={{ borderRight: "1px solid #1a1a1a" }}>

          {/* Headcount */}
          <motion.div
            className="rounded-xl p-4"
            style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-[11px] font-medium text-gray-400 uppercase">Headcount</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {headcountKPI?.value || 0}
            </div>
            <span className="text-xs font-medium text-green-500">
              +{headcountKPI?.change || 0} {headcountKPI?.changeLabel || 'YTD'}
            </span>
          </motion.div>

          {/* Engagement */}
          <motion.div
            className="rounded-xl p-4"
            style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-lime-500" />
              <span className="text-[11px] font-medium text-gray-400 uppercase">Engagement</span>
            </div>
            <div className="text-2xl font-bold text-white mb-2">
              {engagementKPI ? `${(engagementKPI.value * 100).toFixed(0)}%` : '0%'}
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#1a1a1a" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #84cc16 0%, #65a30d 100%)" }}
                initial={{ width: 0 }}
                animate={{ width: `${(engagementKPI?.value || 0) * 100}%` }}
                transition={{ delay: 0.4, duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Open Roles */}
          <motion.div
            className="rounded-xl p-4"
            style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <UserPlus className="h-4 w-4 text-amber-500" />
              <span className="text-[11px] font-medium text-gray-400 uppercase">Open Roles</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {openRolesKPI?.value || 0}
            </div>
            <span className="text-xs font-medium text-amber-500">
              {openRolesKPI?.change || 0} {openRolesKPI?.changeLabel || 'urgent'}
            </span>
          </motion.div>
        </div>

        {/* Center - Org Chart Radial */}
        <div ref={centerRef} className="flex-1 relative overflow-visible" style={{ background: isEditMode ? "rgba(16, 185, 129, 0.02)" : "transparent" }}>
          {/* Edit mode toggle */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={cn(
              "absolute top-2 right-2 z-30 flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium transition-all",
              isEditMode
                ? "bg-emerald-500 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            )}
          >
            {isEditMode ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            {isEditMode ? "Editing" : "Edit"}
          </button>

          {/* SVG rings and connecting lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
            {/* Grid lines for edit mode */}
            {isEditMode && (
              <g opacity="0.1">
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#10b981" strokeWidth="1" />
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#10b981" strokeWidth="1" />
              </g>
            )}

            {/* Connecting lines from CEO to leaders */}
            {orgChart.leaders.map((leader) => {
              const leaderPos = positions[leader.id];
              const ceoPos = positions.ceo;
              if (!leaderPos || !ceoPos) return null;

              return (
                <motion.line
                  key={`line-${leader.id}`}
                  x1={ceoPos.x}
                  y1={ceoPos.y}
                  x2={leaderPos.x}
                  y2={leaderPos.y}
                  stroke="#1a1a1a"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                />
              );
            })}

            {/* Outer ring */}
            <circle
              cx={positions.ceo?.x || centerX}
              cy={positions.ceo?.y || centerY}
              r={radius}
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
          </svg>

          {/* CEO in center */}
          <DraggableItem
            id="ceo"
            position={positions.ceo || { x: centerX, y: centerY }}
            onDrag={handleDrag}
            isEditMode={isEditMode}
          >
            <div
              className={cn(
                "relative rounded-full flex flex-col items-center justify-center",
                isEditMode && "ring-2 ring-emerald-500/30",
                !isEditMode && "cursor-pointer hover:ring-2 hover:ring-emerald-400/50"
              )}
              style={{
                width: 100,
                height: 100,
                background: "linear-gradient(135deg, #111111 0%, #0a0a0a 100%)",
                border: "3px solid #10b981",
                boxShadow: "0 0 40px rgba(16, 185, 129, 0.2)",
              }}
              onClick={!isEditMode ? () => handlePersonClick(orgChart.ceo.id) : undefined}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)",
                }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* CEO Avatar */}
              <div
                className="rounded-full flex items-center justify-center mb-1"
                style={{
                  width: 40,
                  height: 40,
                  background: "#0d0d0d",
                  border: "2px solid #10b981",
                }}
              >
                <User className="w-5 h-5 text-emerald-400" />
              </div>

              {/* Name */}
              <span className="text-[10px] font-semibold text-white">{orgChart.ceo.name.split(' ')[0]}</span>
              <span className="text-[8px] text-gray-500">{orgChart.ceo.title}</span>
            </div>
          </DraggableItem>

          {/* Leaders orbiting */}
          {orgChart.leaders.map((leader) => {
            const pos = positions[leader.id];
            if (!pos) return null;

            return (
              <DraggableItem
                key={leader.id}
                id={leader.id}
                position={pos}
                onDrag={handleDrag}
                isEditMode={isEditMode}
              >
                <LeaderCard
                  employee={leader}
                  isEditMode={isEditMode}
                  onClick={() => handlePersonClick(leader.id)}
                />
              </DraggableItem>
            );
          })}
        </div>

        {/* Right Panel */}
        <div className="w-[220px] p-4 flex flex-col gap-3" style={{ borderLeft: "1px solid #1a1a1a" }}>

          {/* Flight Risk */}
          <motion.div
            className="rounded-xl p-4"
            style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              <span className="text-[11px] font-medium text-gray-400 uppercase">Flight Risk</span>
            </div>
            <div className="text-2xl font-bold text-rose-500 mb-1">
              {flightRiskKPI?.value || 0}
            </div>
            <span className="text-xs text-rose-400">employees at risk</span>
          </motion.div>

          {/* Turnover */}
          <motion.div
            className="rounded-xl p-4"
            style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-green-500" />
              <span className="text-[11px] font-medium text-gray-400 uppercase">Turnover</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {turnoverKPI ? `${(turnoverKPI.value * 100).toFixed(1)}%` : '0%'}
            </div>
            {turnoverKPI?.change && (
              <span className="text-xs font-medium text-green-500">
                {turnoverKPI.change < 0 ? '' : '+'}{(turnoverKPI.change * 100).toFixed(1)}%
              </span>
            )}
          </motion.div>

          {/* Department Engagement */}
          <motion.div
            className="flex-1 rounded-xl p-4"
            style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-[11px] font-medium text-gray-400 uppercase block mb-3">
              Engagement by Dept
            </span>
            <div className="flex flex-col gap-2">
              {departmentStats.slice(0, 4).map((dept, index) => (
                <EngagementBar key={dept.name} department={dept} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer - Sub-boards */}
      <div
        className="absolute bottom-0 left-0 right-0 h-14 px-6 flex items-center justify-center gap-3"
        style={{ borderTop: "1px solid #1a1a1a" }}
      >
        {subBoards.map((subBoard, index) => (
          <HRSubBoardCard
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
