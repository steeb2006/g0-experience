"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/smart-objects/atomics";
import { BoardItem } from "./BoardItem";
import { useNavigationStore } from "@/lib/stores";
import type { Workspace } from "@/lib/mock-data/organization";
import { organization } from "@/lib/mock-data/organization";

interface WorkspaceTreeProps {
  workspace: Workspace;
  className?: string;
}

// Helper to get/set expanded state from localStorage
const STORAGE_KEY = "g0-workspace-expanded";

function getStoredExpandedState(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function setStoredExpandedState(workspaceId: string, expanded: boolean) {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredExpandedState();
    current[workspaceId] = expanded;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // Ignore storage errors
  }
}

export function WorkspaceTree({ workspace, className }: WorkspaceTreeProps) {
  // Start collapsed (false), then load from localStorage
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    const storedState = getStoredExpandedState();
    if (storedState[workspace.id] !== undefined) {
      setIsExpanded(storedState[workspace.id]);
    }
    setIsHydrated(true);
  }, [workspace.id]);

  // Persist state when it changes (after hydration)
  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    setStoredExpandedState(workspace.id, newState);
  };
  const router = useRouter();
  const { currentBoardId, setCurrentBoard, setCurrentWorkspace, closeDrawer, clearBreadcrumb } =
    useNavigationStore();

  const handleBoardClick = (boardId: string) => {
    clearBreadcrumb();
    setCurrentWorkspace(workspace.id);
    setCurrentBoard(boardId);
    closeDrawer();
    // Navigate to the new URL
    router.push(`/${organization.slug}/${workspace.id}/${boardId}`);
  };

  // Check if any board in this workspace is active
  const hasActiveBoard = workspace.boards.some((board) => {
    if (board.id === currentBoardId) return true;
    return board.subBoards?.some((sb) => sb.id === currentBoardId);
  });

  return (
    <div className={cn("rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)] p-3", className)}>
      {/* Workspace Header */}
      <button
        onClick={handleToggle}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors",
          "hover:bg-[var(--g0-bg-elevated-2)]"
        )}
      >
        {/* Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--g0-accent-violet)]/20">
          <User className="h-4 w-4 text-[var(--g0-accent-violet)]" />
        </div>

        {/* Workspace info */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="text-[14px] text-[var(--g0-text-primary)] font-medium truncate">
            {workspace.name}
          </div>
          <div className="text-[12px] text-[var(--g0-text-muted)] truncate">
            Entity: {workspace.entityOwner.name}
          </div>
        </div>

        {/* Expand/collapse icon */}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-[var(--g0-text-muted)] transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {/* Divider */}
      {isExpanded && (
        <div className="my-2 h-px bg-[var(--g0-bg-elevated-3)]" />
      )}

      {/* Board List */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-1">
              {workspace.boards.map((board) => (
                <div key={board.id}>
                  <BoardItem
                    board={board}
                    isActive={board.id === currentBoardId}
                    onClick={() => handleBoardClick(board.id)}
                  />

                  {/* Sub-boards */}
                  {board.subBoards && board.subBoards.length > 0 && (
                    <div className="ml-5 space-y-1 border-l border-[var(--g0-bg-elevated-3)] pl-3">
                      {board.subBoards.map((subBoard) => (
                        <BoardItem
                          key={subBoard.id}
                          board={subBoard}
                          isActive={subBoard.id === currentBoardId}
                          onClick={() => handleBoardClick(subBoard.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
