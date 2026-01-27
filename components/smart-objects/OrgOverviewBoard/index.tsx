"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { OrgRadialView } from "./OrgRadialView";
import { getOrgOverviewData, organization } from "@/lib/mock-data/organization";
import { useNavigationStore } from "@/lib/stores";

interface OrgOverviewBoardProps {
  className?: string;
}

export function OrgOverviewBoard({ className }: OrgOverviewBoardProps) {
  const router = useRouter();
  const overviewData = getOrgOverviewData();
  const { setCurrentWorkspace, setCurrentBoard, closeDrawer, clearBreadcrumb } = useNavigationStore();

  const handleWorkspaceClick = (workspaceId: string) => {
    // Navigate to first board in workspace
    const workspace = overviewData.workspaces.find((ws) => ws.id === workspaceId);
    if (workspace && workspace.boards.length > 0) {
      const firstBoard = workspace.boards[0];
      clearBreadcrumb();
      setCurrentWorkspace(workspaceId);
      setCurrentBoard(firstBoard.id);
      closeDrawer();
      router.push(`/${organization.slug}/${workspaceId}/${firstBoard.id}`);
    }
  };

  const handleBoardClick = (workspaceId: string, boardId: string) => {
    clearBreadcrumb();
    setCurrentWorkspace(workspaceId);
    setCurrentBoard(boardId);
    closeDrawer();
    router.push(`/${organization.slug}/${workspaceId}/${boardId}`);
  };

  const handleSubBoardClick = (workspaceId: string, boardId: string) => {
    // Sub-boards use parent board navigation (same route pattern)
    clearBreadcrumb();
    setCurrentWorkspace(workspaceId);
    setCurrentBoard(boardId);
    closeDrawer();
    router.push(`/${organization.slug}/${workspaceId}/${boardId}`);
  };

  return (
    <motion.div
      className={cn("flex items-center justify-center w-full h-full min-h-[600px]", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <OrgRadialView
        data={overviewData}
        onWorkspaceClick={handleWorkspaceClick}
        onBoardClick={handleBoardClick}
        onSubBoardClick={handleSubBoardClick}
      />
    </motion.div>
  );
}
