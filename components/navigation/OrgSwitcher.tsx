"use client";

import { useRouter } from "next/navigation";
import { Building2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigationStore } from "@/lib/stores";
import type { Organization } from "@/lib/mock-data/organization";

interface OrgSwitcherProps {
  organization: Organization;
  onClick?: () => void;
  className?: string;
}

export function OrgSwitcher({
  organization,
  onClick,
  className,
}: OrgSwitcherProps) {
  const router = useRouter();
  const { closeDrawer, clearBreadcrumb } = useNavigationStore();

  const handleOverviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearBreadcrumb();
    closeDrawer();
    router.push(`/${organization.id}/overview`);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)] px-4 py-3 text-left transition-colors",
        "hover:bg-[var(--g0-bg-elevated-2)]",
        className
      )}
    >
      {/* Org Icon */}
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--g0-accent-amber)] to-[var(--g0-accent-violet)]">
        <Building2 className="h-5 w-5 text-[var(--g0-text-inverse)]" />
      </div>

      {/* Org Name */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="font-semibold text-[14px] text-[var(--g0-text-primary)] truncate">
          {organization.name}
        </div>
        <span
          onClick={handleOverviewClick}
          className="text-[12px] text-[var(--g0-accent-amber)] hover:text-[var(--g0-accent-amber-bright)] hover:underline cursor-pointer"
        >
          Overview
        </span>
      </div>

      {/* Dropdown indicator */}
      <ChevronDown className="h-4 w-4 text-[var(--g0-text-muted)]" />
    </button>
  );
}
