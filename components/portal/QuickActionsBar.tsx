"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { quickActions, type QuickAction } from "@/lib/mock-data/portal";
import { FileText, Heart, Lightbulb, MessageCircle, Zap } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="h-4 w-4" />,
  Heart: <Heart className="h-4 w-4" />,
  Lightbulb: <Lightbulb className="h-4 w-4" />,
  MessageCircle: <MessageCircle className="h-4 w-4" />,
};

interface QuickActionButtonProps {
  action: QuickAction;
  onClick: () => void;
}

function QuickActionButton({ action, onClick }: QuickActionButtonProps) {
  const icon = iconMap[action.icon] || <FileText className="h-4 w-4" />;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg",
        "bg-[var(--g0-bg-elevated-2)] border border-[var(--g0-bg-elevated-3)]",
        "text-[var(--g0-text-secondary)] hover:text-[var(--g0-text-primary)]",
        "hover:bg-[var(--g0-bg-elevated-3)] hover:border-[var(--g0-bg-elevated-4)]",
        "transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g0-accent-amber)]"
      )}
    >
      <div className="p-1.5 rounded-md bg-[var(--g0-bg-elevated-3)]">
        {icon}
      </div>
      <div className="text-left">
        <span className="text-sm block">{action.label}</span>
        <span className="text-xs text-[var(--g0-text-tertiary)]">{action.entity}</span>
      </div>
    </button>
  );
}

interface QuickActionsBarProps {
  orgId: string;
}

export function QuickActionsBar({ orgId }: QuickActionsBarProps) {
  const router = useRouter();

  const handleActionClick = (action: QuickAction) => {
    const path = `/${orgId}/${action.workspaceId}/${action.boardId}`;
    if (action.prompt) {
      router.push(`${path}?chat=open&prompt=${encodeURIComponent(action.prompt)}`);
    } else {
      router.push(`${path}?chat=open`);
    }
  };

  return (
    <div className="rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)] p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-3.5 w-3.5 text-[var(--g0-accent-amber)]" />
        <h3 className="text-xs font-medium text-[var(--g0-text-tertiary)] uppercase tracking-wider">
          Quick Actions
        </h3>
      </div>

      <div className="space-y-2">
        {quickActions.map((action) => (
          <QuickActionButton
            key={action.id}
            action={action}
            onClick={() => handleActionClick(action)}
          />
        ))}
      </div>
    </div>
  );
}
