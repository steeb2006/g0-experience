"use client";

import { useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/smart-objects/atomics";
import { CommandList } from "./CommandList";
import {
  useCommandPaletteStore,
  useNavigationStore,
  useChatStore,
  useCanvasStore,
  type Command as CommandType,
} from "@/lib/stores";
import { workspaces } from "@/lib/mock-data/organization";

interface CommandPaletteProps {
  className?: string;
}

export function CommandPalette({ className }: CommandPaletteProps) {
  const {
    isOpen,
    close,
    searchQuery,
    setSearchQuery,
    selectedIndex,
    setSelectedIndex,
    moveUp,
    moveDown,
  } = useCommandPaletteStore();

  const { toggleDrawer, setCurrentBoard, closeDrawer, clearBreadcrumb } =
    useNavigationStore();
  const { togglePanel: toggleChat } = useChatStore();
  const { resetZoom } = useCanvasStore();

  // Build commands list
  const allCommands: CommandType[] = useMemo(() => {
    const commands: CommandType[] = [];

    // Board commands
    workspaces.forEach((workspace) => {
      workspace.boards.forEach((board) => {
        commands.push({
          id: board.id,
          label: board.name,
          category: "boards",
          icon: board.icon || "LayoutDashboard",
          action: () => {
            clearBreadcrumb();
            setCurrentBoard(board.id);
            closeDrawer();
            close();
          },
        });

        // Sub-boards
        board.subBoards?.forEach((subBoard) => {
          commands.push({
            id: subBoard.id,
            label: `${board.name} / ${subBoard.name}`,
            category: "boards",
            icon: subBoard.icon || "LayoutDashboard",
            action: () => {
              clearBreadcrumb();
              setCurrentBoard(subBoard.id);
              closeDrawer();
              close();
            },
          });
        });
      });
    });

    // Action commands
    commands.push({
      id: "action_new_board",
      label: "Create new board",
      category: "actions",
      icon: "Plus",
      shortcut: "⌘N",
      action: () => {
        close();
        // TODO: Implement new board creation
      },
    });

    commands.push({
      id: "action_toggle_chat",
      label: "Toggle chat panel",
      category: "actions",
      icon: "MessageSquare",
      shortcut: "⌘J",
      action: () => {
        toggleChat();
        close();
      },
    });

    commands.push({
      id: "action_toggle_sidebar",
      label: "Toggle navigation",
      category: "actions",
      icon: "PanelLeft",
      shortcut: "⌘B",
      action: () => {
        toggleDrawer();
        close();
      },
    });

    commands.push({
      id: "action_zoom_fit",
      label: "Zoom to fit",
      category: "actions",
      icon: "Maximize",
      shortcut: "⌘0",
      action: () => {
        resetZoom();
        close();
      },
    });

    // Entity commands
    commands.push({
      id: "entity_quarterly_report",
      label: "Generate quarterly report",
      category: "entity",
      icon: "FileText",
      action: () => {
        toggleChat();
        close();
        // TODO: Trigger report generation
      },
    });

    commands.push({
      id: "entity_cash_position",
      label: "Show cash position",
      category: "entity",
      icon: "DollarSign",
      action: () => {
        toggleChat();
        close();
        // TODO: Trigger cash position query
      },
    });

    return commands;
  }, [
    clearBreadcrumb,
    setCurrentBoard,
    closeDrawer,
    close,
    toggleChat,
    toggleDrawer,
    resetZoom,
  ]);

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) return allCommands;

    const query = searchQuery.toLowerCase();
    return allCommands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(query) ||
        cmd.category.toLowerCase().includes(query)
    );
  }, [allCommands, searchQuery]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          moveDown(filteredCommands.length - 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          moveUp();
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          break;
        case "Escape":
          e.preventDefault();
          close();
          break;
      }
    },
    [isOpen, filteredCommands, selectedIndex, moveDown, moveUp, close]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleSelect = (command: CommandType) => {
    command.action();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2",
              "rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)] shadow-2xl",
              className
            )}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 border-b border-[var(--g0-bg-elevated-3)] px-4 py-3">
              <div className="flex items-center gap-1 rounded bg-[var(--g0-bg-elevated-3)] px-1.5 py-0.5">
                <Command className="h-3 w-3 text-[var(--g0-text-muted)]" />
                <Text variant="small" color="muted">
                  K
                </Text>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search commands..."
                autoFocus
                className={cn(
                  "flex-1 bg-transparent text-sm",
                  "text-[var(--g0-text-primary)] placeholder:text-[var(--g0-text-muted)]",
                  "focus:outline-none"
                )}
              />
              <Search className="h-4 w-4 text-[var(--g0-text-muted)]" />
            </div>

            {/* Command List */}
            <CommandList
              commands={filteredCommands}
              selectedIndex={selectedIndex}
              onSelect={handleSelect}
            />

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[var(--g0-bg-elevated-3)] px-4 py-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="rounded bg-[var(--g0-bg-elevated-3)] px-1.5 py-0.5 text-[10px] text-[var(--g0-text-muted)]">
                    ↑
                  </kbd>
                  <kbd className="rounded bg-[var(--g0-bg-elevated-3)] px-1.5 py-0.5 text-[10px] text-[var(--g0-text-muted)]">
                    ↓
                  </kbd>
                  <Text variant="small" color="muted" className="ml-1">
                    Navigate
                  </Text>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="rounded bg-[var(--g0-bg-elevated-3)] px-1.5 py-0.5 text-[10px] text-[var(--g0-text-muted)]">
                    ↵
                  </kbd>
                  <Text variant="small" color="muted" className="ml-1">
                    Select
                  </Text>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="rounded bg-[var(--g0-bg-elevated-3)] px-1.5 py-0.5 text-[10px] text-[var(--g0-text-muted)]">
                  Esc
                </kbd>
                <Text variant="small" color="muted" className="ml-1">
                  Close
                </Text>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
