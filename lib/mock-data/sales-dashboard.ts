// ============================================================================
// LAUNCH CAMPAIGN DASHBOARD
// ============================================================================

export interface CampaignMetric {
  id: string;
  label: string;
  value: number;
  format: "currency" | "percentage" | "number";
  change?: number;
  trend?: "up" | "down" | "flat";
  color?: string;
}

export interface CampaignPhase {
  id: string;
  name: string;
  status: "completed" | "active" | "upcoming";
  progress: number;
  startDate: string;
  endDate: string;
}

export interface CampaignChannel {
  id: string;
  name: string;
  leads: number;
  conversion: number;
  spend: number;
  roi: number;
}

export interface LaunchCampaignData {
  id: string;
  schemaUri: string;
  entity: {
    id: string;
    name: string;
    avatar: string;
  };
  data: {
    title: string;
    period: string;
    campaignName: string;
    launchDate: string;
    metrics: CampaignMetric[];
    phases: CampaignPhase[];
    channels: CampaignChannel[];
    subBoards: Array<{ id: string; name: string; icon: string }>;
  };
}

export const launchCampaignData: LaunchCampaignData = {
  id: "so_launch_campaign",
  schemaUri: "g0://smart-objects/launch-campaign@1.0",
  entity: {
    id: "entity_cso",
    name: "co-CSO",
    avatar: "",
  },
  data: {
    title: "Launch Campaign",
    period: "Q1 2025",
    campaignName: "Spring Product Launch",
    launchDate: "2025-03-15",
    metrics: [
      {
        id: "total_leads",
        label: "Total Leads",
        value: 2847,
        format: "number",
        change: 0.34,
        trend: "up",
        color: "blue",
      },
      {
        id: "conversion_rate",
        label: "Conversion Rate",
        value: 0.128,
        format: "percentage",
        change: 0.02,
        trend: "up",
        color: "lime",
      },
      {
        id: "campaign_spend",
        label: "Campaign Spend",
        value: 185000,
        format: "currency",
        color: "amber",
      },
      {
        id: "cost_per_lead",
        label: "Cost per Lead",
        value: 65,
        format: "currency",
        change: -0.12,
        trend: "down",
        color: "green",
      },
      {
        id: "pipeline_generated",
        label: "Pipeline Generated",
        value: 3200000,
        format: "currency",
        change: 0.28,
        trend: "up",
        color: "cyan",
      },
      {
        id: "roi",
        label: "ROI",
        value: 4.2,
        format: "number",
        trend: "up",
        color: "violet",
      },
    ],
    phases: [
      { id: "phase_1", name: "Research & Planning", status: "completed", progress: 100, startDate: "2025-01-01", endDate: "2025-01-15" },
      { id: "phase_2", name: "Content Creation", status: "completed", progress: 100, startDate: "2025-01-16", endDate: "2025-02-01" },
      { id: "phase_3", name: "Pre-Launch Teasers", status: "active", progress: 65, startDate: "2025-02-01", endDate: "2025-02-28" },
      { id: "phase_4", name: "Launch Week", status: "upcoming", progress: 0, startDate: "2025-03-10", endDate: "2025-03-20" },
      { id: "phase_5", name: "Post-Launch Follow-up", status: "upcoming", progress: 0, startDate: "2025-03-21", endDate: "2025-04-15" },
    ],
    channels: [
      { id: "ch_1", name: "LinkedIn Ads", leads: 892, conversion: 0.142, spend: 45000, roi: 5.2 },
      { id: "ch_2", name: "Google Ads", leads: 756, conversion: 0.098, spend: 52000, roi: 3.8 },
      { id: "ch_3", name: "Email Campaign", leads: 634, conversion: 0.185, spend: 12000, roi: 8.4 },
      { id: "ch_4", name: "Webinars", leads: 312, conversion: 0.224, spend: 28000, roi: 6.1 },
      { id: "ch_5", name: "Partner Referrals", leads: 253, conversion: 0.312, spend: 48000, roi: 4.5 },
    ],
    subBoards: [
      { id: "board_campaign_planning", name: "Planning", icon: "Calendar" },
      { id: "board_campaign_execution", name: "Execution", icon: "Play" },
      { id: "board_campaign_analytics", name: "Analytics", icon: "BarChart3" },
    ],
  },
};

// ============================================================================
// CUSTOMERS DASHBOARD
// ============================================================================

