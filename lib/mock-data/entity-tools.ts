// Centralized tool registry for all entities
// Tools are discovered at board load based on the bound entity

export interface ToolParameter {
  name: string;
  type: "string" | "number" | "boolean";
  required?: boolean;
  default?: string | number | boolean;
}

export interface EntityTool {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string; // Lucide icon name
  parameters?: ToolParameter[];
}

// co-CFO Tools (Finance)
export const cfoTools: EntityTool[] = [
  {
    id: "tool_quarterly_report",
    name: "generate_quarterly_report",
    displayName: "Generate Quarterly Report",
    icon: "FileText",
    description: "Create comprehensive quarterly financial report",
    parameters: [
      { name: "quarter", type: "string", required: true },
      { name: "year", type: "number", required: true },
      { name: "include_projections", type: "boolean", default: false },
    ],
  },
  {
    id: "tool_analyze_portfolio",
    name: "analyze_portfolio",
    displayName: "Analyze Portfolio",
    icon: "PieChart",
    description: "Deep dive into investment holdings and risk metrics",
    parameters: [
      { name: "portfolio_id", type: "string", required: true },
      { name: "time_range", type: "string", default: "1Y" },
    ],
  },
  {
    id: "tool_cash_projection",
    name: "project_cash_flow",
    displayName: "Project Cash Flow",
    icon: "TrendingUp",
    description: "Forecast cash position over time",
    parameters: [
      { name: "months_ahead", type: "number", default: 12 },
      { name: "scenario", type: "string", default: "baseline" },
    ],
  },
  {
    id: "tool_budget_variance",
    name: "calculate_budget_variance",
    displayName: "Calculate Budget Variance",
    icon: "Calculator",
    description: "Compare actuals vs budget with variance analysis",
    parameters: [
      { name: "cost_center", type: "string", required: false },
      { name: "period", type: "string", required: true },
    ],
  },
];

// co-CHRO Tools (HR)
export const chroTools: EntityTool[] = [
  {
    id: "tool_org_chart",
    name: "generate_org_chart",
    displayName: "Generate Org Chart",
    icon: "Network",
    description: "Create visual organization chart",
    parameters: [
      { name: "department", type: "string", required: false },
      { name: "depth", type: "number", default: 2 },
    ],
  },
  {
    id: "tool_engagement",
    name: "analyze_engagement",
    displayName: "Analyze Engagement",
    icon: "Heart",
    description: "Analyze pulse survey results and sentiment",
    parameters: [
      { name: "period", type: "string", required: true },
      { name: "department", type: "string", required: false },
    ],
  },
  {
    id: "tool_flight_risk",
    name: "identify_flight_risk",
    displayName: "Identify Flight Risk",
    icon: "AlertTriangle",
    description: "Flag employees at risk of leaving",
    parameters: [
      { name: "threshold", type: "string", default: "medium" },
      { name: "department", type: "string", required: false },
    ],
  },
  {
    id: "tool_hiring_plan",
    name: "create_hiring_plan",
    displayName: "Create Hiring Plan",
    icon: "UserPlus",
    description: "Generate recruiting plan with timeline",
    parameters: [
      { name: "department", type: "string", required: true },
      { name: "headcount", type: "number", required: true },
      { name: "timeline", type: "string", default: "Q2" },
    ],
  },
  {
    id: "tool_compensation",
    name: "compensation_analysis",
    displayName: "Compensation Analysis",
    icon: "DollarSign",
    description: "Market salary comparison and benchmarking",
    parameters: [
      { name: "role", type: "string", required: true },
      { name: "level", type: "string", required: false },
      { name: "location", type: "string", default: "US" },
    ],
  },
  {
    id: "tool_diversity",
    name: "diversity_report",
    displayName: "Diversity Report",
    icon: "Users",
    description: "D&I metrics breakdown by department",
    parameters: [
      { name: "period", type: "string", required: true },
      { name: "breakdown", type: "string", default: "department" },
    ],
  },
];

// co-CSO Tools (Sales)
export const csoTools: EntityTool[] = [
  {
    id: "tool_campaign_report",
    name: "generate_campaign_report",
    displayName: "Campaign Report",
    icon: "Megaphone",
    description: "Generate campaign performance report",
    parameters: [
      { name: "campaign_id", type: "string", required: false },
      { name: "period", type: "string", default: "current" },
    ],
  },
  {
    id: "tool_lead_analysis",
    name: "analyze_leads",
    displayName: "Analyze Leads",
    icon: "Target",
    description: "Analyze lead quality and sources",
    parameters: [
      { name: "source", type: "string", required: false },
      { name: "date_range", type: "string", default: "30d" },
    ],
  },
  {
    id: "tool_customer_health",
    name: "check_customer_health",
    displayName: "Customer Health",
    icon: "HeartPulse",
    description: "Review customer health scores",
    parameters: [
      { name: "segment", type: "string", required: false },
      { name: "threshold", type: "number", default: 70 },
    ],
  },
  {
    id: "tool_churn_risk",
    name: "identify_churn_risk",
    displayName: "Churn Risk Analysis",
    icon: "AlertCircle",
    description: "Identify customers at risk of churning",
    parameters: [
      { name: "days_ahead", type: "number", default: 90 },
      { name: "segment", type: "string", required: false },
    ],
  },
  {
    id: "tool_expansion",
    name: "find_expansion_opportunities",
    displayName: "Expansion Opportunities",
    icon: "Sparkles",
    description: "Find upsell and cross-sell opportunities",
    parameters: [
      { name: "min_potential", type: "number", default: 50000 },
      { name: "segment", type: "string", required: false },
    ],
  },
];

// co-COO Tools (Operations) - empty for now to test empty state
export const cooTools: EntityTool[] = [];

// Entity tools registry - lookup by entity name
export const entityToolsRegistry: Record<string, EntityTool[]> = {
  "co-CFO": cfoTools,
  "co-CHRO": chroTools,
  "co-CSO": csoTools,
  "co-COO": cooTools,
};

/**
 * Get tools available for a specific entity
 */
export function getToolsForEntity(entityName: string): EntityTool[] {
  return entityToolsRegistry[entityName] || [];
}

/**
 * Get a specific tool by ID across all entities
 */
export function getToolById(toolId: string): EntityTool | undefined {
  for (const tools of Object.values(entityToolsRegistry)) {
    const tool = tools.find((t) => t.id === toolId);
    if (tool) return tool;
  }
  return undefined;
}

/**
 * Check if an entity has any tools available
 */
export function entityHasTools(entityName: string): boolean {
  return getToolsForEntity(entityName).length > 0;
}
