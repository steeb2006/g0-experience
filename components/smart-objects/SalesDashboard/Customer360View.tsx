"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Briefcase,
  Users,
  Clock,
  Lightbulb,
  Gamepad2,
  Heart,
  TrendingUp,
  Maximize2,
  X,
  ChevronLeft,
  Radar,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigationStore } from "@/lib/stores";
import { useCustomer360Store } from "@/lib/stores/customer360";
import { organization, findBoardById } from "@/lib/mock-data/organization";
import { formatCustomerARR, type PeerConnection } from "@/lib/mock-data/customer-360";

// Orbital node positions (6 nodes around center)
const orbitalPositions = [
  { angle: -60, label: "Industry" },   // Top right
  { angle: 0, label: "Company" },      // Right
  { angle: 60, label: "Last Touch" },  // Bottom right
  { angle: 120, label: "Network" },    // Bottom left
  { angle: 180, label: "Fun Facts" },  // Left
  { angle: 240, label: "Hobbies" },    // Top left
];

// Get icon for orbital node
function getOrbitalIcon(label: string) {
  const iconMap: Record<string, React.ElementType> = {
    Industry: Briefcase,
    Company: Building2,
    "Last Touch": Clock,
    Network: Users,
    "Fun Facts": Lightbulb,
    Hobbies: Gamepad2,
  };
  return iconMap[label] || Briefcase;
}

// Get color for orbital node
function getOrbitalColor(label: string): string {
  const colorMap: Record<string, string> = {
    Industry: "#3b82f6",     // blue
    Company: "#06b6d4",      // cyan
    "Last Touch": "#f59e0b", // amber
    Network: "#8b5cf6",      // violet
    "Fun Facts": "#ec4899",  // pink
    Hobbies: "#22c55e",      // green
  };
  return colorMap[label] || "#6b7280";
}

