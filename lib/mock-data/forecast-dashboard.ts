export interface PipelineStage {
  id: string;
  name: string;
  value: number;
  count: number;
  probability: number;
  color: string;
}

export interface Customer {
  id: string;
  name: string;
  value: number;
  probability: number;
  stage: string;
  status: "overperforming" | "on-track" | "underperforming" | "at-risk";
  delta: number; // vs forecast
  closeDate: string;
  owner: string;
}

export interface ForecastKPI {
  id: string;
  label: string;
  value: number;
  format: "currency" | "percentage" | "number";
  change?: number;
  changeLabel?: string;
  trend?: "up" | "down" | "flat";
  category: string;
  color?: string;
}

export interface ForecastSparklineData {
  label: string;
  data: Array<{
    month: string;
    value: number;
    forecast?: number;
  }>;
}

export interface ForecastDashboardData {
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
    kpis: ForecastKPI[];
    pipeline: PipelineStage[];
    customers: Customer[];
    sparkline: ForecastSparklineData;
    weightedPipeline: number;
    closingRatio: number;
  };
}

export const forecastDashboardData: ForecastDashboardData = {
  id: "so_forecast",
  schemaUri: "g0://smart-objects/financial-projections@1.0",
  entity: {
    id: "entity_cfo",
    name: "co-CFO",
    avatar: "",
  },
  data: {
    title: "Revenue Forecast",
    period: "Q1 2025",
    weightedPipeline: 4850000,
    closingRatio: 0.32,
    kpis: [
      {
        id: "pipeline_total",
        label: "Total Pipeline",
        value: 12400000,
        format: "currency",
        change: 0.18,
        trend: "up",
        category: "pipeline",
        color: "blue",
      },
      {
        id: "weighted_pipeline",
        label: "Weighted Pipeline",
        value: 4850000,
        format: "currency",
        change: 0.12,
        trend: "up",
        category: "pipeline",
        color: "cyan",
      },
      {
        id: "closing_ratio",
        label: "Closing Ratio",
        value: 0.32,
        format: "percentage",
        change: 0.04,
        trend: "up",
        category: "efficiency",
        color: "lime",
      },
      {
        id: "avg_deal_size",
        label: "Avg Deal Size",
        value: 185000,
        format: "currency",
        change: 0.08,
        trend: "up",
        category: "efficiency",
        color: "amber",
      },
      {
        id: "forecast_accuracy",
        label: "Forecast Accuracy",
        value: 0.87,
        format: "percentage",
        category: "quality",
        color: "green",
      },
      {
        id: "at_risk",
        label: "At Risk",
        value: 1200000,
        format: "currency",
        category: "risk",
        color: "rose",
      },
    ],
    pipeline: [
      { id: "stage_1", name: "Qualified", value: 3200000, count: 24, probability: 0.15, color: "slate" },
      { id: "stage_2", name: "Discovery", value: 2800000, count: 18, probability: 0.30, color: "blue" },
      { id: "stage_3", name: "Proposal", value: 2400000, count: 12, probability: 0.50, color: "cyan" },
      { id: "stage_4", name: "Negotiation", value: 2200000, count: 8, probability: 0.75, color: "amber" },
      { id: "stage_5", name: "Commit", value: 1800000, count: 5, probability: 0.90, color: "lime" },
    ],
    customers: [
      {
        id: "cust_1",
        name: "Acme Corp",
        value: 450000,
        probability: 0.85,
        stage: "Negotiation",
        status: "overperforming",
        delta: 0.15,
        closeDate: "2025-02-15",
        owner: "Sarah M.",
      },
      {
        id: "cust_2",
        name: "TechVentures",
        value: 320000,
        probability: 0.90,
        stage: "Commit",
        status: "on-track",
        delta: 0.02,
        closeDate: "2025-01-28",
        owner: "Mike R.",
      },
      {
        id: "cust_3",
        name: "GlobalTrade Inc",
        value: 580000,
        probability: 0.45,
        stage: "Proposal",
        status: "underperforming",
        delta: -0.22,
        closeDate: "2025-03-10",
        owner: "Lisa P.",
      },
      {
        id: "cust_4",
        name: "FinServ Partners",
        value: 275000,
        probability: 0.70,
        stage: "Negotiation",
        status: "on-track",
        delta: 0.05,
        closeDate: "2025-02-20",
        owner: "John D.",
      },
      {
        id: "cust_5",
        name: "Meridian Health",
        value: 680000,
        probability: 0.25,
        stage: "Discovery",
        status: "at-risk",
        delta: -0.35,
        closeDate: "2025-04-01",
        owner: "Emma W.",
      },
      {
        id: "cust_6",
        name: "DataFlow Systems",
        value: 195000,
        probability: 0.95,
        stage: "Commit",
        status: "overperforming",
        delta: 0.20,
        closeDate: "2025-01-25",
        owner: "Alex T.",
      },
      {
        id: "cust_7",
        name: "Nordic Industries",
        value: 420000,
        probability: 0.60,
        stage: "Proposal",
        status: "on-track",
        delta: 0.00,
        closeDate: "2025-02-28",
        owner: "Rachel G.",
      },
      {
        id: "cust_8",
        name: "Summit Retail",
        value: 350000,
        probability: 0.35,
        stage: "Discovery",
        status: "underperforming",
        delta: -0.18,
        closeDate: "2025-03-15",
        owner: "Chris W.",
      },
    ],
    sparkline: {
      label: "Forecast vs Actual",
      data: [
        { month: "Oct", value: 1800000, forecast: 1750000 },
        { month: "Nov", value: 2100000, forecast: 2000000 },
        { month: "Dec", value: 2400000, forecast: 2300000 },
        { month: "Jan", value: 2200000, forecast: 2500000 },
        { month: "Feb", value: 0, forecast: 2700000 },
        { month: "Mar", value: 0, forecast: 2900000 },
      ],
    },
  },
};

export function formatForecastCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

export function formatForecastPercentage(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

export function getStatusColor(status: Customer["status"]): string {
  switch (status) {
    case "overperforming":
      return "#22c55e"; // green
    case "on-track":
      return "#3b82f6"; // blue
    case "underperforming":
      return "#f59e0b"; // amber
    case "at-risk":
      return "#ef4444"; // red
    default:
      return "#6b7280"; // gray
  }
}

export function getStatusLabel(status: Customer["status"]): string {
  switch (status) {
    case "overperforming":
      return "Over";
    case "on-track":
      return "On Track";
    case "underperforming":
      return "Under";
    case "at-risk":
      return "At Risk";
    default:
      return status;
  }
}
