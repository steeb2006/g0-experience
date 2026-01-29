"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  Users,
  ThumbsUp,
  TrendingUp,
  TrendingDown,
  Building2,
  Target,
  Check,
  Award,
  Globe,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Text,
  Frame,
  Rectangle,
  Circle,
  Icon,
  Badge,
  LineChart,
  DonutChart,
  BarChart,
  ProgressBar,
  Sparkline,
} from "../atomics";

interface GridViewProps {
  className?: string;
}

// KPI Card Component (compact for grid)
interface KPICardProps {
  title: string;
  value: string;
  change: number;
  sparklineData: number[];
  sparklineColor: string;
  icon: string;
}

function KPICard({
  title,
  value,
  change,
  sparklineData,
  sparklineColor,
  icon,
}: KPICardProps) {
  const isPositive = change >= 0;
  return (
    <div
      className="p-3 rounded-xl"
      style={{
        background: "var(--g0-bg-elevated-1)",
        border: "1px solid var(--g0-bg-elevated-3)",
      }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <Text variant="small" color="muted">
          {title}
        </Text>
        <Icon name={icon} size={14} color="var(--g0-text-muted)" />
      </div>
      <Text variant="h3" color="primary" className="mb-1">
        {value}
      </Text>
      <div className="flex items-center gap-1.5 mb-2">
        <Badge variant={isPositive ? "success" : "error"} size="sm">
          <span className="flex items-center gap-0.5">
            <Icon
              name={isPositive ? "TrendingUp" : "TrendingDown"}
              size={10}
            />
            {Math.abs(change)}%
          </span>
        </Badge>
      </div>
      <Sparkline
        data={sparklineData}
        width={140}
        height={20}
        color={sparklineColor}
      />
    </div>
  );
}

// Initiative Row Component
interface InitiativeRowProps {
  name: string;
  progress: number;
  status: "on-track" | "at-risk" | "delayed";
  owner: string;
}

function InitiativeRow({ name, progress, status, owner }: InitiativeRowProps) {
  const statusColors = {
    "on-track": "var(--g0-status-success)",
    "at-risk": "var(--g0-status-warning)",
    delayed: "var(--g0-status-error)",
  };

  return (
    <div className="flex items-center gap-2 py-1.5">
      <Circle radius={3} fill={statusColors[status]} />
      <Text
        variant="small"
        color="primary"
        className="flex-1 truncate text-[11px]"
      >
        {name}
      </Text>
      <div className="w-16 h-1 rounded-full bg-[var(--g0-bg-elevated-3)]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: statusColors[status],
          }}
        />
      </div>
      <Text variant="small" color="muted" className="text-[10px] w-8">
        {owner}
      </Text>
    </div>
  );
}

/**
 * GridView - Detailed CEO Dashboard
 *
 * Full detailed view with all charts, metrics, and data visualization.
 * Optimized to fit within 960x540 fixed dimensions.
 */