export interface CustomerSegment {
  id: string;
  name: string;
  count: number;
  revenue: number;
  growth: number;
  color: string;
}

export interface CustomerAccount {
  id: string;
  name: string;
  segment: string;
  arr: number;
  healthScore: number;
  nps: number;
  status: "healthy" | "attention" | "at-risk" | "churning";
  expansionPotential: number;
  lastContact: string;
}

export interface CustomerMetric {
  id: string;
  label: string;
  value: number;
  format: "currency" | "percentage" | "number";
  change?: number;
  trend?: "up" | "down" | "flat";
  color?: string;
}

export interface CustomersData {
  id: string;
  schemaUri: string;
  entity: {
    id: string;
    name: string;
    avatar: string;
  };
  data: {
    title: string;
    period: string;
    metrics: CustomerMetric[];
    segments: CustomerSegment[];
    accounts: CustomerAccount[];
    subBoards: Array<{ id: string; name: string; icon: string }>;
  };
}

export const customersData: CustomersData = {
  id: "so_customers",
  schemaUri: "g0://smart-objects/customers-overview@1.0",
  entity: {
    id: "entity_cso",
    name: "co-CSO",
    avatar: "",
  },
  data: {
    title: "Customers",
    period: "Q1 2025",
    metrics: [
      {
        id: "total_customers",
        label: "Total Customers",
        value: 247,
        format: "number",
        change: 12,
        trend: "up",
        color: "blue",
      },
      {
        id: "total_arr",
        label: "Total ARR",
        value: 18500000,
        format: "currency",
        change: 0.22,
        trend: "up",
        color: "cyan",
      },
      {
        id: "avg_health",
        label: "Avg Health Score",
        value: 78,
        format: "number",
        change: 3,
        trend: "up",
        color: "lime",
      },
      {
        id: "nps",
        label: "NPS",
        value: 42,
        format: "number",
        change: 5,
        trend: "up",
        color: "green",
      },
      {
        id: "churn_rate",
        label: "Churn Rate",
        value: 0.032,
        format: "percentage",
        change: -0.008,
        trend: "down",
        color: "rose",
      },
      {
        id: "expansion_revenue",
        label: "Expansion Revenue",
        value: 2400000,
        format: "currency",
        change: 0.35,
        trend: "up",
        color: "violet",
      },
    ],
    segments: [
      { id: "seg_1", name: "Enterprise", count: 42, revenue: 9200000, growth: 0.28, color: "blue" },
      { id: "seg_2", name: "Mid-Market", count: 87, revenue: 5800000, growth: 0.18, color: "cyan" },
      { id: "seg_3", name: "SMB", count: 118, revenue: 3500000, growth: 0.12, color: "violet" },
    ],
    accounts: [
      { id: "acc_1", name: "TechCorp Global", segment: "Enterprise", arr: 850000, healthScore: 92, nps: 72, status: "healthy", expansionPotential: 320000, lastContact: "2025-01-20" },
      { id: "acc_2", name: "Innovate Labs", segment: "Enterprise", arr: 620000, healthScore: 85, nps: 65, status: "healthy", expansionPotential: 180000, lastContact: "2025-01-18" },
      { id: "acc_3", name: "DataFlow Inc", segment: "Mid-Market", arr: 185000, healthScore: 68, nps: 45, status: "attention", expansionPotential: 95000, lastContact: "2025-01-15" },
      { id: "acc_4", name: "CloudNine Systems", segment: "Enterprise", arr: 720000, healthScore: 45, nps: 28, status: "at-risk", expansionPotential: 0, lastContact: "2024-12-20" },
      { id: "acc_5", name: "Meridian Health", segment: "Mid-Market", arr: 210000, healthScore: 88, nps: 68, status: "healthy", expansionPotential: 125000, lastContact: "2025-01-22" },
      { id: "acc_6", name: "Summit Retail", segment: "Mid-Market", arr: 145000, healthScore: 32, nps: 15, status: "churning", expansionPotential: 0, lastContact: "2024-11-30" },
      { id: "acc_7", name: "Nordic Industries", segment: "Enterprise", arr: 580000, healthScore: 78, nps: 58, status: "healthy", expansionPotential: 220000, lastContact: "2025-01-19" },
      { id: "acc_8", name: "Velocity Partners", segment: "SMB", arr: 48000, healthScore: 82, nps: 62, status: "healthy", expansionPotential: 32000, lastContact: "2025-01-21" },
    ],
    subBoards: [
      { id: "board_customer_360", name: "360View", icon: "Radar" },
      { id: "board_customer_health", name: "Health Scores", icon: "Heart" },
      { id: "board_customer_expansion", name: "Expansion", icon: "TrendingUp" },
    ],
  },
};

