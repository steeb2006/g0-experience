"use client";

import { workspaceSummaries } from "@/lib/mock-data/portal";
import { organization } from "@/lib/mock-data/organization";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { PortalHeader } from "./PortalHeader";
import { TimeGreeting } from "./TimeGreeting";
import { WorkspaceCard } from "./WorkspaceCard";
import { OrgHealthScore } from "./OrgHealthScore";
import { AnnouncementsPanel } from "./AnnouncementsPanel";
import { ActivityFeed } from "./ActivityFeed";
import { TrendingMetrics } from "./TrendingMetrics";
import { QuickActionsBar } from "./QuickActionsBar";
import { RecentBoards } from "./RecentBoards";
import { CrossWorkspaceInsights } from "./CrossWorkspaceInsights";

export function PortalHomepage() {
  const orgId = organization.id;

  return (
    <div className="min-h-screen bg-[var(--g0-bg-base)]">
      <PortalHeader />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Greeting */}
        <section>
          <TimeGreeting userName="Stefan" />
        </section>

        {/* Workspace Cards */}
        <section>
          <h2 className="text-xs font-medium text-[var(--g0-text-tertiary)] uppercase tracking-wider mb-4">
            Workspaces
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {workspaceSummaries.map((workspace) => (
              <WorkspaceCard
                key={workspace.id}
                workspace={workspace}
                orgId={orgId}
              />
            ))}
          </div>
        </section>

        {/* Row 1: Health, Activity, Trending, Recent */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-3">
            <OrgHealthScore />
          </div>
          <div className="lg:col-span-3">
            <ActivityFeed />
          </div>
          <div className="lg:col-span-3">
            <TrendingMetrics />
          </div>
          <div className="lg:col-span-3">
            <RecentBoards />
          </div>
        </section>

        {/* Row 2: Announcements, Insights, Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-3">
            <AnnouncementsPanel />
          </div>
          <div className="lg:col-span-6">
            <CrossWorkspaceInsights />
          </div>
          <div className="lg:col-span-3">
            <QuickActionsBar orgId={orgId} />
          </div>
        </section>
      </main>

      {/* Command Palette */}
      <CommandPalette />
    </div>
  );
}
