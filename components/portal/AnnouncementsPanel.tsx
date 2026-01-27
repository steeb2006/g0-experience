"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { portalAnnouncements, type PortalAnnouncement } from "@/lib/mock-data/portal";
import { AlertTriangle, Star, Info, Megaphone } from "lucide-react";

function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

interface AnnouncementItemProps {
  announcement: PortalAnnouncement;
  onClick?: () => void;
}

function AnnouncementItem({ announcement, onClick }: AnnouncementItemProps) {
  const getIcon = () => {
    switch (announcement.type) {
      case "critical":
        return <AlertTriangle className="h-3.5 w-3.5 text-[var(--g0-accent-amber)]" />;
      case "highlight":
        return <Star className="h-3.5 w-3.5 text-[var(--g0-accent-violet)]" />;
      case "info":
        return <Info className="h-3.5 w-3.5 text-[var(--g0-text-tertiary)]" />;
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-2.5 rounded-lg",
        "hover:bg-[var(--g0-bg-elevated-2)] transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g0-accent-amber)]"
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 flex-shrink-0">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[var(--g0-text-primary)] leading-snug">
            {announcement.title}
          </p>
          <p className="text-xs text-[var(--g0-text-tertiary)] mt-1">
            {announcement.entitySource} • {getRelativeTime(announcement.timestamp)}
          </p>
        </div>
      </div>
    </button>
  );
}

export function AnnouncementsPanel() {
  const router = useRouter();

  const handleAnnouncementClick = (announcement: PortalAnnouncement) => {
    if (announcement.linkTo) {
      router.push(announcement.linkTo);
    }
  };

  return (
    <div className="rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)] p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <Megaphone className="h-3.5 w-3.5 text-[var(--g0-text-tertiary)]" />
        <h3 className="text-xs font-medium text-[var(--g0-text-tertiary)] uppercase tracking-wider">
          Announcements
        </h3>
      </div>

      <div className="space-y-1">
        {portalAnnouncements.map((announcement) => (
          <AnnouncementItem
            key={announcement.id}
            announcement={announcement}
            onClick={() => handleAnnouncementClick(announcement)}
          />
        ))}
      </div>
    </div>
  );
}