// ============================================================================
// CHAT DATA FOR SALES
// ============================================================================

import type { ChatMessage, Artifact } from "./chat-artifacts";

export const salesSampleChatMessages: ChatMessage[] = [
  {
    id: "sales_msg_1",
    role: "user",
    content: "How is the Spring launch campaign performing?",
    timestamp: "2025-01-22T10:00:00Z",
  },
  {
    id: "sales_msg_2",
    role: "entity",
    content: `The Spring Product Launch campaign is performing **above expectations**:

**Key Metrics:**
- Total Leads: 2,847 (+34% vs target)
- Conversion Rate: 12.8% (+2pts)
- Pipeline Generated: $3.2M
- ROI: 4.2x

**Top Performing Channels:**
1. Email Campaign - 18.5% conversion, 8.4x ROI
2. Partner Referrals - 31.2% conversion
3. Webinars - 22.4% conversion

We're currently in the Pre-Launch Teasers phase (65% complete). The launch is on track for March 15th.`,
    timestamp: "2025-01-22T10:01:00Z",
  },
  {
    id: "sales_msg_3",
    role: "user",
    content: "Which customers need attention?",
    timestamp: "2025-01-22T10:15:00Z",
  },
  {
    id: "sales_msg_4",
    role: "entity",
    content: `I've identified **3 accounts requiring immediate attention**:

**At Risk:**
- **CloudNine Systems** (Enterprise, $720K ARR)
  - Health Score: 45 (down 23pts)
  - Last contact: 30+ days ago
  - Action: Schedule executive review

**Churning:**
- **Summit Retail** (Mid-Market, $145K ARR)
  - Health Score: 32
  - NPS: 15 (critical)
  - Action: Escalate to CS leadership

**Attention:**
- **DataFlow Inc** (Mid-Market, $185K ARR)
  - Health Score: 68
  - Recent support tickets up 40%
  - Action: Proactive outreach

Total ARR at risk: **$1.05M**`,
    timestamp: "2025-01-22T10:16:00Z",
    artifacts: [
      {
        id: "artifact_at_risk",
        type: "table",
        title: "At-Risk Customers Report",
        thumbnail: "/thumbnails/at-risk.png",
        createdAt: "2025-01-22T10:16:00Z",
        zone: "shared",
      },
    ],
  },
];

export const salesSampleArtifacts: Artifact[] = [
  {
    id: "artifact_campaign_report",
    type: "pdf",
    title: "Campaign Performance Report",
    thumbnail: "/thumbnails/campaign.png",
    createdAt: "2025-01-20T14:00:00Z",
    zone: "shared",
  },
  {
    id: "artifact_customer_health",
    type: "chart",
    title: "Customer Health Dashboard",
    thumbnail: "/thumbnails/health.png",
    createdAt: "2025-01-21T11:00:00Z",
    zone: "shared",
  },
];

export const salesEntityTools = [
  { id: "tool_campaign_report", name: "generate_campaign_report", description: "Generate campaign performance report" },
  { id: "tool_lead_analysis", name: "analyze_leads", description: "Analyze lead quality and sources" },
  { id: "tool_customer_health", name: "check_customer_health", description: "Review customer health scores" },
  { id: "tool_churn_risk", name: "identify_churn_risk", description: "Identify customers at risk of churning" },
  { id: "tool_expansion", name: "find_expansion_opportunities", description: "Find upsell and cross-sell opportunities" },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function formatSalesCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

export function formatSalesPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function getHealthColor(score: number): string {
  if (score >= 80) return "#22c55e"; // green
  if (score >= 60) return "#84cc16"; // lime
  if (score >= 40) return "#f59e0b"; // amber
  return "#ef4444"; // red
}

export function getStatusColor(status: CustomerAccount["status"]): string {
  switch (status) {
    case "healthy": return "#22c55e";
    case "attention": return "#f59e0b";
    case "at-risk": return "#ef4444";
    case "churning": return "#dc2626";
    default: return "#6b7280";
  }
}
