export interface KPI {
  id: string;
  label: string;
  value: number;
  format: "currency" | "percentage" | "number";
  change?: number;
  changeLabel?: string;
  trend?: "up" | "down" | "flat";
  category: string;
  runway?: number;
  color?: string;
}

export interface SparklineData {
  label: string;
  data: Array<{
    month: string;
    value: number;
  }>;
}

export interface SubBoardLink {
  id: string;
  name: string;
  icon: string;
}

export interface FinanceDashboardData {
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
    kpis: KPI[];
    sparkline: SparklineData;
    subBoards: SubBoardLink[];
  };
}

export const financeDashboardData: FinanceDashboardData = {
  id: "so_finance_overview",
  schemaUri: "g0://smart-objects/finance-kpi-dashboard@1.0",
  entity: {
    id: "entity_cfo",
    name: "co-CFO",
    avatar: "",
  },
  data: {
    title: "Finance Overview",
    period: "Q4 2025",
    kpis: [
      {
        id: "revenue",
        label: "Revenue",
        value: 2400000,
        format: "currency",
        change: 0.12,
        trend: "up",
        category: "income",
        color: "lime",
      },
      {
        id: "costs",
        label: "Costs",
        value: 1800000,
        format: "currency",
        change: 0.08,
        trend: "up",
        category: "expense",
        color: "rose",
      },
      {
        id: "margin",
        label: "Margin",
        value: 0.248,
        format: "percentage",
        change: 0.021,
        trend: "up",
        category: "ratio",
        color: "amber",
      },
      {
        id: "cash",
        label: "Cash Position",
        value: 4200000,
        format: "currency",
        runway: 18,
        category: "position",
        color: "teal",
      },
      {
        id: "burn",
        label: "Burn Rate",
        value: 0.78,
        format: "percentage",
        category: "rate",
        color: "violet",
      },
      {
        id: "headcount",
        label: "Headcount",
        value: 127,
        format: "number",
        change: 5,
        changeLabel: "YTD",
        category: "hr",
        color: "sky",
      },
      {
        id: "ebitda",
        label: "EBITDA",
        value: 580000,
        format: "currency",
        change: 0.15,
        trend: "up",
        category: "profitability",
        color: "blue",
      },
      {
        id: "opex",
        label: "OpEx",
        value: 1420000,
        format: "currency",
        change: 0.06,
        trend: "up",
        category: "expense",
        color: "rose",
      },
      {
        id: "arr",
        label: "ARR",
        value: 9600000,
        format: "currency",
        change: 0.18,
        trend: "up",
        category: "revenue",
        color: "cyan",
      },
      {
        id: "nrr",
        label: "NRR",
        value: 1.12,
        format: "percentage",
        category: "retention",
        color: "green",
      },
    ],
    sparkline: {
      label: "Revenue Trend",
      data: [
        { month: "Jul", value: 165000 },
        { month: "Aug", value: 172000 },
        { month: "Sep", value: 180000 },
        { month: "Oct", value: 188000 },
        { month: "Nov", value: 195000 },
        { month: "Dec", value: 210000 },
        { month: "Jan", value: 225000 },
      ],
    },
    subBoards: [
      { id: "board_controlling", name: "Controlling", icon: "PieChart" },
      { id: "board_cash", name: "Cash", icon: "Banknote" },
      { id: "board_hr", name: "HR", icon: "Users" },
      { id: "board_forecast", name: "Forecast", icon: "TrendingUp" },
    ],
  },
};

// Controlling sub-board data
export const controllingDashboardData = {
  id: "so_controlling",
  schemaUri: "g0://smart-objects/cost-center-analysis@1.0",
  entity: {
    id: "entity_cfo",
    name: "co-CFO",
    avatar: "",
  },
  data: {
    title: "Controlling",
    period: "Q4 2025",
    kpis: [
      {
        id: "budget_variance",
        label: "Budget Variance",
        value: -0.032,
        format: "percentage" as const,
        trend: "down" as const,
        category: "variance",
        color: "lime",
      },
      {
        id: "cost_per_fte",
        label: "Cost per FTE",
        value: 14173,
        format: "currency" as const,
        change: -0.05,
        trend: "down" as const,
        category: "efficiency",
        color: "teal",
      },
      {
        id: "opex_ratio",
        label: "OpEx Ratio",
        value: 0.62,
        format: "percentage" as const,
        category: "ratio",
        color: "amber",
      },
    ],
    costCenters: [
      { name: "Engineering", budget: 850000, actual: 820000 },
      { name: "Sales", budget: 420000, actual: 445000 },
      { name: "Marketing", budget: 280000, actual: 265000 },
      { name: "Operations", budget: 250000, actual: 270000 },
    ],
  },
};

// Cash Flow sub-board data
export const cashFlowDashboardData = {
  id: "so_cash_flow",
  schemaUri: "g0://smart-objects/cash-flow-overview@1.0",
  entity: {
    id: "entity_cfo",
    name: "co-CFO",
    avatar: "",
  },
  data: {
    title: "Cash Flow",
    period: "Q4 2025",
    kpis: [
      {
        id: "operating_cf",
        label: "Operating CF",
        value: 580000,
        format: "currency" as const,
        change: 0.15,
        trend: "up" as const,
        category: "flow",
        color: "lime",
      },
      {
        id: "free_cf",
        label: "Free Cash Flow",
        value: 320000,
        format: "currency" as const,
        change: 0.08,
        trend: "up" as const,
        category: "flow",
        color: "teal",
      },
      {
        id: "runway",
        label: "Runway",
        value: 18,
        format: "number" as const,
        category: "months",
        color: "amber",
      },
    ],
    cashFlow: [
      { month: "Oct", inflow: 720000, outflow: 580000 },
      { month: "Nov", inflow: 780000, outflow: 620000 },
      { month: "Dec", inflow: 900000, outflow: 680000 },
      { month: "Jan", inflow: 850000, outflow: 640000 },
    ],
  },
};

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatChange(change: number, asPercentage: boolean = true): string {
  const prefix = change >= 0 ? "+" : "";
  if (asPercentage) {
    return `${prefix}${(change * 100).toFixed(1)}%`;
  }
  return `${prefix}${change}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString();
}

export function formatKPIValue(kpi: KPI): string {
  switch (kpi.format) {
    case "currency":
      return formatCurrency(kpi.value);
    case "percentage":
      return formatPercentage(kpi.value);
    case "number":
      return formatNumber(kpi.value);
    default:
      return String(kpi.value);
  }
}
