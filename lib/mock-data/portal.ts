// ============================================================================
// PORTAL HOMEPAGE DATA TYPES
// ============================================================================

export interface PortalAnnouncement {
  id: string;
  type: "critical" | "highlight" | "info";
  title: string;
  description: string;
  entitySource: string;
  timestamp: string;
  linkTo?: string;
}

export interface ActivityEvent {
  id: string;
  type: "entity_action" | "artifact_created" | "alert";
  description: string;
  workspace: string;
  board: string;
  timestamp: string;
  entity?: string;
  relativeTime: string;
}

export interface TrendingMetric {
  id: string;
  label: string;
  change: number;
  changeType: "percentage" | "number" | "points";
  trend: "up" | "down" | "flat";
  sparklineData: number[];
}

export interface WorkspaceKPI {
  label: string;
  value: string;
  trend?: "up" | "down" | "flat";
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  color: string;
  entityOwner: {
    id: string;
    name: string;
  };
  kpis: WorkspaceKPI[];
  healthScore: number;
  boards: Array<{
    id: string;
    name: string;
  }>;
}

export interface Notification {
  id: string;
  type: "alert" | "milestone" | "mention" | "update";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  linkTo?: string;
}

export interface CrossWorkspaceInsight {
  id: string;
  insight: string;
  involvedWorkspaces: string[];
  involvedEntities: string[];
}

// ============================================================================
// MOCK DATA
// ============================================================================

export const portalAnnouncements: PortalAnnouncement[] = [
  {
    id: "ann_1",
    type: "critical",
    title: "Q4 closes in 4 days",
    description: "All finance reviews must be completed by Friday EOD",
    entitySource: "co-CFO",
    timestamp: "2026-01-27T08:00:00Z",
    linkTo: "/org_sns/ws_finance/board_forecast",
  },
  {
    id: "ann_2",
    type: "highlight",
    title: "Campaign 65% complete",
    description: "Spring launch ahead of schedule, launch in 15 days",
    entitySource: "co-CSO",
    timestamp: "2026-01-27T06:00:00Z",
    linkTo: "/org_sns/ws_sales/board_launch_campaign",
  },
  {
    id: "ann_3",
    type: "info",
    title: "New VP Engineering joined",
    description: "Welcome Sarah Chen to the leadership team",
    entitySource: "co-CHRO",
    timestamp: "2026-01-26T14:00:00Z",
    linkTo: "/org_sns/ws_hr/board_hr_overview",
  },
];

export const activityEvents: ActivityEvent[] = [
  {
    id: "act_1",
    type: "entity_action",
    description: "co-CFO analyzing Q4 projections",
    workspace: "Finance",
    board: "Forecast",
    timestamp: "2026-01-27T09:45:00Z",
    entity: "co-CFO",
    relativeTime: "Now",
  },
  {
    id: "act_2",
    type: "artifact_created",
    description: 'Artifact: "At-Risk Report"',
    workspace: "Sales",
    board: "Customers",
    timestamp: "2026-01-27T09:43:00Z",
    relativeTime: "2m",
  },
  {
    id: "act_3",
    type: "alert",
    description: "co-CHRO flagged 3 flight risks",
    workspace: "HR",
    board: "People & Culture",
    timestamp: "2026-01-27T09:40:00Z",
    entity: "co-CHRO",
    relativeTime: "5m",
  },
  {
    id: "act_4",
    type: "entity_action",
    description: "Dashboard refreshed",
    workspace: "Operations",
    board: "Process",
    timestamp: "2026-01-27T09:30:00Z",
    relativeTime: "15m",
  },
  {
    id: "act_6",
    type: "entity_action",
    description: "co-CSO reviewing pipeline health",
    workspace: "Sales",
    board: "Launch Campaign",
    timestamp: "2026-01-27T09:00:00Z",
    entity: "co-CSO",
    relativeTime: "45m",
  },
];

export const trendingMetrics: TrendingMetric[] = [
  {
    id: "trend_1",
    label: "Revenue",
    change: 18,
    changeType: "percentage",
    trend: "up",
    sparklineData: [165, 172, 180, 188, 195, 210, 225],
  },
  {
    id: "trend_2",
    label: "Engagement",
    change: 5,
    changeType: "points",
    trend: "up",
    sparklineData: [82, 84, 85, 84, 86, 87, 87],
  },
  {
    id: "trend_3",
    label: "Pipeline",
    change: 34,
    changeType: "percentage",
    trend: "up",
    sparklineData: [2.1, 2.3, 2.5, 2.7, 2.9, 3.0, 3.2],
  },
  {
    id: "trend_4",
    label: "Headcount",
    change: 8,
    changeType: "number",
    trend: "up",
    sparklineData: [142, 145, 148, 150, 152, 154, 156],
  },
];

