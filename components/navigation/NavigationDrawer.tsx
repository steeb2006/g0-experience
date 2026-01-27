"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { Text } from "@/components/smart-objects/atomics";
import { OrgSwitcher } from "./OrgSwitcher";
import { WorkspaceTree } from "./WorkspaceTree";
import { useNavigationStore, useCommandPaletteStore } from "@/lib/stores";
import { organization, workspaces } from "@/lib/mock-data/organization";

interface NavigationDrawerProps {
  className?: string;
}

export function NavigationDrawer({ className }: NavigationDrawerProps) {
  const { isDrawerOpen, closeDrawer } = useNavigationStore();
  const { open: openCommandPalette } = useCommandPaletteStore();

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    },
    [isDrawerOpen, closeDrawer]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleSearchClick = () => {
    closeDrawer();
    openCommandPalette();
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "fixed left-0 top-0 z-50 flex h-full w-80 flex-col",
              "border-r border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-base)]",
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[var(--g0-bg-elevated-3)] p-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={closeDrawer}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Text variant="body" className="font-medium">
                Back
              </Text>
            </div>

            {/* Content */}
            <div data-scrollable="true" className="flex-1 overflow-y-auto p-4">
              {/* Organization Switcher */}
              <OrgSwitcher organization={organization} className="mb-6" />

              {/* Workspaces */}
              <Text
                variant="small"
                color="muted"
                className="mb-3 px-2 uppercase tracking-wider"
              >
                Workspaces
              </Text>

              <div className="space-y-3">
                {workspaces.map((workspace) => (
                  <WorkspaceTree key={workspace.id} workspace={workspace} />
                ))}
              </div>
            </div>

            {/* Footer: Search */}
            <div className="border-t border-[var(--g0-bg-elevated-3)] p-4">
              <button
                onClick={handleSearchClick}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)] px-3 py-2.5 text-left",
                  "transition-colors hover:bg-[var(--g0-bg-elevated-2)]"
                )}
              >
                <Search className="h-4 w-4 text-[var(--g0-text-muted)]" />
                <Text variant="body" color="muted" className="flex-1">
                  Search everything...
                </Text>
                <div className="flex items-center gap-1 rounded bg-[var(--g0-bg-elevated-3)] px-1.5 py-0.5">
                  <Command className="h-3 w-3 text-[var(--g0-text-muted)]" />
                  <Text variant="small" color="muted">
                    K
                  </Text>
                </div>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
