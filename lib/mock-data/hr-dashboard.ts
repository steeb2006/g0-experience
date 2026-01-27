export interface Employee {
  id: string;
  name: string;
  title: string;
  department: string;
  avatar?: string;
  reportsTo?: string;
  teamSize?: number;
  engagement?: number;
  tenure?: number;
  isLeader: boolean;
}

export interface HRKPI {
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

export interface DepartmentStats {
  name: string;
  headcount: number;
  engagement: number;
  openRoles: number;
}

export interface HRSparklineData {
  label: string;
  data: Array<{
    month: string;
    value: number;
  }>;
}

export interface HRSubBoardLink {
  id: string;
  name: string;
  icon: string;
}

export interface HRDashboardData {
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
    kpis: HRKPI[];
    orgChart: {
      ceo: Employee;
      leaders: Employee[];
    };
    departmentStats: DepartmentStats[];
    sparkline: HRSparklineData;
    subBoards: HRSubBoardLink[];
  };
}

export const hrDashboardData: HRDashboardData = {
  id: "so_hr_overview",
  schemaUri: "g0://smart-objects/hr-dashboard@1.0",
  entity: {
    id: "entity_chro",
    name: "co-CHRO",
    avatar: "",
  },
  data: {
    title: "People & Culture",
    period: "Q1 2025",
    kpis: [
      {
        id: "headcount",
        label: "Headcount",
        value: 156,
        format: "number",
        change: 8,
        changeLabel: "YTD",
        category: "workforce",
        color: "blue",
      },
      {
        id: "turnover",
        label: "Turnover",
        value: 0.124,
        format: "percentage",
        change: -0.021,
        trend: "down",
        category: "retention",
        color: "green",
      },
      {
        id: "engagement",
        label: "Engagement",
        value: 0.87,
        format: "percentage",
        change: 0.05,
        trend: "up",
        category: "culture",
        color: "lime",
      },
      {
        id: "open_roles",
        label: "Open Roles",
        value: 23,
        format: "number",
        change: 12,
        changeLabel: "urgent",
        category: "recruiting",
        color: "amber",
      },
      {
        id: "tenure",
        label: "Avg Tenure",
        value: 2.4,
        format: "number",
        changeLabel: "years",
        category: "workforce",
        color: "cyan",
      },
      {
        id: "flight_risk",
        label: "Flight Risk",
        value: 8,
        format: "number",
        category: "retention",
        color: "rose",
      },
      {
        id: "enps",
        label: "eNPS",
        value: 42,
        format: "number",
        trend: "up",
        change: 5,
        category: "culture",
        color: "green",
      },
      {
        id: "training",
        label: "Training",
        value: 0.78,
        format: "percentage",
        category: "development",
        color: "violet",
      },
    ],
    orgChart: {
      ceo: {
        id: "emp_1",
        name: "Sarah Chen",
        title: "CEO",
        department: "Executive",
        isLeader: true,
        teamSize: 156,
        engagement: 94,
      },
      leaders: [
        {
          id: "emp_2",
          name: "Mike Ross",
          title: "VP Engineering",
          department: "Engineering",
          isLeader: true,
          teamSize: 45,
          engagement: 92,
          reportsTo: "emp_1",
        },
        {
          id: "emp_3",
          name: "Lisa Park",
          title: "VP People",
          department: "HR",
          isLeader: true,
          teamSize: 8,
          engagement: 95,
          reportsTo: "emp_1",
        },
        {
          id: "emp_4",
          name: "John Davis",
          title: "VP Finance",
          department: "Finance",
          isLeader: true,
          teamSize: 12,
          engagement: 88,
          reportsTo: "emp_1",
        },
        {
          id: "emp_5",
          name: "Emma Wilson",
          title: "VP Sales",
          department: "Sales",
          isLeader: true,
          teamSize: 32,
          engagement: 78,
          reportsTo: "emp_1",
        },
        {
          id: "emp_6",
          name: "Alex Turner",
          title: "VP Operations",
          department: "Operations",
          isLeader: true,
          teamSize: 28,
          engagement: 81,
          reportsTo: "emp_1",
        },
        {
          id: "emp_7",
          name: "Rachel Green",
          title: "VP Marketing",
          department: "Marketing",
          isLeader: true,
          teamSize: 15,
          engagement: 85,
          reportsTo: "emp_1",
        },
      ],
    },
    departmentStats: [
      { name: "Engineering", headcount: 45, engagement: 92, openRoles: 8 },
      { name: "Sales", headcount: 32, engagement: 78, openRoles: 5 },
      { name: "Operations", headcount: 28, engagement: 81, openRoles: 4 },
      { name: "Marketing", headcount: 15, engagement: 85, openRoles: 3 },
      { name: "Finance", headcount: 12, engagement: 88, openRoles: 2 },
      { name: "HR", headcount: 8, engagement: 95, openRoles: 1 },
    ],
    sparkline: {
      label: "Headcount Trend",
      data: [
        { month: "Oct", value: 142 },
        { month: "Nov", value: 148 },
        { month: "Dec", value: 152 },
        { month: "Jan", value: 156 },
      ],
    },
    subBoards: [
      { id: "board_recruiting", name: "Recruiting", icon: "UserPlus" },
      { id: "board_compensation", name: "Compensation", icon: "Coins" },
      { id: "board_learning", name: "Learning", icon: "GraduationCap" },
      { id: "board_offboard", name: "Offboarding", icon: "UserMinus" },
    ],
  },
};

