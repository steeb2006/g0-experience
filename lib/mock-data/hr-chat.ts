import type { Artifact, ChatMessage, ArtifactType, ZoneType } from "./chat-artifacts";

export const hrSampleArtifacts: Artifact[] = [
  {
    id: "artifact_org_chart",
    type: "chart",
    title: "Organization Chart",
    thumbnail: "/thumbnails/org-chart.png",
    createdAt: "2025-01-15T10:00:00Z",
    zone: "shared",
  },
  {
    id: "artifact_engagement",
    type: "chart",
    title: "Engagement Survey Results",
    thumbnail: "/thumbnails/engagement.png",
    createdAt: "2025-01-18T14:00:00Z",
    zone: "shared",
  },
  {
    id: "artifact_headcount_report",
    type: "pdf",
    title: "Headcount by Department",
    thumbnail: "/thumbnails/headcount.png",
    createdAt: "2025-01-20T09:01:00Z",
    zone: "shared",
  },
];

export const hrSampleChatMessages: ChatMessage[] = [
  {
    id: "hr_msg_1",
    role: "user",
    content: "What's our current headcount by department?",
    timestamp: "2025-01-20T09:00:00Z",
  },
  {
    id: "hr_msg_2",
    role: "entity",
    content: `Here's the current headcount breakdown:

**Total: 156 FTE** (+8 YTD)

| Department | Headcount | Change |
|------------|-----------|--------|
| Engineering | 45 | +3 |
| Sales | 32 | +2 |
| Operations | 28 | +1 |
| Marketing | 15 | +1 |
| Finance | 12 | - |
| HR | 8 | +1 |

Engineering continues to be our fastest growing team. I've prepared a detailed breakdown.`,
    timestamp: "2025-01-20T09:01:00Z",
    artifacts: [
      {
        id: "artifact_headcount_report",
        type: "chart",
        title: "Headcount by Department",
        thumbnail: "/thumbnails/headcount.png",
        createdAt: "2025-01-20T09:01:00Z",
        zone: "shared",
      },
    ],
  },
  {
    id: "hr_msg_3",
    role: "user",
    content: "How is employee engagement looking?",
    timestamp: "2025-01-20T09:15:00Z",
  },
  {
    id: "hr_msg_4",
    role: "entity",
    content: `Employee engagement is strong at **87%**, up 5 points from last quarter.

**Department Breakdown:**
- HR: 95% (highest)
- Engineering: 92%
- Finance: 88%
- Marketing: 85%
- Operations: 81%
- Sales: 78% (needs attention)

**Key Drivers:**
- Work-life balance improved after flexible hours policy
- Manager effectiveness scores up 12%
- Career growth concerns in Sales team

I recommend a focus session with the Sales leadership to address engagement gaps.`,
    timestamp: "2025-01-20T09:16:00Z",
    artifacts: [
      {
        id: "artifact_engagement",
        type: "chart",
        title: "Engagement Survey Results",
        thumbnail: "/thumbnails/engagement.png",
        createdAt: "2025-01-18T14:00:00Z",
        zone: "shared",
      },
    ],
  },
];

// Flight risk response - used when user asks about flight risk
export const flightRiskResponse: ChatMessage = {
  id: "hr_msg_flight_risk",
  role: "entity",
  content: `I've identified **8 employees** with elevated flight risk based on engagement signals, tenure patterns, and recent activity:

**High Risk (3)**
- Jordan Lee (Eng) - No promotion in 3 years, low engagement
- Sam Parker (Sales) - Competitor outreach detected
- Chris Wong (Ops) - Manager conflict flagged

**Medium Risk (5)**
- Taylor Kim (Marketing) - Reduced participation in team events
- Jamie Chen (Eng) - Salary below market, high performer
- Morgan Liu (Sales) - Q4 targets missed, frustration noted
- Casey Brooks (Ops) - Applied internally, rejected twice
- Drew Martinez (Finance) - Commute concerns post-return-to-office

**Recommended Actions:**
1. Schedule 1:1s with high-risk employees
2. Review compensation against market for Jamie Chen
3. Discuss growth opportunities with Jordan Lee
4. Address manager relationship issue for Chris Wong`,
  timestamp: new Date().toISOString(),
  artifacts: [
    {
      id: "artifact_flight_risk",
      type: "table",
      title: "Flight Risk Analysis",
      thumbnail: "/thumbnails/flight-risk.png",
      createdAt: new Date().toISOString(),
      zone: "private",
    },
  ],
};

export const hrEntityTools = [
  {
    id: "tool_org_chart",
    name: "generate_org_chart",
    description: "Create visual organization chart",
    parameters: [
      { name: "department", type: "string", required: false },
      { name: "depth", type: "number", default: 2 },
    ],
  },
  {
    id: "tool_engagement",
    name: "analyze_engagement",
    description: "Analyze pulse survey results",
    parameters: [
      { name: "period", type: "string", required: true },
      { name: "department", type: "string", required: false },
    ],
  },
  {
    id: "tool_flight_risk",
    name: "identify_flight_risk",
    description: "Flag at-risk employees",
    parameters: [
      { name: "threshold", type: "string", default: "medium" },
      { name: "department", type: "string", required: false },
    ],
  },
  {
    id: "tool_hiring_plan",
    name: "create_hiring_plan",
    description: "Generate recruiting plan",
    parameters: [
      { name: "department", type: "string", required: true },
      { name: "headcount", type: "number", required: true },
      { name: "timeline", type: "string", default: "Q2" },
    ],
  },
  {
    id: "tool_compensation",
    name: "compensation_analysis",
    description: "Market salary comparison",
    parameters: [
      { name: "role", type: "string", required: true },
      { name: "level", type: "string", required: false },
      { name: "location", type: "string", default: "US" },
    ],
  },
  {
    id: "tool_diversity",
    name: "diversity_report",
    description: "D&I metrics breakdown",
    parameters: [
      { name: "period", type: "string", required: true },
      { name: "breakdown", type: "string", default: "department" },
    ],
  },
];
