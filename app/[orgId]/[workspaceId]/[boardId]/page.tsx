"use client";

import { useEffect, useState } from "react";
import { G0Canvas } from "@/components/canvas";
import { WorkspaceZone } from "@/components/canvas/WorkspaceZone";
import { FinanceKPIDashboard, HRDashboard, ForecastDashboard, LaunchCampaignDashboard, CustomersDashboard, Customer360View, RecruitingDashboard } from "@/components/smart-objects";
import { NavigationDrawer } from "@/components/navigation";
import { ChatPanel, ChatToggleButton } from "@/components/chat";
import { CommandPalette } from "@/components/command-palette";
import { SmartObjectOverlay } from "@/components/overlays";
import { useNavigationStore } from "@/lib/stores";
import { findWorkspaceByBoardId } from "@/lib/mock-data/organization";

interface BoardPageProps {
  params: Promise<{
    orgId: string;
    workspaceId: string;
    boardId: string;
  }>;
}

export default function BoardPage({ params }: BoardPageProps) {
  const { setCurrentOrg, setCurrentWorkspace, setCurrentBoard, currentWorkspaceId, currentBoardId } =
    useNavigationStore();
  const [resolvedParams, setResolvedParams] = useState<{
    orgId: string;
    workspaceId: string;
    boardId: string;
  } | null>(null);

  // Sync URL params with store
  useEffect(() => {
    params.then((p) => {
      setResolvedParams(p);
      setCurrentOrg(p.orgId);
      setCurrentWorkspace(p.workspaceId);
      setCurrentBoard(p.boardId);
    });
  }, [params, setCurrentOrg, setCurrentWorkspace, setCurrentBoard]);

  // Determine which dashboard to render based on workspace and board
  const renderSmartObject = () => {
    // Use resolved params or current store state
    const workspaceId = resolvedParams?.workspaceId || currentWorkspaceId;
    const boardId = resolvedParams?.boardId || currentBoardId;

    // Also check workspace from board ID (for sub-board navigation)
    const workspace = findWorkspaceByBoardId(boardId);
    const effectiveWorkspaceId = workspace?.id || workspaceId;

    // Check for specific boards first
    if (boardId === "board_forecast") {
      return <ForecastDashboard />;
    }

    // Sales workspace boards
    if (boardId === "board_launch_campaign" || boardId?.startsWith("board_campaign_")) {
      return <LaunchCampaignDashboard />;
    }
    // Customer 360View
    if (boardId === "board_customer_360") {
      return <Customer360View />;
    }
    if (boardId === "board_customers" || boardId?.startsWith("board_customer_")) {
      return <CustomersDashboard />;
    }

    // HR workspace - specific boards
    if (boardId === "board_recruiting") {
      return <RecruitingDashboard />;
    }

    // HR workspace - default
    if (effectiveWorkspaceId === "ws_hr") {
      return <HRDashboard />;
    }

    // Experimental workspace - placeholder for schema testing
    if (effectiveWorkspaceId === "ws_experimental") {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 rounded-2xl border border-dashed border-pink-500/30 bg-pink-500/5">
          <div className="text-pink-500 text-6xl mb-4">🧪</div>
          <h2 className="text-2xl font-semibold text-white mb-2">Experimental Board</h2>
          <p className="text-neutral-400 text-center max-w-md mb-4">
            This is the sandbox for testing schema-driven Smart Objects.
          </p>
          <div className="text-sm text-neutral-500 font-mono bg-neutral-900 px-4 py-2 rounded-lg">
            Board: {boardId}
          </div>
        </div>
      );
    }

    // Default to Finance dashboard
    return <FinanceKPIDashboard />;
  };

  // Get entity name for chat panel
  const getEntityName = () => {
    const workspaceId = resolvedParams?.workspaceId || currentWorkspaceId;
    const boardId = resolvedParams?.boardId || currentBoardId;
    const workspace = findWorkspaceByBoardId(boardId);
    const effectiveWorkspaceId = workspace?.id || workspaceId;

    if (effectiveWorkspaceId === "ws_hr") {
      return "co-CHRO";
    }
    if (effectiveWorkspaceId === "ws_sales") {
      return "co-CSO";
    }
    if (effectiveWorkspaceId === "ws_experimental") {
      return "co-Lab";
    }
    return "co-CFO";
  };

  return (
    <main className="h-screen w-screen overflow-hidden">
      {/* Canvas with Smart Object */}
      <G0Canvas>
        <div className="relative w-full max-w-[1200px] mx-auto">
          {/* Shared Workspace Zone - above smart object */}
          <WorkspaceZone zone="shared" className="w-full min-h-[250px] mb-6" />

          {/* Smart Object - centered in viewport */}
          <div className="flex justify-center">
            {renderSmartObject()}
          </div>

          {/* Private Workspace Zone - below smart object */}
          <WorkspaceZone zone="private" className="w-full min-h-[250px] mt-6" />
        </div>
      </G0Canvas>

      {/* Navigation Drawer */}
      <NavigationDrawer />

      {/* Chat Panel */}
      <ChatPanel entityName={getEntityName()} />

      {/* Chat Toggle Button */}
      <ChatToggleButton />

      {/* Command Palette */}
      <CommandPalette />

      {/* Smart Object Overlay */}
      <SmartObjectOverlay />
    </main>
  );
}
