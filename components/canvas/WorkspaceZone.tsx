"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, Lock, GripVertical, FileText, BarChart3, Table, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/stores";
import { Text } from "@/components/smart-objects/atomics";
import { MarkdownContent } from "@/components/chat/MarkdownContent";
import type { Artifact } from "@/lib/mock-data/chat-artifacts";
import type { DroppedItem } from "@/lib/stores/workspace";

interface WorkspaceZoneProps {
  zone: "shared" | "private";
  className?: string;
}

// Fake document first page previews
const documentPreviews: Record<string, React.ReactNode> = {
  "Q1 2026": (
    <div className="w-full h-full bg-white p-3 text-[6px] leading-tight text-gray-800">
      <div className="font-bold text-[8px] mb-2 text-gray-900">Q1 2026 Cash Flow Forecast</div>
      <div className="mb-2 text-gray-600">Acme Wealth Management</div>
      <div className="border-t border-gray-200 pt-2 mb-2">
        <div className="font-semibold mb-1">Summary</div>
        <div className="text-gray-500">Positive cash position with 21-month runway projected...</div>
      </div>
      <div className="grid grid-cols-2 gap-1 mb-2">
        <div className="bg-blue-50 p-1 rounded">
          <div className="text-[5px] text-blue-600">Opening</div>
          <div className="font-bold text-blue-700">$4.2M</div>
        </div>
        <div className="bg-green-50 p-1 rounded">
          <div className="text-[5px] text-green-600">Closing</div>
          <div className="font-bold text-green-700">$4.9M</div>
        </div>
        <div className="bg-emerald-50 p-1 rounded">
          <div className="text-[5px] text-emerald-600">Inflows</div>
          <div className="font-bold text-emerald-700">$2.8M</div>
        </div>
        <div className="bg-rose-50 p-1 rounded">
          <div className="text-[5px] text-rose-600">Outflows</div>
          <div className="font-bold text-rose-700">$2.1M</div>
        </div>
      </div>
      <div className="text-gray-400 text-[5px]">Page 1 of 8</div>
    </div>
  ),
  "Q4 2025": (
    <div className="w-full h-full bg-white p-3 text-[6px] leading-tight text-gray-800">
      <div className="font-bold text-[8px] mb-2 text-gray-900">Q4 2025 Financial Report</div>
      <div className="mb-2 text-gray-600">Acme Wealth Management</div>
      <div className="border-t border-gray-200 pt-2 mb-2">
        <div className="font-semibold mb-1">Executive Summary</div>
        <div className="text-gray-500">Strong performance across all key metrics with revenue growth of 12% YoY...</div>
      </div>
      <div className="flex gap-2 mb-2">
        <div className="flex-1 bg-green-50 p-1 rounded">
          <div className="text-[5px] text-green-600">Revenue</div>
          <div className="font-bold text-green-700">$2.4M</div>
        </div>
        <div className="flex-1 bg-blue-50 p-1 rounded">
          <div className="text-[5px] text-blue-600">Cash</div>
          <div className="font-bold text-blue-700">$4.2M</div>
        </div>
      </div>
      <div className="text-gray-400 text-[5px]">Page 1 of 12</div>
    </div>
  ),
  "Cash Flow": (
    <div className="w-full h-full bg-white p-3 flex flex-col">
      <div className="font-bold text-[8px] mb-2 text-gray-900">Cash Flow Projection</div>
      <div className="flex-1 flex items-end gap-1 px-2">
        {[65, 72, 80, 75, 88, 95].map((h, i) => (
          <div key={i} className="flex-1 bg-gradient-to-t from-teal-500 to-teal-300 rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="flex justify-between text-[5px] text-gray-400 mt-1 px-2">
        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
      </div>
    </div>
  ),
  "Budget vs": (
    <div className="w-full h-full bg-white p-3">
      <div className="font-bold text-[8px] mb-2 text-gray-900">Budget vs Actual</div>
      <div className="space-y-2">
        {[
          { label: "Engineering", budget: 85, actual: 82 },
          { label: "Sales", budget: 42, actual: 45 },
          { label: "Marketing", budget: 28, actual: 26 },
        ].map((item, i) => (
          <div key={i} className="text-[5px]">
            <div className="flex justify-between text-gray-600 mb-0.5">
              <span>{item.label}</span>
              <span>${item.actual}K / ${item.budget}K</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded overflow-hidden">
              <div className="h-full bg-violet-400 rounded" style={{ width: `${(item.actual / item.budget) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

// Resizable dropped item card
function DroppedItemCard({
  item,
  onRemove,
  onResize,
}: {
  item: DroppedItem;
  onRemove: () => void;
  onResize: (width: number, height: number) => void;
}) {
  const [isResizing, setIsResizing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = item.size?.width || 180;
    const startHeight = item.size?.height || 140;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(120, startWidth + (moveEvent.clientX - startX));
      const newHeight = Math.max(100, startHeight + (moveEvent.clientY - startY));
      onResize(newWidth, newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Calculate auto-size for text content based on content length
  const calculateTextSize = () => {
    if (item.itemType !== "text" || !item.content) {
      return { width: 180, height: 160 };
    }

    const contentLength = item.content.length;
    const lineCount = item.content.split("\n").length;
    const hasLists = item.content.includes("- ") || item.content.includes("1. ");
    const hasBold = item.content.includes("**");

    // Base width on content complexity
    let width = Math.min(360, Math.max(240, contentLength / 4 + 100));

    // Base height on line count and content length
    let height = Math.min(400, Math.max(120, lineCount * 24 + contentLength / 8 + 60));

    // Add extra space for formatted content
    if (hasLists) height += 20;
    if (hasBold) width = Math.max(width, 280);

    return { width, height };
  };

  const autoSize = item.itemType === "text" ? calculateTextSize() : { width: 180, height: 160 };
  const width = item.size?.width || autoSize.width;
  const height = item.size?.height || autoSize.height;
  const previewHeight = item.itemType === "text" ? height - 50 : height - 50;

  // Get preview content based on title or type
  const getPreviewContent = () => {
    if (item.itemType === "text") {
      return (
        <div className="w-full h-full p-3 overflow-auto custom-scrollbar">
          <MarkdownContent content={item.content || item.title} />
        </div>
      );
    }

    // Check for matching document preview
    const matchingPreview = Object.entries(documentPreviews).find(([key]) =>
      item.title.includes(key)
    );

    if (matchingPreview) {
      return matchingPreview[1];
    }

    // Default icon-based preview
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--g0-bg-elevated-2)]">
        {item.itemType === "artifact" && (
          <>
            {item.artifactType === "pdf" && <FileText className="h-8 w-8 text-[var(--g0-data-4)] mb-2" />}
            {item.artifactType === "chart" && <BarChart3 className="h-8 w-8 text-[var(--g0-data-2)] mb-2" />}
            {item.artifactType === "table" && <Table className="h-8 w-8 text-[var(--g0-data-3)] mb-2" />}
          </>
        )}
        <Text variant="small" color="muted" className="text-[10px]">
          {item.artifactType?.toUpperCase() || "DOCUMENT"}
        </Text>
      </div>
    );
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={cn(
        "group absolute rounded-xl border bg-[var(--g0-bg-elevated-1)] overflow-hidden shadow-xl",
        isResizing ? "border-[var(--g0-accent-amber)]" : "border-[var(--g0-bg-elevated-3)]",
        "hover:border-[var(--g0-accent-violet)] transition-colors"
      )}
      style={{
        left: item.position.x,
        top: item.position.y,
        width,
        height,
      }}
      drag
      dragMomentum={false}
    >
      {/* Preview area */}
      <div
        className="w-full overflow-hidden relative"
        style={{ height: previewHeight }}
      >
        {getPreviewContent()}

        {/* Drag handle */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
          <GripVertical className="h-4 w-4 text-[var(--g0-text-muted)]" />
        </div>

        {/* Remove button */}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-[var(--g0-bg-base)]/90 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--g0-accent-rose)]"
        >
          <X className="h-3.5 w-3.5 text-[var(--g0-text-secondary)]" />
        </button>

        {/* Type badge */}
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-[var(--g0-bg-base)]/80 opacity-0 group-hover:opacity-100 transition-opacity">
          <Text variant="small" color="muted" className="text-[9px]">
            {item.itemType === "text" ? "Message" : item.artifactType?.toUpperCase()}
          </Text>
        </div>
      </div>

      {/* Title bar */}
      <div className="p-2.5 border-t border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-2)]">
        <Text variant="small" className="truncate font-medium text-[11px]">
          {item.title}
        </Text>
        <Text variant="small" color="muted" className="text-[9px]">
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={handleResizeStart}
        className={cn(
          "absolute bottom-0 right-0 w-4 h-4 cursor-se-resize",
          "opacity-0 group-hover:opacity-100 transition-opacity"
        )}
      >
        <svg viewBox="0 0 16 16" className="w-full h-full text-[var(--g0-text-muted)]">
          <path d="M14 14L8 14M14 14L14 8M14 14L4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
    </motion.div>
  );
}

export function WorkspaceZone({ zone, className }: WorkspaceZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const {
    sharedItems,
    privateItems,
    addToShared,
    addToPrivate,
    removeFromShared,
    removeFromPrivate,
    resizeItem,
  } = useWorkspaceStore();

  const items = zone === "shared" ? sharedItems : privateItems;
  const addItem = zone === "shared" ? addToShared : addToPrivate;
  const removeItem = zone === "shared" ? removeFromShared : removeFromPrivate;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      try {
        const data = e.dataTransfer.getData("application/json");
        if (data) {
          const parsed = JSON.parse(data);
          const rect = e.currentTarget.getBoundingClientRect();
          const position = {
            x: Math.max(10, e.clientX - rect.left - 90),
            y: Math.max(10, e.clientY - rect.top - 70),
          };

          // Handle both artifacts and text messages
          if (parsed.itemType === "text") {
            addItem({
              itemType: "text",
              title: parsed.title || "Chat Message",
              content: parsed.content,
            }, position);
          } else {
            addItem({
              itemType: "artifact",
              title: parsed.title,
              artifactType: parsed.type,
              thumbnail: parsed.thumbnail,
            }, position);
          }
        }
      } catch (error) {
        console.error("Failed to parse dropped item:", error);
      }
    },
    [addItem]
  );

  const isShared = zone === "shared";
  const Icon = isShared ? Share2 : Lock;
  const label = isShared ? "Shared Workspace" : "Private Workspace";
  const accentColor = isShared ? "var(--g0-zone-shared)" : "var(--g0-zone-private)";

  return (
    <div
      className={cn(
        "relative min-h-[200px] transition-all duration-200",
        isDragOver && "ring-1 ring-inset",
        className
      )}
      style={{
        backgroundColor: isDragOver ? `${accentColor}05` : "transparent",
        "--tw-ring-color": isDragOver ? accentColor : "transparent",
      } as React.CSSProperties}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Zone label - centered, positioned at border with smart object */}
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 text-[10px] font-medium tracking-wider uppercase",
          "border rounded-full backdrop-blur-sm",
          isShared ? "bottom-4" : "top-4",
          items.length === 0 ? "opacity-70" : "opacity-40 hover:opacity-70"
        )}
        style={{
          backgroundColor: `${accentColor}08`,
          borderColor: `${accentColor}25`,
          color: `${accentColor}`,
        }}
      >
        <Icon className="h-3 w-3" />
        {label}
      </div>

      {/* Drop hint - centered, subtle */}
      {items.length === 0 && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center pointer-events-none",
          isShared ? "pb-12" : "pt-12"
        )}>
          <div className="flex flex-col items-center gap-3 text-center">
            <div
              className="w-12 h-12 rounded-xl border border-dashed flex items-center justify-center"
              style={{ borderColor: `${accentColor}20` }}
            >
              {isShared ? (
                <Share2 className="h-5 w-5" style={{ color: `${accentColor}40` }} />
              ) : (
                <Lock className="h-5 w-5" style={{ color: `${accentColor}40` }} />
              )}
            </div>
            <Text variant="small" color="muted" className="text-[11px] opacity-50">
              {isDragOver ? "Drop here" : "Drag items here"}
            </Text>
          </div>
        </div>
      )}

      {/* Dropped items */}
      <AnimatePresence>
        {items.map((item) => (
          <DroppedItemCard
            key={item.id}
            item={item}
            onRemove={() => removeItem(item.id)}
            onResize={(width, height) => resizeItem(zone, item.id, width, height)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
