"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { G0Logo } from "@/components/canvas/G0Logo";
import { useCommandPaletteStore } from "@/lib/stores/command-palette";
import { usePortalStore } from "@/lib/stores/portal";
import { Bell, Search, Settings } from "lucide-react";

interface NotificationBellProps {
  count: number;
  isOpen: boolean;
  onToggle: () => void;
}

function NotificationBell({ count, isOpen, onToggle }: NotificationBellProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, markAsRead, markAllAsRead, closeNotifications } = usePortalStore();
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeNotifications();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeNotifications]);

  const handleNotificationClick = (notifId: string, linkTo?: string) => {
    markAsRead(notifId);
    if (linkTo) {
      closeNotifications();
      router.push(linkTo);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className={cn(
          "relative p-2 rounded-lg",
          "text-[var(--g0-text-secondary)] hover:text-[var(--g0-text-primary)]",
          "hover:bg-[var(--g0-bg-elevated-2)]",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g0-accent-amber)]"
        )}
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[var(--g0-status-error)] text-[10px] font-medium text-white flex items-center justify-center">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)] shadow-xl shadow-black/20 z-50">
          <div className="flex items-center justify-between p-3 border-b border-[var(--g0-bg-elevated-3)]">
            <h4 className="text-sm font-medium text-[var(--g0-text-primary)]">
              Notifications
            </h4>
            {count > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[var(--g0-accent-violet)] hover:text-[var(--g0-accent-violet)]/80"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-[var(--g0-text-tertiary)]">
                No notifications
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id, notif.linkTo)}
                  className={cn(
                    "w-full text-left px-3 py-2.5",
                    "hover:bg-[var(--g0-bg-elevated-2)]",
                    "transition-colors duration-150",
                    !notif.read && "bg-[var(--g0-bg-elevated-2)]/50"
                  )}
                >
                  <div className="flex items-start gap-2">
                    {!notif.read && (
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-[var(--g0-accent-violet)] flex-shrink-0" />
                    )}
                    <div className={cn("flex-1", notif.read && "ml-4")}>
                      <p className="text-sm text-[var(--g0-text-primary)]">
                        {notif.title}
                      </p>
                      <p className="text-xs text-[var(--g0-text-tertiary)] mt-0.5">
                        {notif.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function PortalHeader() {
  const { open: openPalette } = useCommandPaletteStore();
  const {
    notifications,
    isNotificationsOpen,
    toggleNotifications,
  } = usePortalStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-base)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--g0-bg-base)]/60">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <G0Logo size="md" />
          <span className="text-lg font-semibold text-[var(--g0-text-primary)]">
            G0 Experience
          </span>
        </div>

        {/* Center: Search */}
        <button
          onClick={openPalette}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg",
            "bg-[var(--g0-bg-elevated-1)] border border-[var(--g0-bg-elevated-3)]",
            "text-[var(--g0-text-tertiary)] hover:text-[var(--g0-text-secondary)]",
            "hover:border-[var(--g0-bg-elevated-4)]",
            "transition-colors duration-150",
            "w-80"
          )}
        >
          <Search className="h-4 w-4" />
          <span className="text-sm flex-1 text-left">
            Search boards, entities...
          </span>
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-2)] px-1.5 text-[10px] text-[var(--g0-text-tertiary)]">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <NotificationBell
            count={unreadCount}
            isOpen={isNotificationsOpen}
            onToggle={toggleNotifications}
          />
          <button
            className={cn(
              "p-2 rounded-lg",
              "text-[var(--g0-text-secondary)] hover:text-[var(--g0-text-primary)]",
              "hover:bg-[var(--g0-bg-elevated-2)]",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g0-accent-amber)]"
            )}
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
