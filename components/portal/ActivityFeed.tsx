"use client";

import { cn } from "@/lib/utils";
import { activityEvents, type ActivityEvent } from "@/lib/mock-data/portal";
import { Activity, FileText, AlertCircle, RefreshCw } from "lucide-react";

interface ActivityItemProps {
  event: ActivityEvent;
}

function ActivityItem({ event }: ActivityItemProps) {
  const getIcon = () => {
    switch (event.type) {
      case "entity_action":
        return <Activity className="h-3.5 w-3.5" />;
      case "artifact_created":
        return <FileText className="h-3.5 w-3.5" />;
      case "alert":
        return <AlertCircle className="h-3.5 w-3.5" />;
      default:
        return <RefreshCw className="h-3.5 w-3.5" />;
    }
  };

  const getIconColor = () => {
    switch (event.type) {
      case "entity_action":
        return "text-[var(--g0-accent-violet)]";
      case "artifact_created":
        return "text-[var(--g0-accent-amber)]";
      case "alert":
        return "text-[var(--g0-status-warning)]";
      default:
        return "text-[var(--g0-text-tertiary)]";
    }
  };

  const isLive = event.relativeTime === "Now";

  return (
    <div className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
      {/* Timestamp */}
      <div className="w-12 flex-shrink-0">
        <span
          className={cn(
            "text-xs",
            isLive
              ? "text-[var(--g0-status-success)]"
              : "text-[var(--g0-text-tertiary)]"
          )}
        >
          {isLive && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--g0-status-success)] mr-1 animate-pulse" />
          )}
          {event.relativeTime}
        </span>
      </div>

      {/* Icon */}
      <div className={cn("mt-0.5 flex-shrink-0", getIconColor())}>{getIcon()}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--g0-text-primary)] leading-snug">
          {event.description}
        </p>
        <p className="text-xs text-[var(--g0-text-tertiary)] mt-0.5">
          {event.workspace} › {event.board}
        </p>
      </div>
    </div>
  );
}

export function ActivityFeed() {
  // Show only first 4 events for compact display
  const displayEvents = activityEvents.slice(0, 4);

  return (
    <div className="rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)] p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-3.5 w-3.5 text-[var(--g0-accent-violet)]" />
        <h3 className="text-xs font-medium text-[var(--g0-text-tertiary)] uppercase tracking-wider">
          Activity Feed
        </h3>
      </div>

      <div className="divide-y divide-[var(--g0-bg-elevated-3)]">
        {displayEvents.map((event) => (
          <ActivityItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
