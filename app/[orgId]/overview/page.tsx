"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { OrgOverviewBoard } from "@/components/smart-objects/OrgOverviewBoard";
import { G0Canvas } from "@/components/canvas/G0Canvas";
import { NavigationDrawer } from "@/components/navigation/NavigationDrawer";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { useNavigationStore } from "@/lib/stores";

export default function OrgOverviewPage() {
  const { orgId } = useParams();
  const { setCurrentOrg, setCurrentWorkspace, setCurrentBoard, clearBreadcrumb } = useNavigationStore();

  useEffect(() => {
    // Set org context but clear workspace/board since this is org-level view
    setCurrentOrg(orgId as string);
    setCurrentWorkspace("");
    setCurrentBoard("");
    clearBreadcrumb();
  }, [orgId, setCurrentOrg, setCurrentWorkspace, setCurrentBoard, clearBreadcrumb]);

  return (
    <main className="h-screen w-screen overflow-hidden bg-[var(--g0-bg-base)]">
      <G0Canvas>
        <OrgOverviewBoard />
      </G0Canvas>

      {/* Navigation drawer */}
      <NavigationDrawer />

      {/* Command palette */}
      <CommandPalette />
    </main>
  );
}