export function GridView({ className }: GridViewProps) {
  // Chart data
  const revenueData = [
    { x: "Jan", y: 4200 },
    { x: "Feb", y: 4800 },
    { x: "Mar", y: 4600 },
    { x: "Apr", y: 5200 },
    { x: "May", y: 5800 },
    { x: "Jun", y: 6100 },
    { x: "Jul", y: 5900 },
    { x: "Aug", y: 6400 },
    { x: "Sep", y: 7100 },
    { x: "Oct", y: 7800 },
    { x: "Nov", y: 8200 },
    { x: "Dec", y: 8900 },
  ];

  const segmentData = [
    { label: "Enterprise", value: 45, color: "var(--g0-accent-violet)" },
    { label: "SMB", value: 28, color: "var(--g0-accent-amber)" },
    { label: "Startup", value: 18, color: "var(--g0-accent-rose)" },
    { label: "Govt", value: 9, color: "#22c55e" },
  ];

  const deptData = [
    { label: "Sales", value: 92, color: "var(--g0-accent-violet)" },
    { label: "Eng", value: 88, color: "var(--g0-accent-amber)" },
    { label: "Mkt", value: 76, color: "var(--g0-accent-rose)" },
    { label: "Ops", value: 84, color: "#22c55e" },
  ];

  const initiatives: InitiativeRowProps[] = [
    {
      name: "Digital Transformation",
      progress: 75,
      status: "on-track",
      owner: "CTO",
    },
    {
      name: "APAC Expansion",
      progress: 45,
      status: "at-risk",
      owner: "CSO",
    },
    {
      name: "Product 2.0 Launch",
      progress: 90,
      status: "on-track",
      owner: "CPO",
    },
    {
      name: "Cost Optimization",
      progress: 32,
      status: "delayed",
      owner: "CFO",
    },
  ];

  const leaders = [
    {
      name: "Sarah C.",
      role: "CFO",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
      metric: "+18%",
    },
    {
      name: "Marcus W.",
      role: "CTO",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      metric: "99.9%",
    },
    {
      name: "Elena R.",
      role: "COO",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
      metric: "+12%",
    },
    {
      name: "James P.",
      role: "CSO",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      metric: "$24M",
    },
  ];

  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden p-4",
        className
      )}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Rectangle
            width={32}
            height={32}
            radius={8}
            backgroundImage="linear-gradient(135deg, var(--g0-accent-violet) 0%, var(--g0-accent-rose) 100%)"
          />
          <div>
            <Text variant="h3" color="primary">
              CEO Dashboard
            </Text>
            <Text variant="small" color="muted">
              Q4 2025 Overview
            </Text>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">
            <span className="flex items-center gap-1">
              <Circle radius={3} fill="var(--g0-status-success)" />
              Operational
            </span>
          </Badge>
          <div
            className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-[var(--g0-accent-violet)]"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face)",
            }}
          />
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-3 h-[calc(100%-48px)]">
        {/* KPI Cards Row - Top */}
        <div className="col-span-12 grid grid-cols-5 gap-2">
          <KPICard
            title="Revenue"
            value="$12.4M"
            change={12.5}
            sparklineData={[65, 72, 68, 75, 82, 78, 85, 92]}
            sparklineColor="var(--g0-accent-violet)"
            icon="DollarSign"
          />
          <KPICard
            title="Customers"
            value="2,847"
            change={8.2}
            sparklineData={[180, 195, 205, 218, 232, 245, 258, 270]}
            sparklineColor="var(--g0-accent-amber)"
            icon="Users"
          />
          <KPICard
            title="Employees"
            value="456"
            change={-2.1}
            sparklineData={[420, 430, 445, 458, 465, 462, 458, 456]}
            sparklineColor="var(--g0-accent-rose)"
            icon="Building2"
          />
          <KPICard
            title="NPS"
            value="72"
            change={5}
            sparklineData={[58, 62, 65, 67, 68, 70, 71, 72]}
            sparklineColor="#22c55e"
            icon="ThumbsUp"
          />
          <KPICard
            title="Market Cap"
            value="$2.8B"
            change={15.8}
            sparklineData={[1.9, 2.1, 2.3, 2.4, 2.5, 2.6, 2.75, 2.8]}
            sparklineColor="#3b82f6"
            icon="TrendingUp"
          />
        </div>

        {/* Charts Row - Middle */}
        <div className="col-span-6 row-span-2">
          <div
            className="h-full p-3 rounded-xl"
            style={{
              background: "var(--g0-bg-elevated-1)",
              border: "1px solid var(--g0-bg-elevated-3)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <Text variant="body" color="primary" className="font-medium">
                Revenue Trend
              </Text>
              <Badge variant="info" size="sm">
                2025
              </Badge>
            </div>
            <LineChart
              data={revenueData}
              width={420}
              height={140}
              showGrid
              showArea
              showDots
              color="var(--g0-accent-violet)"
            />
          </div>
        </div>

        {/* Donut Chart */}
        <div className="col-span-3 row-span-2">
          <div
            className="h-full p-3 rounded-xl"
            style={{
              background: "var(--g0-bg-elevated-1)",
              border: "1px solid var(--g0-bg-elevated-3)",
            }}
          >
            <Text variant="body" color="primary" className="font-medium mb-2">
              Revenue Segments
            </Text>
            <div className="flex justify-center">
              <DonutChart
                data={segmentData}
                width={120}
                height={120}
                centerValue="$12.4M"
                centerLabel="Total"
              />
            </div>
          </div>
        </div>

        {/* Department Performance */}
        <div className="col-span-3 row-span-2">
          <div
            className="h-full p-3 rounded-xl"
            style={{
              background: "var(--g0-bg-elevated-1)",
              border: "1px solid var(--g0-bg-elevated-3)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <Text variant="body" color="primary" className="font-medium">
                Departments
              </Text>
              <Badge variant="success" size="sm">
                Avg: 85%
              </Badge>
            </div>
            <BarChart
              data={deptData}
              width={160}
              height={130}
              showLabels
              showValues
            />
          </div>
        </div>

        {/* Initiatives */}
        <div className="col-span-5">
          <div
            className="h-full p-3 rounded-xl"
            style={{
              background: "var(--g0-bg-elevated-1)",
              border: "1px solid var(--g0-bg-elevated-3)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <Text variant="body" color="primary" className="font-medium">
                Strategic Initiatives
              </Text>
              <Icon name="Target" size={14} color="var(--g0-accent-violet)" />
            </div>
            <div className="space-y-0.5">
              {initiatives.map((init, idx) => (
                <InitiativeRow key={idx} {...init} />
              ))}
            </div>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="col-span-4">
          <div
            className="h-full p-3 rounded-xl"
            style={{
              background: "var(--g0-bg-elevated-1)",
              border: "1px solid var(--g0-bg-elevated-3)",
            }}
          >
            <Text variant="body" color="primary" className="font-medium mb-2">
              Leadership
            </Text>
            <div className="grid grid-cols-4 gap-2">
              {leaders.map((leader, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-full bg-cover bg-center border border-[var(--g0-accent-violet)]"
                    style={{ backgroundImage: `url(${leader.avatar})` }}
                  />
                  <Text
                    variant="small"
                    color="muted"
                    className="mt-1 text-[10px]"
                  >
                    {leader.role}
                  </Text>
                  <Text
                    variant="small"
                    color="primary"
                    className="text-[10px] font-medium"
                  >
                    {leader.metric}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Gauges */}
        <div className="col-span-3">
          <div
            className="h-full p-3 rounded-xl"
            style={{
              background: "var(--g0-bg-elevated-1)",
              border: "1px solid var(--g0-bg-elevated-3)",
            }}
          >
            <Text variant="body" color="primary" className="font-medium mb-2">
              Risk Level
            </Text>
            <div className="flex justify-around items-center">
              <div className="flex flex-col items-center">
                <ProgressBar
                  value={35}
                  variant="gauge"
                  size={50}
                  color="#22c55e"
                  showValue
                />
                <Text
                  variant="small"
                  color="muted"
                  className="mt-1 text-[9px]"
                >
                  Market
                </Text>
              </div>
              <div className="flex flex-col items-center">
                <ProgressBar
                  value={62}
                  variant="gauge"
                  size={50}
                  color="var(--g0-status-warning)"
                  showValue
                />
                <Text
                  variant="small"
                  color="muted"
                  className="mt-1 text-[9px]"
                >
                  Ops
                </Text>
              </div>
              <div className="flex flex-col items-center">
                <ProgressBar
                  value={28}
                  variant="gauge"
                  size={50}
                  color="#22c55e"
                  showValue
                />
                <Text
                  variant="small"
                  color="muted"
                  className="mt-1 text-[9px]"
                >
                  Finance
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights Banner */}
        <div className="col-span-12">
          <div
            className="h-full p-3 rounded-xl relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(236, 72, 153, 0.9) 100%)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-white/80" />
                  <span className="text-white text-xs">#3 Global</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-white/80" />
                  <span className="text-white text-xs">42 Markets</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-white/80" />
                  <span className="text-white text-xs">+23% YoY Growth</span>
                </div>
              </div>
              <Text className="text-white/80 text-xs">
                Record Q4 | 3 New Markets Launched
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
