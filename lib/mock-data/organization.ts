export interface Entity {
  id: string;
  name: string;
  avatar: string;
}

export interface Board {
  id: string;
  name: string;
  icon?: string;
  smartObject?: {
    schemaUri: string;
  };
  subBoards?: Board[];
}

export interface Workspace {
  id: string;
  name: string;
  entityOwner: Entity;
  boards: Board[];
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

export const organization: Organization = {
  id: "org_sns",
  name: "SNS",
  slug: "sns",
};

export const workspaces: Workspace[] = [
  {
    id: "ws_finance",
    name: "Finance",
    entityOwner: {
      id: "entity_cfo",
      name: "co-CFO",
      avatar: "/avatars/cfo.png",
    },
    boards: [
      {
        id: "board_overview",
        name: "Finance Overview",
        icon: "LayoutDashboard",
        smartObject: {
          schemaUri: "g0://smart-objects/finance-kpi-dashboard@1.0",
        },
        subBoards: [
          {
            id: "board_controlling",
            name: "Controlling",
            icon: "PieChart",
            smartObject: {
              schemaUri: "g0://smart-objects/cost-center-analysis@1.0",
            },
          },
          {
            id: "board_cash",
            name: "Cash Flow",
            icon: "Banknote",
            smartObject: {
              schemaUri: "g0://smart-objects/cash-flow-overview@1.0",
            },
          },
          {
            id: "board_hr",
            name: "HR Costs",
            icon: "Users",
            smartObject: {
              schemaUri: "g0://smart-objects/headcount-costs@1.0",
            },
          },
          {
            id: "board_forecast",
            name: "Forecast",
            icon: "TrendingUp",
            smartObject: {
              schemaUri: "g0://smart-objects/financial-projections@1.0",
            },
          },
        ],
      },
    ],
  },
  {
    id: "ws_hr",
    name: "Human Resources",
    entityOwner: {
      id: "entity_chro",
      name: "co-CHRO",
      avatar: "/avatars/chro.png",
    },
    boards: [
      {
        id: "board_hr_overview",
        name: "People & Culture",
        icon: "Users",
        smartObject: {
          schemaUri: "g0://smart-objects/hr-dashboard@1.0",
        },
        subBoards: [
          {
            id: "board_recruiting",
            name: "Recruiting",
            icon: "UserPlus",
            smartObject: {
              schemaUri: "g0://smart-objects/recruiting-dashboard@1.0",
            },
          },
          {
            id: "board_compensation",
            name: "Compensation",
            icon: "Coins",
            smartObject: {
              schemaUri: "g0://smart-objects/compensation-dashboard@1.0",
            },
          },
          {
            id: "board_learning",
            name: "Learning",
            icon: "GraduationCap",
            smartObject: {
              schemaUri: "g0://smart-objects/learning-dashboard@1.0",
            },
          },
          {
            id: "board_offboard",
            name: "Offboarding",
            icon: "UserMinus",
            smartObject: {
              schemaUri: "g0://smart-objects/offboarding-dashboard@1.0",
            },
          },
        ],
      },
    ],
  },
  {
    id: "ws_sales",
    name: "Sales",
    entityOwner: {
      id: "entity_cso",
      name: "co-CSO",
      avatar: "/avatars/cso.png",
    },
    boards: [
      {
        id: "board_launch_campaign",
        name: "Launch Campaign",
        icon: "Rocket",
        smartObject: {
          schemaUri: "g0://smart-objects/launch-campaign@1.0",
        },
        subBoards: [
          {
            id: "board_campaign_planning",
            name: "Planning",
            icon: "Calendar",
            smartObject: {
              schemaUri: "g0://smart-objects/campaign-planning@1.0",
            },
          },
          {
            id: "board_campaign_execution",
            name: "Execution",
            icon: "Play",
            smartObject: {
              schemaUri: "g0://smart-objects/campaign-execution@1.0",
            },
          },
          {
            id: "board_campaign_analytics",
            name: "Analytics",
            icon: "BarChart3",
            smartObject: {
              schemaUri: "g0://smart-objects/campaign-analytics@1.0",
            },
          },
        ],
      },
      {
        id: "board_customers",
        name: "Customers",
        icon: "Building2",
        smartObject: {
          schemaUri: "g0://smart-objects/customers-overview@1.0",
        },
        subBoards: [
          {
            id: "board_customer_360",
            name: "360View",
            icon: "Radar",
            smartObject: {
              schemaUri: "g0://smart-objects/customer-360view@1.0",
            },
          },
          {
            id: "board_customer_health",
            name: "Health Scores",
            icon: "Heart",
            smartObject: {
              schemaUri: "g0://smart-objects/customer-health@1.0",
            },
          },
          {
            id: "board_customer_expansion",
            name: "Expansion",
            icon: "TrendingUp",
            smartObject: {
              schemaUri: "g0://smart-objects/customer-expansion@1.0",
            },
          },
        ],
      },
    ],
  },
  {
    id: "ws_operations",
    name: "Operations",
    entityOwner: {
      id: "entity_coo",
      name: "co-COO",
      avatar: "/avatars/coo.png",
    },
    boards: [
      {
        id: "board_process",
        name: "Process Dashboard",
        icon: "Workflow",
        smartObject: {
          schemaUri: "g0://smart-objects/process-dashboard@1.0",
        },
      },
      {
        id: "board_team",
        name: "Team Overview",
        icon: "Users",
        smartObject: {
          schemaUri: "g0://smart-objects/team-overview@1.0",
        },
      },
    ],
  },
  {
    id: "ws_experimental",
    name: "Experimental",
    entityOwner: {
      id: "entity_lab",
      name: "co-Lab",
      avatar: "/avatars/lab.png",
    },
    boards: [
      {
        id: "board_schema_test",
        name: "Schema Test",
        icon: "FlaskConical",
        smartObject: {
          schemaUri: "g0://smart-objects/client-card@1.0",
        },
      },
      {
        id: "board_atomic_gallery",
        name: "Atomic Gallery",
        icon: "Layers",
        smartObject: {
          schemaUri: "g0://smart-objects/atomic-gallery@1.0",
        },
      },
      {
        id: "board_ocean_radar",
        name: "OCEAN Radar",
        icon: "Radar",
        smartObject: {
          schemaUri: "g0://smart-objects/ocean-radar@1.0",
        },
      },
      {
        id: "board_ceo_dashboard",
        name: "CEO Dashboard",
        icon: "Crown",
        smartObject: {
          schemaUri: "g0://smart-objects/ceo-dashboard@1.0",
        },
      },
    ],
  },
];

export const defaultWorkspace = workspaces[0];
export const defaultBoard = workspaces[0].boards[0];

export function findBoardById(boardId: string): Board | undefined {
  for (const workspace of workspaces) {
    for (const board of workspace.boards) {
      if (board.id === boardId) return board;
      if (board.subBoards) {
        const subBoard = board.subBoards.find((sb) => sb.id === boardId);
        if (subBoard) return subBoard;
      }
    }
  }
  return undefined;
}

export function findWorkspaceByBoardId(boardId: string): Workspace | undefined {
  for (const workspace of workspaces) {
    for (const board of workspace.boards) {
      if (board.id === boardId) return workspace;
      if (board.subBoards?.some((sb) => sb.id === boardId)) return workspace;
    }
  }
  return undefined;
}

export function findParentBoard(boardId: string): Board | undefined {
  for (const workspace of workspaces) {
    for (const board of workspace.boards) {
      if (board.subBoards?.some((sb) => sb.id === boardId)) {
        return board;
      }
    }
  }
  return undefined;
}

// Workspace color mapping
export const workspaceColors: Record<string, string> = {
  ws_finance: "#3b82f6", // blue-500
  ws_hr: "#22c55e", // green-500
  ws_sales: "#a855f7", // purple-500
  ws_operations: "#f97316", // orange-500
  ws_experimental: "#ec4899", // pink-500
};

export function getWorkspaceColor(workspaceId: string): string {
  return workspaceColors[workspaceId] || "#6b7280"; // gray-500 default
}

// Organization overview data for radial visualization
export interface OrgOverviewData {
  org: {
    id: string;
    name: string;
    slug: string;
  };
  workspaces: Array<{
    id: string;
    name: string;
    entity: Entity;
    color: string;
    boards: Array<{
      id: string;
      name: string;
      icon?: string;
      subBoards: Array<{
        id: string;
        name: string;
        icon?: string;
      }>;
    }>;
  }>;
}

export function getOrgOverviewData(): OrgOverviewData {
  return {
    org: {
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
    },
    workspaces: workspaces.map((ws) => ({
      id: ws.id,
      name: ws.name,
      entity: ws.entityOwner,
      color: getWorkspaceColor(ws.id),
      boards: ws.boards.map((board) => ({
        id: board.id,
        name: board.name,
        icon: board.icon,
        subBoards: (board.subBoards || []).map((sb) => ({
          id: sb.id,
          name: sb.name,
          icon: sb.icon,
        })),
      })),
    })),
  };
}
