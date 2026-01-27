"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigationStore } from "@/lib/stores";
import { organization, findBoardById, findWorkspaceByBoardId } from "@/lib/mock-data/organization";

interface BreadcrumbProps {
  className?: string;
}

export function Breadcrumb({ className }: BreadcrumbProps) {
  const router = useRouter();
  const { breadcrumb, currentBoardId, currentWorkspaceId, setCurrentBoard, setBreadcrumb } = useNavigationStore();

  if (breadcrumb.length === 0) {
    return null;
  }

  const handleClick = (index: number) => {
    const item = breadcrumb[index];

    // Find the workspace for this board
    const workspace = findWorkspaceByBoardId(item.id);
    const workspaceId = workspace?.id || currentWorkspaceId;

    // Update store
    setCurrentBoard(item.id);
    // Truncate breadcrumb to this point
    setBreadcrumb(breadcrumb.slice(0, index));

    // Navigate to the board
    router.push(`/${organization.slug}/${workspaceId}/${item.id}`);
  };

  const currentBoard = findBoardById(currentBoardId);

  return (
    <div
      className={cn(
        "pointer-events-auto fixed left-1/2 -translate-x-1/2 top-4 z-50",
        className
      )}
    >
      <div className="flex items-center gap-1 rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)] px-4 py-2 shadow-lg">
        {/* Full breadcrumb trail */}
        {breadcrumb.map((item, index) => (
          <div key={item.id} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="mx-2 h-3.5 w-3.5 text-[var(--g0-text-muted)]" />
            )}
            <button
              onClick={() => handleClick(index)}
              className={cn(
                "text-sm transition-colors duration-150 hover:text-[var(--g0-accent-primary)]",
                "text-[var(--g0-text-secondary)]"
              )}
            >
              {item.name}
            </button>
          </div>
        ))}

        {/* Current board */}
        <ChevronRight className="mx-2 h-3.5 w-3.5 text-[var(--g0-text-muted)]" />
        <span className="text-sm font-medium text-[var(--g0-text-primary)]">
          {currentBoard?.name || "Current"}
        </span>
      </div>
    </div>
  );
}
