"use client";

import { FileText, BarChart3, Table, Image, FileType } from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/smart-objects/atomics";
import type { Artifact, ArtifactType } from "@/lib/mock-data/chat-artifacts";

interface ArtifactCardProps {
  artifact: Artifact;
  size?: "sm" | "md";
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  draggable?: boolean;
  className?: string;
}

const iconMap: Record<ArtifactType, typeof FileText> = {
  pdf: FileText,
  chart: BarChart3,
  table: Table,
  image: Image,
  text: FileType,
};

const colorMap: Record<ArtifactType, string> = {
  pdf: "var(--g0-data-4)",
  chart: "var(--g0-data-2)",
  table: "var(--g0-data-3)",
  image: "var(--g0-data-5)",
  text: "var(--g0-data-1)",
};

export function ArtifactCard({
  artifact,
  size = "md",
  onClick,
  onDragStart,
  draggable: isDraggable = true,
  className,
}: ArtifactCardProps) {
  const Icon = iconMap[artifact.type] || FileType;
  const color = colorMap[artifact.type];

  const sizeConfig = {
    sm: { container: "w-16 h-16", icon: "h-5 w-5", text: "text-[9px]" },
    md: { container: "w-20 h-20", icon: "h-6 w-6", text: "text-[10px]" },
  };

  const config = sizeConfig[size];

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify(artifact));
    e.dataTransfer.effectAllowed = "move";
    onDragStart?.(e);
  };

  return (
    <div
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center rounded-lg cursor-pointer",
        "border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-2)]",
        "transition-all duration-150 hover:border-[var(--g0-accent-violet)]",
        "hover:shadow-lg hover:shadow-[var(--g0-accent-violet)]/10",
        config.container,
        className
      )}
    >
      {/* Icon */}
      <Icon className={cn(config.icon, "mb-1")} style={{ color }} />

      {/* Title (truncated) */}
      <Text
        variant="small"
        className={cn(
          "w-full truncate px-1.5 text-center",
          config.text
        )}
      >
        {artifact.title.split(" ").slice(0, 2).join(" ")}
      </Text>

      {/* Zone indicator */}
      <div
        className={cn(
          "absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-[var(--g0-bg-base)]",
          artifact.zone === "shared"
            ? "bg-[var(--g0-zone-shared)]"
            : "bg-[var(--g0-zone-private)]"
        )}
      />
    </div>
  );
}