// Orbital node component
function OrbitalNode({
  label,
  value,
  subValue,
  angle,
  radius,
  index,
}: {
  label: string;
  value: string;
  subValue?: string;
  angle: number;
  radius: number;
  index: number;
}) {
  const Icon = getOrbitalIcon(label);
  const color = getOrbitalColor(label);

  // Convert angle to position
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  return (
    <motion.div
      className="absolute flex flex-col items-center"
      style={{
        left: `calc(50% + ${x}px - 55px)`,
        top: `calc(50% + ${y}px - 35px)`,
        width: 110,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ delay: 0.2 + index * 0.08, duration: 0.3 }}
    >
      {/* Card */}
      <motion.div
        className="rounded-xl p-2.5 text-center w-full"
        style={{
          background: "#0a0a0a",
          border: `1px solid ${color}30`,
          boxShadow: `0 0 20px ${color}15`,
        }}
        whileHover={{ scale: 1.05, borderColor: `${color}60` }}
      >
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Icon className="h-3 w-3" style={{ color }} />
          <span className="text-[9px] text-gray-500 uppercase font-medium">{label}</span>
        </div>
        <div className="text-[11px] font-semibold text-white leading-tight">{value}</div>
        {subValue && (
          <div className="text-[9px] text-gray-500 mt-0.5">{subValue}</div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Connection line from center to orbital
function ConnectionLine({ angle, radius }: { angle: number; radius: number }) {
  const x = Math.cos((angle * Math.PI) / 180) * (radius - 60);
  const y = Math.sin((angle * Math.PI) / 180) * (radius - 60);

  return (
    <motion.line
      x1="50%"
      y1="50%"
      x2={`calc(50% + ${x}px)`}
      y2={`calc(50% + ${y}px)`}
      stroke="#2a2a2a"
      strokeWidth="1"
      strokeDasharray="4 4"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
}

// Peer connection card
function PeerCard({ peer, index }: { peer: PeerConnection; index: number }) {
  return (
    <motion.div
      className="flex-shrink-0 rounded-xl p-3 w-[140px]"
      style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.1 }}
      whileHover={{ borderColor: "#8b5cf6", scale: 1.02 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-600/30 flex items-center justify-center">
          <User className="h-4 w-4 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-medium text-white truncate">{peer.name}</div>
          <div className="text-[9px] text-gray-500 truncate">{peer.title}</div>
        </div>
      </div>
      <div className="text-[9px] text-cyan-400 mb-1">{peer.company}</div>
      <div className="text-[8px] text-gray-600 italic">{peer.relationship}</div>
    </motion.div>
  );
}

// Center profile
function CenterProfile({
  name,
  title,
  arr,
  healthScore,
}: {
  name: string;
  title: string;
  arr: number;
  healthScore: number;
}) {
  // Health score color
  const healthColor =
    healthScore >= 80 ? "#22c55e" : healthScore >= 60 ? "#84cc16" : healthScore >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Avatar ring with health indicator */}
      <div className="relative">
        {/* Health score ring */}
        <svg className="absolute -inset-2 w-[104px] h-[104px]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="#1a1a1a" strokeWidth="4" />
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={healthColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${(healthScore / 100) * 289} 289`}
            transform="rotate(-90 50 50)"
            initial={{ strokeDasharray: "0 289" }}
            animate={{ strokeDasharray: `${(healthScore / 100) * 289} 289` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </svg>

        {/* Avatar */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)",
          }}
        >
          <span className="text-2xl font-bold text-white">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>

        {/* Health score badge */}
        <motion.div
          className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
          style={{ background: healthColor, color: "#000" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          {healthScore}
        </motion.div>
      </div>

      {/* Name & Title */}
      <motion.div
        className="mt-3 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-[15px] font-bold text-white">{name}</div>
        <div className="text-[11px] text-gray-400">{title}</div>
      </motion.div>

      {/* ARR Badge */}
      <motion.div
        className="mt-2 px-3 py-1 rounded-full"
        style={{ background: "#0a0a0a", border: "1px solid #22c55e40" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-[12px] font-semibold text-lime-400">{formatCustomerARR(arr)}</span>
        <span className="text-[9px] text-gray-500 ml-1">ARR</span>
      </motion.div>
    </motion.div>
  );
}

export function Customer360View({ className }: { className?: string }) {
  const router = useRouter();
  const { addToBreadcrumb, currentBoardId, currentWorkspaceId } = useNavigationStore();
  const { activeCustomer, isTransitioning } = useCustomer360Store();
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle back navigation
  const handleBackClick = () => {
    const parentBoard = findBoardById("board_customers");
    if (parentBoard) {
      router.push(`/${organization.slug}/${currentWorkspaceId}/board_customers`);
    }
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPresentationMode) {
        setIsPresentationMode(false);
      }
    },
    [isPresentationMode]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const containerWidth = 960;
  const containerHeight = 540;
  const orbitalRadius = 160;

  // Prepare orbital data from active customer
  const getOrbitalValue = (label: string): { value: string; subValue?: string } => {
    switch (label) {
      case "Industry":
        return { value: activeCustomer.industry };
      case "Company":
        return { value: activeCustomer.company };
      case "Last Touch":
        return { value: activeCustomer.lastTouch };
      case "Network":
        return { value: `${activeCustomer.networkSize} peers`, subValue: "connections" };
      case "Fun Facts":
        return { value: activeCustomer.funFacts[0]?.split(" ").slice(0, 3).join(" ") + "..." };
      case "Hobbies":
        return { value: activeCustomer.hobbies.slice(0, 2).join(", ") };
      default:
        return { value: "-" };
    }
  };

  const presentationOverlay =
    isPresentationMode && mounted
      ? createPortal(
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
              Press{" "}
              <kbd className="px-2 py-1 bg-[var(--g0-bg-elevated-2)] rounded border border-[var(--g0-bg-elevated-3)]">
                Esc
              </kbd>{" "}
              to exit
            </div>
            <div className="transform scale-[1.3]">
              <DashboardContent />
            </div>
          </motion.div>,
          document.body
        )
      : null;

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
        <div
          className="absolute top-0 left-0 right-0 h-12 px-5 flex items-center justify-between z-20"
          style={{ borderBottom: "1px solid #1a1a1a" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackClick}
              className="p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-gray-400" />
            </button>
            <div className="flex items-center gap-2">
              <Radar className="h-4 w-4 text-violet-500" />
              <h1 className="text-sm font-semibold text-white">360View</h1>
            </div>
            <span className="text-xs text-gray-500 px-2 py-1 rounded" style={{ background: "#111111" }}>
              {activeCustomer.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPresentationMode(true)}
              className="p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors"
            >
              <Maximize2 className="h-4 w-4 text-gray-400" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-xs text-gray-500">Live</span>
            </div>
          </div>
        </div>

        {/* Main radial view */}
        <div className="absolute top-12 bottom-24 left-0 right-0">
          {/* Connection lines SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {orbitalPositions.map((pos, i) => (
              <ConnectionLine key={i} angle={pos.angle} radius={orbitalRadius} />
            ))}
          </svg>

          {/* Center profile */}
          <AnimatePresence mode="wait">
            {!isTransitioning && (
              <CenterProfile
                key={activeCustomer.id}
                name={activeCustomer.name}
                title={activeCustomer.title}
                arr={activeCustomer.arr}
                healthScore={activeCustomer.healthScore}
              />
            )}
          </AnimatePresence>

          {/* Orbital nodes */}
          <AnimatePresence mode="wait">
            {!isTransitioning &&
              orbitalPositions.map((pos, i) => {
                const { value, subValue } = getOrbitalValue(pos.label);
                return (
                  <OrbitalNode
                    key={`${activeCustomer.id}-${pos.label}`}
                    label={pos.label}
                    value={value}
                    subValue={subValue}
                    angle={pos.angle}
                    radius={orbitalRadius}
                    index={i}
                  />
                );
              })}
          </AnimatePresence>
        </div>

        {/* Network Connections Row */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 px-5 flex flex-col justify-center"
          style={{ borderTop: "1px solid #1a1a1a", background: "#050505" }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-violet-500" />
              <span className="text-[10px] font-medium text-gray-400 uppercase">Network Connections</span>
            </div>
            <span className="text-[10px] text-gray-600">
              {activeCustomer.peerConnections.length} of {activeCustomer.networkSize} shown
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            <AnimatePresence mode="wait">
              {!isTransitioning &&
                activeCustomer.peerConnections.map((peer, i) => (
                  <PeerCard key={`${activeCustomer.id}-${peer.id}`} peer={peer} index={i} />
                ))}
            </AnimatePresence>
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