export const workspaceSummaries: WorkspaceSummary[] = [
  {
    id: "ws_finance",
    name: "Finance",
    color: "#3b82f6", // blue-500
    entityOwner: {
      id: "entity_cfo",
      name: "co-CFO",
    },
    kpis: [
      { label: "Revenue", value: "$2.4M", trend: "up" },
      { label: "Margin", value: "24.8%", trend: "up" },
      { label: "Cash", value: "$4.2M", trend: "flat" },
    ],
    healthScore: 92,
    boards: [
      { id: "board_overview", name: "Overview" },
      { id: "board_forecast", name: "Forecast" },
    ],
  },
  {
    id: "ws_hr",
    name: "HR",
    color: "#22c55e", // green-500
    entityOwner: {
      id: "entity_chro",
      name: "co-CHRO",
    },
    kpis: [
      { label: "Headcount", value: "156", trend: "up" },
      { label: "Turnover", value: "11%", trend: "down" },
      { label: "eNPS", value: "52", trend: "up" },
    ],
    healthScore: 85,
    boards: [
      { id: "board_hr_overview", name: "People" },
      { id: "board_recruiting", name: "Recruiting" },
    ],
  },
  {
    id: "ws_sales",
    name: "Sales",
    color: "#a855f7", // purple-500
    entityOwner: {
      id: "entity_cso",
      name: "co-CSO",
    },
    kpis: [
      { label: "Pipeline", value: "$3.2M", trend: "up" },
      { label: "Leads", value: "2,847", trend: "up" },
      { label: "Conv Rate", value: "12.8%", trend: "up" },
    ],
    healthScore: 78,
    boards: [
      { id: "board_launch_campaign", name: "Campaign" },
      { id: "board_customers", name: "Customers" },
    ],
  },
  {
    id: "ws_operations",
    name: "Operations",
    color: "#f97316", // orange-500
    entityOwner: {
      id: "entity_coo",
      name: "co-COO",
    },
    kpis: [
      { label: "Efficiency", value: "94%", trend: "up" },
      { label: "Uptime", value: "99.9%", trend: "flat" },
      { label: "Tasks", value: "127", trend: "down" },
    ],
    healthScore: 72,
    boards: [
      { id: "board_process", name: "Process" },
      { id: "board_team", name: "Team" },
    ],
  },
];

export const notifications: Notification[] = [
  {
    id: "notif_1",
    type: "alert",
    title: "CloudNine at Risk",
    description: "Health score dropped below 50",
    timestamp: "2026-01-27T09:30:00Z",
    read: false,
    linkTo: "/org_sns/ws_sales/board_customers",
  },
  {
    id: "notif_2",
    type: "milestone",
    title: "Q4 Revenue Target Hit",
    description: "Finance target achieved 3 days early",
    timestamp: "2026-01-27T08:00:00Z",
    read: false,
    linkTo: "/org_sns/ws_finance/board_overview",
  },
  {
    id: "notif_3",
    type: "update",
    title: "Forecast Updated",
    description: "co-CFO revised Q1 projections",
    timestamp: "2026-01-26T16:00:00Z",
    read: true,
    linkTo: "/org_sns/ws_finance/board_forecast",
  },
];

export const crossWorkspaceInsights: CrossWorkspaceInsight[] = [
  {
    id: "insight_1",
    insight: "Headcount growth (+8) correlating with 18% revenue increase - efficiency ratio improving",
    involvedWorkspaces: ["Finance", "HR"],
    involvedEntities: ["co-CFO", "co-CHRO"],
  },
  {
    id: "insight_2",
    insight: "Campaign performance exceeding targets could require Operations capacity planning",
    involvedWorkspaces: ["Sales", "Operations"],
    involvedEntities: ["co-CSO", "co-COO"],
  },
  {
    id: "insight_3",
    insight: "3 flight risks identified in high-revenue customer accounts - coordination needed",
    involvedWorkspaces: ["HR", "Sales"],
    involvedEntities: ["co-CHRO", "co-CSO"],
  },
];

// ============================================================================
// QUICK ACTIONS
// ============================================================================

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  entity: string;
  prompt: string;
  workspaceId: string;
  boardId: string;
}

export const quickActions: QuickAction[] = [
  {
    id: "qa_report",
    label: "Generate Report",
    icon: "FileText",
    entity: "co-CFO",
    prompt: "Generate a quarterly financial report with key metrics and trends",
    workspaceId: "ws_finance",
    boardId: "board_overview",
  },
  {
    id: "qa_health",
    label: "Check Health",
    icon: "Heart",
    entity: "co-CHRO",
    prompt: "Analyze current organizational health and flag any concerns",
    workspaceId: "ws_hr",
    boardId: "board_hr_overview",
  },
  {
    id: "qa_insights",
    label: "View Insights",
    icon: "Lightbulb",
    entity: "co-CSO",
    prompt: "What are the top 3 insights across all customer accounts?",
    workspaceId: "ws_sales",
    boardId: "board_customers",
  },
  {
    id: "qa_chat",
    label: "Ask",
    icon: "MessageCircle",
    entity: "co-CFO",
    prompt: "",
    workspaceId: "ws_finance",
    boardId: "board_overview",
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getOrgHealthScore(): number {
  const scores = workspaceSummaries.map((ws) => ws.healthScore);
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function getUnreadNotificationsCount(): number {
  return notifications.filter((n) => !n.read).length;
}

export function formatTrendingChange(metric: TrendingMetric): string {
  const prefix = metric.trend === "up" ? "+" : metric.trend === "down" ? "-" : "";
  switch (metric.changeType) {
    case "percentage":
      return `${prefix}${Math.abs(metric.change)}%`;
    case "points":
      return `${prefix}${Math.abs(metric.change)}pts`;
    case "number":
      return `${prefix}${Math.abs(metric.change)}`;
    default:
      return String(metric.change);
  }
}

export function getContextualReminder(): string {
  // In a real app, this would be dynamic based on actual data
  return "Q4 closes in 4 days";
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function formatCurrentDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
