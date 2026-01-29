"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  Users,
  ThumbsUp,
  TrendingUp,
  Building2,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Text, Icon, Badge } from "../atomics";
import { RadialLayout } from "../shared";

// ============================================================================
// Types
// ============================================================================

interface KPIData {
  id: string;
  label: string;
  value: string;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface LeaderData {
  name: string;
  role: string;
  avatar: string;
  status: "active" | "busy" | "offline";
}

interface RadialViewProps {
  className?: string;
}

// ============================================================================
// Data
// ============================================================================

const kpis: KPIData[] = [
  { id: "revenue", label: "Revenue", value: "$12.4M", change: 12.5, icon: DollarSign, color: "var(--g0-accent-violet)" },
  { id: "customers", label: "Customers", value: "2,847", change: 8.2, icon: Users, color: "var(--g0-accent-amber)" },
  { id: "nps", label: "NPS", value: "72", change: 5, icon: ThumbsUp, color: "#22c55e" },
  { id: "marketcap", label: "Market Cap", value: "$2.8B", change: 15.8, icon: TrendingUp, color: "#3b82f6" },
  { id: "employees", label: "Employees", value: "456", change: -2.1, icon: Building2, color: "var(--g0-accent-rose)" },
];

const leaders: LeaderData[] = [
  { name: "Sarah Chen", role: "CFO", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face", status: "active" },
  { name: "Marcus Williams", role: "CTO", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face", status: "active" },
  { name: "Elena Rodriguez", role: "COO", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face", status: "busy" },
  { name: "James Park", role: "CSO", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face", status: "active" },
];

const ceo = {
  name: "Alex Thompson",
  avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
};

const statusColors = {
  active: "var(--g0-status-success)",
  busy: "var(--g0-status-warning)",
  offline: "var(--g0-text-muted)",
};

// ============================================================================
// Component
// ============================================================================

/**
 * RadialView - Executive Overview for CEO Dashboard
 *
 * Uses RadialLayout for proper positioning that always works:
 * - 50% horizontal centering with pixel offsets
 * - Edit mode for fine-tuning
 * - Consistent math via RadialLayout.calculateOffsets()
 */
export function RadialView({ className }: RadialViewProps) {
  // Calculate KPI positions using RadialLayout utility
  const kpiOffsets = RadialLayout.calculateOffsets({
    count: kpis.length,
    radius: 110,
    startAngle: -90, // Start from top
  });

  return (
    <div className={cn("relative w-full h-full", className)}>
      {/* Header */}
      <div
        className="absolute top-0 left-0 right-0 h-14 px-6 flex items-center justify-between z-10"
        style={{ borderBottom: "1px solid #1a1a1a" }}
      >
        <div className="flex items-center gap-4">
          <h1 className="text-base font-semibold text-white">Executive Overview</h1>
          <Badge variant="info">Q4 2025</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-500">All Systems Operational</span>
        </div>
      </div>

      {/* Main 3-column layout */}
      <div className="absolute top-14 bottom-14 left-0 right-0 flex">
        {/* Left Sidebar */}
        <div className="w-[220px] p-4 flex flex-col gap-3" style={{ borderRight: "1px solid #1a1a1a" }}>
          <SidebarCard
            icon={<Target className="h-4 w-4 text-[var(--g0-accent-violet)]" />}
            label="Company Health"
            value="87%"
            subtext="OKR Achievement"
            progress={87}
            delay={0.1}
          />
          <SidebarCard
            icon={<TrendingUp className="h-4 w-4 text-green-500" />}
            label="YoY Growth"
            value="+23%"
            valueColor="text-green-500"
            subtext="vs. previous year"
            delay={0.2}
          />
          <SidebarCard
            icon={<Icon name="Globe" size={16} color="var(--g0-accent-amber)" />}
            label="Markets"
            value="42"
            subtext="countries active"
            delay={0.3}
          />
        </div>

        {/* Center - Radial Zone (using RadialLayout) */}
        <RadialLayout.Root centerY={206} showEditToggle>
          {/* Background ring */}
          <RadialLayout.Ring radius={110} />

          {/* CEO Center Node */}
          <RadialLayout.Center id="ceo">
            <div className="flex flex-col items-center">
              <div
                className="relative rounded-full p-1"
                style={{
                  background: "linear-gradient(135deg, var(--g0-accent-violet) 0%, var(--g0-accent-rose) 100%)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${ceo.avatar})` }}
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[var(--g0-status-success)] flex items-center justify-center border-2 border-[#0a0a0a]">
                  <Icon name="Check" size={10} color="white" />
                </div>
              </div>
              <Text variant="small" color="primary" className="mt-1 font-medium">
                {ceo.name}
              </Text>
              <Text variant="small" color="muted" className="text-[10px]">
                CEO
              </Text>
            </div>
          </RadialLayout.Center>

          {/* KPI Nodes */}
          {kpis.map((kpi, index) => {
            const offset = kpiOffsets[index];
            const KpiIcon = kpi.icon;
            return (
              <RadialLayout.Item
                key={kpi.id}
                id={kpi.id}
                offsetX={offset.x}
                offsetY={offset.y}
              >
                <KPINode kpi={kpi} Icon={KpiIcon} />
              </RadialLayout.Item>
            );
          })}
        </RadialLayout.Root>

        {/* Right Sidebar */}
        <div className="w-[220px] p-4 flex flex-col gap-3" style={{ borderLeft: "1px solid #1a1a1a" }}>
          <SidebarCard
            icon={<Icon name="Award" size={16} color="var(--g0-accent-amber)" />}
            label="Industry Rank"
            value="#3"
            valueColor="text-[var(--g0-accent-amber)]"
            subtext="Global Position"
            delay={0.1}
            animateFrom="right"
          />
          <InitiativesCard delay={0.2} />
          <HighlightCard delay={0.3} />
        </div>
      </div>

      {/* Footer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-14 px-6 flex items-center justify-center gap-6"
        style={{ borderTop: "1px solid #1a1a1a" }}
      >
        <div className="flex items-center gap-4">
          {leaders.map((leader, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full bg-cover bg-center border"
                style={{
                  backgroundImage: `url(${leader.avatar})`,
                  borderColor: statusColors[leader.status],
                }}
              />
              <span className="text-[10px] text-gray-400">{leader.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function KPINode({ kpi, Icon }: { kpi: KPIData; Icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div
      className="flex flex-col items-center p-2 rounded-lg w-[72px]"
      style={{
        background: "#0a0a0a",
        border: "1px solid #1a1a1a",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
      }}
    >
      <div
        className="w-6 h-6 rounded flex items-center justify-center mb-1"
        style={{ background: `${kpi.color}20`, color: kpi.color }}
      >
        <Icon className="w-3 h-3" />
      </div>
      <span className="text-[8px] text-gray-500 uppercase truncate w-full text-center">
        {kpi.label}
      </span>
      <span className="text-[11px] font-bold text-white">{kpi.value}</span>
      <span className={cn("text-[8px] font-medium", kpi.change >= 0 ? "text-green-500" : "text-red-500")}>
        {kpi.change >= 0 ? "+" : ""}{kpi.change}%
      </span>
    </div>
  );
}

interface SidebarCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor?: string;
  subtext: string;
  progress?: number;
  delay: number;
  animateFrom?: "left" | "right";
}

function SidebarCard({ icon, label, value, valueColor, subtext, progress, delay, animateFrom = "left" }: SidebarCardProps) {
  return (
    <motion.div
      className="rounded-xl p-4"
      style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
      initial={{ opacity: 0, x: animateFrom === "left" ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[11px] font-medium text-gray-400 uppercase">{label}</span>
      </div>
      <div className={cn("text-2xl font-bold text-white", valueColor)}>{value}</div>
      <div className="text-xs text-gray-500">{subtext}</div>
      {progress !== undefined && (
        <div className="h-1.5 rounded-full overflow-hidden mt-2" style={{ background: "#1a1a1a" }}>
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, var(--g0-accent-violet) 0%, var(--g0-accent-rose) 100%)",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: delay + 0.2, duration: 0.5 }}
          />
        </div>
      )}
    </motion.div>
  );
}

function InitiativesCard({ delay }: { delay: number }) {
  const initiatives = [
    { name: "Digital Transform", status: "on-track" },
    { name: "APAC Expansion", status: "at-risk" },
    { name: "Product 2.0", status: "on-track" },
    { name: "Cost Optimization", status: "delayed" },
  ];

  return (
    <motion.div
      className="flex-1 rounded-xl p-4"
      style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon name="Target" size={16} color="var(--g0-accent-violet)" />
        <span className="text-[11px] font-medium text-gray-400 uppercase">Initiatives</span>
      </div>
      <div className="space-y-2">
        {initiatives.map((init, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background:
                  init.status === "on-track"
                    ? "var(--g0-status-success)"
                    : init.status === "at-risk"
                      ? "var(--g0-status-warning)"
                      : "var(--g0-status-error)",
              }}
            />
            <span className="text-[10px] text-gray-300 truncate">{init.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function HighlightCard({ delay }: { delay: number }) {
  return (
    <motion.div
      className="rounded-xl p-4"
      style={{
        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)",
        border: "1px solid rgba(139, 92, 246, 0.3)",
      }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-center gap-2">
        <Icon name="Zap" size={16} color="var(--g0-accent-violet)" />
        <span className="text-[11px] font-medium text-white">Record Q4</span>
      </div>
      <div className="text-[10px] text-gray-400 mt-1">3 new markets launched</div>
    </motion.div>
  );
}
