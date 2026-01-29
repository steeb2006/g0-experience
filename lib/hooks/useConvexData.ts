"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

// Types matching the existing mock data structure for compatibility
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

// Transform Convex data to match existing component expectations
function transformWorkspace(
  workspace: Doc<"workspaces">,
  boards: Doc<"boards">[]
): Workspace {
  // Get root boards (no parent) for this workspace
  const workspaceBoards = boards.filter(
    (b) => b.workspaceId === workspace._id && !b.parentBoardId
  );

  return {
    id: workspace.slug,
    name: workspace.name,
    entityOwner: {
      id: workspace.entityOwnerId,
      name: workspace.entityName,
      avatar: `/avatars/${workspace.entityOwnerId.replace("entity_", "")}.png`,
    },
    boards: workspaceBoards.map((board) => transformBoard(board, boards)),
  };
}

function transformBoard(board: Doc<"boards">, allBoards: Doc<"boards">[]): Board {
  // Find sub-boards
  const subBoards = allBoards.filter((b) => b.parentBoardId === board._id);

  return {
    id: board.slug,
    name: board.name,
    icon: getIconFromSmartObjectType(board.smartObjectType),
    smartObject: board.smartObjectType
      ? { schemaUri: `g0://smart-objects/${board.smartObjectType}@1.0` }
      : undefined,
    subBoards:
      subBoards.length > 0
        ? subBoards.map((sb) => transformBoard(sb, allBoards))
        : undefined,
  };
}

// Map smart object types to icons (matching existing mock data)
function getIconFromSmartObjectType(type?: string): string | undefined {
  if (!type) return undefined;
  const iconMap: Record<string, string> = {
    "finance-kpi-dashboard": "LayoutDashboard",
    "cost-center-analysis": "PieChart",
    "cash-flow-overview": "Banknote",
    "headcount-costs": "Users",
    "forecast-dashboard": "TrendingUp",
    "hr-dashboard": "Users",
    "recruiting-dashboard": "UserPlus",
    "compensation-dashboard": "Coins",
    "learning-dashboard": "GraduationCap",
    "offboarding-dashboard": "UserMinus",
    "launch-campaign-dashboard": "Rocket",
    "campaign-planning": "Calendar",
    "campaign-execution": "Play",
    "campaign-analytics": "BarChart3",
    "customers-overview": "Building2",
    "customer-360": "Radar",
    "customer-health": "Heart",
    "customer-expansion": "TrendingUp",
    "process-dashboard": "Workflow",
    "team-overview": "Users",
    // Experimental workspace
    "client-card": "FlaskConical",
    "atomic-gallery": "Layers",
    "ocean-radar": "Radar",
  };
  return iconMap[type];
}

// Hook to get organization from Convex
export function useOrganization(slug: string = "sns") {
  const org = useQuery(api.organizations.getBySlug, { slug });

  if (org === undefined) {
    return { organization: null, isLoading: true };
  }

  if (org === null) {
    return { organization: null, isLoading: false };
  }

  const organization: Organization = {
    id: `org_${org.slug}`,
    name: org.name,
    slug: org.slug,
  };

  return { organization, isLoading: false };
}

// Hook to get all workspaces with their boards from Convex
export function useWorkspaces() {
  const workspacesData = useQuery(api.workspaces.list);
  const boardsData = useQuery(api.boards.list);

  // Still loading
  if (workspacesData === undefined || boardsData === undefined) {
    return { workspaces: [], isLoading: true };
  }

  // Transform to match existing component format
  const workspaces: Workspace[] = workspacesData.map((ws) =>
    transformWorkspace(ws, boardsData)
  );

  return { workspaces, isLoading: false };
}

// Hook to get a single workspace with boards
export function useWorkspace(slug: string) {
  const workspace = useQuery(api.workspaces.getBySlug, { slug });
  const boardsData = useQuery(api.boards.list);

  if (workspace === undefined || boardsData === undefined) {
    return { workspace: null, isLoading: true };
  }

  if (workspace === null) {
    return { workspace: null, isLoading: false };
  }

  return {
    workspace: transformWorkspace(workspace, boardsData),
    isLoading: false,
  };
}

// Hook to get a board by slug
export function useBoard(slug: string) {
  const board = useQuery(api.boards.getBySlug, { slug });
  const boardsData = useQuery(api.boards.list);

  if (board === undefined || boardsData === undefined) {
    return { board: null, isLoading: true };
  }

  if (board === null) {
    return { board: null, isLoading: false };
  }

  return {
    board: transformBoard(board, boardsData),
    isLoading: false,
  };
}