// Recruiting sub-board data
export const recruitingDashboardData = {
  id: "so_recruiting",
  schemaUri: "g0://smart-objects/recruiting-dashboard@1.0",
  entity: {
    id: "entity_chro",
    name: "co-CHRO",
    avatar: "",
  },
  data: {
    title: "Recruiting",
    period: "Q1 2025",
    kpis: [
      {
        id: "open_positions",
        label: "Open Positions",
        value: 23,
        format: "number" as const,
        category: "pipeline",
        color: "blue",
      },
      {
        id: "time_to_hire",
        label: "Time to Hire",
        value: 32,
        format: "number" as const,
        changeLabel: "days",
        trend: "down" as const,
        change: -5,
        category: "efficiency",
        color: "green",
      },
      {
        id: "offer_acceptance",
        label: "Offer Acceptance",
        value: 0.85,
        format: "percentage" as const,
        category: "success",
        color: "lime",
      },
    ],
    pipeline: [
      { stage: "Applied", count: 234 },
      { stage: "Screening", count: 89 },
      { stage: "Interview", count: 45 },
      { stage: "Offer", count: 12 },
      { stage: "Hired", count: 8 },
    ],
  },
};

// Compensation sub-board data
export const compensationDashboardData = {
  id: "so_compensation",
  schemaUri: "g0://smart-objects/compensation-dashboard@1.0",
  entity: {
    id: "entity_chro",
    name: "co-CHRO",
    avatar: "",
  },
  data: {
    title: "Compensation",
    period: "Q1 2025",
    kpis: [
      {
        id: "total_payroll",
        label: "Total Payroll",
        value: 2400000,
        format: "currency" as const,
        change: 0.08,
        trend: "up" as const,
        category: "cost",
        color: "blue",
      },
      {
        id: "avg_salary",
        label: "Avg Salary",
        value: 125000,
        format: "currency" as const,
        change: 0.04,
        trend: "up" as const,
        category: "benchmark",
        color: "teal",
      },
      {
        id: "market_position",
        label: "Market Position",
        value: 0.72,
        format: "percentage" as const,
        category: "benchmark",
        color: "amber",
      },
    ],
  },
};

export function formatHRNumber(value: number): string {
  return value.toLocaleString();
}

export function formatHRPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatHRCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

export function formatHRKPIValue(kpi: HRKPI): string {
  switch (kpi.format) {
    case "currency":
      return formatHRCurrency(kpi.value);
    case "percentage":
      return formatHRPercentage(kpi.value);
    case "number":
      return formatHRNumber(kpi.value);
    default:
      return String(kpi.value);
  }
}

export function formatHRChange(change: number, isNumber: boolean = false): string {
  if (isNumber) {
    return `${change >= 0 ? "+" : ""}${change}`;
  }
  const sign = change >= 0 ? "+" : "";
  return `${sign}${(change * 100).toFixed(1)}%`;
}
