export type ArtifactType = "pdf" | "chart" | "table" | "text" | "image";
export type ZoneType = "shared" | "private";

export interface Artifact {
  id: string;
  type: ArtifactType;
  title: string;
  thumbnail: string;
  createdAt: string;
  zone: ZoneType;
}

export interface ChatMessage {
  id: string;
  role: "user" | "entity";
  content: string;
  timestamp: string;
  artifacts?: Artifact[];
}

export const sampleArtifacts: Artifact[] = [
  {
    id: "artifact_q4_report",
    type: "pdf",
    title: "Q4 2025 Financial Report",
    thumbnail: "/thumbnails/q4-report.png",
    createdAt: "2025-01-15T10:30:00Z",
    zone: "shared",
  },
  {
    id: "artifact_cashflow",
    type: "chart",
    title: "Cash Flow Projection",
    thumbnail: "/thumbnails/cashflow.png",
    createdAt: "2025-01-15T11:00:00Z",
    zone: "private",
  },
  {
    id: "artifact_budget",
    type: "table",
    title: "Budget vs Actual",
    thumbnail: "/thumbnails/budget.png",
    createdAt: "2025-01-14T15:30:00Z",
    zone: "shared",
  },
];

export const sampleChatMessages: ChatMessage[] = [
  {
    id: "msg_1",
    role: "user",
    content: "Can you show me the quarterly revenue breakdown?",
    timestamp: "2025-01-15T10:00:00Z",
  },
  {
    id: "msg_2",
    role: "entity",
    content:
      "I'll pull the Q4 2025 revenue data. Revenue is up 12% compared to last quarter, driven primarily by increased client acquisitions in the wealth management segment.\n\nKey highlights:\n- Total Revenue: $2.4M\n- Growth: +12% QoQ\n- Primary driver: New client onboarding (+45 clients)\n\nI've generated a detailed report with the breakdown.",
    timestamp: "2025-01-15T10:01:00Z",
    artifacts: [
      {
        id: "artifact_q4_report",
        type: "pdf",
        title: "Q4 2025 Financial Report",
        thumbnail: "/thumbnails/q4-report.png",
        createdAt: "2025-01-15T10:30:00Z",
        zone: "shared",
      },
    ],
  },
  {
    id: "msg_3",
    role: "user",
    content: "What's our cash runway looking like?",
    timestamp: "2025-01-15T10:45:00Z",
  },
  {
    id: "msg_4",
    role: "entity",
    content:
      "Based on current burn rate and cash position, we have approximately 18 months of runway. This is a healthy position given our growth trajectory.\n\nCurrent cash position: $4.2M\nMonthly burn: ~$230K\nRunway: 18 months\n\nI've created a cash flow projection chart showing the next 12 months.",
    timestamp: "2025-01-15T10:46:00Z",
    artifacts: [
      {
        id: "artifact_cashflow",
        type: "chart",
        title: "Cash Flow Projection",
        thumbnail: "/thumbnails/cashflow.png",
        createdAt: "2025-01-15T11:00:00Z",
        zone: "private",
      },
    ],
  },
];

export const entityTools = [
  {
    id: "tool_quarterly_report",
    name: "generate_quarterly_report",
    description: "Generate a comprehensive quarterly financial report",
    parameters: [
      { name: "quarter", type: "string", required: true },
      { name: "year", type: "number", required: true },
      { name: "include_projections", type: "boolean", default: false },
    ],
  },
  {
    id: "tool_analyze_portfolio",
    name: "analyze_portfolio",
    description: "Analyze portfolio performance and risk metrics",
    parameters: [
      { name: "portfolio_id", type: "string", required: true },
      { name: "time_range", type: "string", default: "1Y" },
    ],
  },
  {
    id: "tool_cash_projection",
    name: "project_cash_flow",
    description: "Create cash flow projections based on current data",
    parameters: [
      { name: "months_ahead", type: "number", default: 12 },
      { name: "scenario", type: "string", default: "baseline" },
    ],
  },
  {
    id: "tool_budget_variance",
    name: "calculate_budget_variance",
    description: "Calculate and analyze budget vs actual variances",
    parameters: [
      { name: "cost_center", type: "string", required: false },
      { name: "period", type: "string", required: true },
    ],
  },
];

export function getArtifactsByZone(zone: ZoneType): Artifact[] {
  return sampleArtifacts.filter((a) => a.zone === zone);
}

export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
