// ============================================================================
// RECRUITING DASHBOARD DATA TYPES
// ============================================================================

export interface RecruitingKPI {
  id: string;
  label: string;
  value: number;
  format: "currency" | "percentage" | "number" | "days";
  change?: number;
  changeLabel?: string;
  trend?: "up" | "down" | "flat";
  category: string;
  color?: string;
  target?: number;
}

export interface RecruitingPipelineStage {
  id: string;
  name: string;
  count: number;
  conversionRate?: number;
  avgDaysInStage?: number;
  color: string;
}

export interface OpenRole {
  id: string;
  title: string;
  department: string;
  level: "junior" | "mid" | "senior" | "lead" | "manager" | "director";
  priority: "critical" | "high" | "normal" | "low";
  daysOpen: number;
  candidateCount: number;
  hiringManager: string;
  targetDate?: string;
}

export interface Candidate {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  stage: string;
  score: number;
  source: string;
  appliedDate: string;
  lastActivity: string;
  isStarred?: boolean;
}

export interface CandidateSource {
  name: string;
  candidates: number;
  hires: number;
  conversionRate: number;
  costPerHire?: number;
  color: string;
}

export interface DepartmentHiring {
  name: string;
  openRoles: number;
  activeCandidates: number;
  hiredThisQuarter: number;
  avgTimeToHire: number;
}

export interface HiringVelocity {
  week: string;
  applications: number;
  interviews: number;
  offers: number;
  hires: number;
}

export interface RecruitingSparklineData {
  label: string;
  data: Array<{
    week: string;
    value: number;
  }>;
}

export interface InterviewSlot {
  id: string;
  candidateName: string;
  role: string;
  time: string;
  interviewer: string;
  type: "phone" | "video" | "onsite" | "panel";
}

export interface RecruitingSubBoardLink {
  id: string;
  name: string;
  icon: string;
}

export interface RecruitingDashboardData {
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
    kpis: RecruitingKPI[];
    pipeline: RecruitingPipelineStage[];
    openRoles: OpenRole[];
    topCandidates: Candidate[];
    sources: CandidateSource[];
    departmentHiring: DepartmentHiring[];
    velocity: HiringVelocity[];
    sparkline: RecruitingSparklineData;
    upcomingInterviews: InterviewSlot[];
    subBoards?: RecruitingSubBoardLink[];
  };
}

// ============================================================================
// MOCK DATA
// ============================================================================

export const recruitingFullDashboardData: RecruitingDashboardData = {
  id: "so_recruiting_dashboard",
  schemaUri: "g0://smart-objects/recruiting-dashboard@1.0",
  entity: {
    id: "entity_chro",
    name: "co-CHRO",
    avatar: "",
  },
  data: {
    title: "Talent Acquisition",
    period: "Q1 2025",
    kpis: [
      {
        id: "open_positions",
        label: "Open Positions",
        value: 23,
        format: "number",
        change: 5,
        changeLabel: "vs last month",
        category: "pipeline",
        color: "blue",
      },
      {
        id: "active_candidates",
        label: "Active Candidates",
        value: 156,
        format: "number",
        change: 32,
        changeLabel: "this week",
        category: "pipeline",
        color: "cyan",
      },
      {
        id: "interviews_week",
        label: "Interviews This Week",
        value: 18,
        format: "number",
        category: "activity",
        color: "violet",
      },
      {
        id: "offers_pending",
        label: "Offers Pending",
        value: 4,
        format: "number",
        category: "pipeline",
        color: "amber",
      },
      {
        id: "time_to_hire",
        label: "Time to Hire",
        value: 32,
        format: "days",
        change: -5,
        trend: "down",
        category: "efficiency",
        color: "green",
      },
      {
        id: "offer_acceptance",
        label: "Offer Acceptance",
        value: 0.85,
        format: "percentage",
        change: 0.05,
        trend: "up",
        category: "success",
        color: "lime",
      },
      {
        id: "quality_score",
        label: "Quality Score",
        value: 8.2,
        format: "number",
        target: 9.0,
        category: "quality",
        color: "teal",
      },
      {
        id: "budget_util",
        label: "Budget Utilization",
        value: 0.72,
        format: "percentage",
        category: "finance",
        color: "rose",
      },
    ],
    pipeline: [
      { id: "applied", name: "Applied", count: 234, color: "#3b82f6" },
      {
        id: "screening",
        name: "Screening",
        count: 89,
        conversionRate: 0.38,
        avgDaysInStage: 3,
        color: "#06b6d4",
      },
      {
        id: "interview",
        name: "Interview",
        count: 45,
        conversionRate: 0.51,
        avgDaysInStage: 7,
        color: "#8b5cf6",
      },
      {
        id: "offer",
        name: "Offer",
        count: 12,
        conversionRate: 0.27,
        avgDaysInStage: 5,
        color: "#f59e0b",
      },
      { id: "hired", name: "Hired", count: 8, conversionRate: 0.67, color: "#22c55e" },
    ],
    openRoles: [
      {
        id: "role_1",
        title: "Senior Engineer",
        department: "Engineering",
        level: "senior",
        priority: "critical",
        daysOpen: 45,
        candidateCount: 12,
        hiringManager: "Mike Ross",
      },
      {
        id: "role_2",
        title: "Product Manager",
        department: "Product",
        level: "mid",
        priority: "high",
        daysOpen: 21,
        candidateCount: 8,
        hiringManager: "Sarah Chen",
      },
      {
        id: "role_3",
        title: "Sales Rep",
        department: "Sales",
        level: "junior",
        priority: "normal",
        daysOpen: 14,
        candidateCount: 23,
        hiringManager: "Emma Wilson",
      },
      {
        id: "role_4",
        title: "UX Designer",
        department: "Design",
        level: "mid",
        priority: "high",
        daysOpen: 30,
        candidateCount: 6,
        hiringManager: "Alex Turner",
      },
    ],
    topCandidates: [
      {
        id: "cand_1",
        name: "Alex Johnson",
        role: "Senior Engineer",
        stage: "Offer",
        score: 94,
        source: "Referral",
        appliedDate: "2025-01-05",
        lastActivity: "2 hours ago",
        isStarred: true,
      },
      {
        id: "cand_2",
        name: "Maria Garcia",
        role: "Product Manager",
        stage: "Interview",
        score: 88,
        source: "LinkedIn",
        appliedDate: "2025-01-12",
        lastActivity: "1 day ago",
      },
      {
        id: "cand_3",
        name: "James Wilson",
        role: "UX Designer",
        stage: "Screening",
        score: 82,
        source: "Job Board",
        appliedDate: "2025-01-18",
        lastActivity: "3 hours ago",
      },
    ],
    sources: [
      {
        name: "Referrals",
        candidates: 45,
        hires: 12,
        conversionRate: 0.267,
        costPerHire: 2500,
        color: "#22c55e",
      },
      {
        name: "LinkedIn",
        candidates: 89,
        hires: 8,
        conversionRate: 0.09,
        costPerHire: 8500,
        color: "#0077b5",
      },
      {
        name: "Job Boards",
        candidates: 156,
        hires: 6,
        conversionRate: 0.038,
        costPerHire: 4200,
        color: "#f59e0b",
      },
      {
        name: "Direct",
        candidates: 23,
        hires: 4,
        conversionRate: 0.174,
        costPerHire: 1200,
        color: "#3b82f6",
      },
    ],
    departmentHiring: [
      {
        name: "Engineering",
        openRoles: 8,
        activeCandidates: 45,
        hiredThisQuarter: 5,
        avgTimeToHire: 38,
      },
      {
        name: "Sales",
        openRoles: 5,
        activeCandidates: 32,
        hiredThisQuarter: 3,
        avgTimeToHire: 28,
      },
      {
        name: "Product",
        openRoles: 3,
        activeCandidates: 18,
        hiredThisQuarter: 2,
        avgTimeToHire: 35,
      },
      {
        name: "Design",
        openRoles: 2,
        activeCandidates: 12,
        hiredThisQuarter: 1,
        avgTimeToHire: 42,
      },
    ],
    velocity: [
      { week: "W1", applications: 45, interviews: 12, offers: 3, hires: 2 },
      { week: "W2", applications: 52, interviews: 15, offers: 4, hires: 1 },
      { week: "W3", applications: 38, interviews: 18, offers: 2, hires: 3 },
      { week: "W4", applications: 61, interviews: 14, offers: 5, hires: 2 },
    ],
    sparkline: {
      label: "Applications Trend",
      data: [
        { week: "W1", value: 45 },
        { week: "W2", value: 52 },
        { week: "W3", value: 38 },
        { week: "W4", value: 61 },
        { week: "W5", value: 48 },
        { week: "W6", value: 55 },
      ],
    },
    upcomingInterviews: [
      {
        id: "int_1",
        candidateName: "Alex Johnson",
        role: "Senior Engineer",
        time: "Today, 2:00 PM",
        interviewer: "Mike Ross",
        type: "panel",
      },
      {
        id: "int_2",
        candidateName: "Maria Garcia",
        role: "Product Manager",
        time: "Tomorrow, 10:00 AM",
        interviewer: "Sarah Chen",
        type: "video",
      },
      {
        id: "int_3",
        candidateName: "James Wilson",
        role: "UX Designer",
        time: "Wed, 3:00 PM",
        interviewer: "Alex Turner",
        type: "onsite",
      },
    ],
    subBoards: [
      { id: "board_pipeline_detail", name: "Pipeline", icon: "Funnel" },
      { id: "board_candidates", name: "Candidates", icon: "Users" },
      { id: "board_jobs", name: "Job Postings", icon: "Briefcase" },
      { id: "board_analytics", name: "Analytics", icon: "BarChart3" },
    ],
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function formatRecruitingNumber(value: number): string {
  return value.toLocaleString();
}

export function formatRecruitingPercentage(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

export function formatRecruitingDays(value: number): string {
  return `${value}d`;
}

export function formatRecruitingKPIValue(kpi: RecruitingKPI): string {
  switch (kpi.format) {
    case "percentage":
      return formatRecruitingPercentage(kpi.value);
    case "days":
      return formatRecruitingDays(kpi.value);
    case "number":
      return formatRecruitingNumber(kpi.value);
    default:
      return String(kpi.value);
  }
}

export function formatRecruitingChange(
  change: number,
  format: RecruitingKPI["format"]
): string {
  const sign = change >= 0 ? "+" : "";
  switch (format) {
    case "percentage":
      return `${sign}${(change * 100).toFixed(0)}%`;
    case "days":
      return `${sign}${change}d`;
    case "number":
      return `${sign}${change}`;
    default:
      return `${sign}${change}`;
  }
}

export function getStageColor(stageId: string): string {
  const colors: Record<string, string> = {
    applied: "#3b82f6",
    screening: "#06b6d4",
    interview: "#8b5cf6",
    offer: "#f59e0b",
    hired: "#22c55e",
  };
  return colors[stageId] || "#6b7280";
}

export function getPriorityColor(priority: OpenRole["priority"]): string {
  const colors: Record<string, string> = {
    critical: "#ef4444",
    high: "#f59e0b",
    normal: "#3b82f6",
    low: "#6b7280",
  };
  return colors[priority] || "#6b7280";
}

export function getScoreColor(score: number): string {
  if (score >= 90) return "#22c55e";
  if (score >= 80) return "#84cc16";
  if (score >= 70) return "#f59e0b";
  return "#ef4444";
}
