"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { motion } from "framer-motion";
import { Move, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface Position {
  x: number;
  y: number;
}

interface RadialLayoutContextValue {
  isEditMode: boolean;
  setIsEditMode: (v: boolean) => void;
  centerY: number;
  positions: Record<string, Position>;
  updatePosition: (id: string, pos: Position) => void;
}

// ============================================================================
// Context
// ============================================================================

const RadialLayoutContext = createContext<RadialLayoutContextValue | null>(null);

function useRadialLayout() {
  const ctx = useContext(RadialLayoutContext);
  if (!ctx) {
    throw new Error("useRadialLayout must be used within RadialLayout.Root");
  }
  return ctx;
}

// ============================================================================
// Utility: Calculate radial positions
// ============================================================================

interface RadialPositionConfig {
  count: number;
  radius: number;
  startAngle?: number; // degrees, default -90 (top)
}

/**
 * Calculate offsets from center for items arranged in a circle.
 * Returns array of {x, y} offsets (NOT absolute positions).
 * Use with `left: calc(50% + ${offset.x}px)` for proper centering.
 */
export function calculateRadialOffsets(config: RadialPositionConfig): Position[] {
  const { count, radius, startAngle = -90 } = config;
  return Array.from({ length: count }, (_, index) => {
    const angle = startAngle + (index * 360) / count;
    const rad = (angle * Math.PI) / 180;
    return {
      x: Math.cos(rad) * radius,
      y: Math.sin(rad) * radius,
    };
  });
}

// ============================================================================
// RadialLayout.Root - Container with edit mode support
// ============================================================================

interface RootProps {
  children: React.ReactNode;
  /** Vertical center position (pixels from top of container) */
  centerY?: number;
  /** Initial positions for draggable items (id -> {x, y} offset from center) */
  initialPositions?: Record<string, Position>;
  /** Show edit mode toggle button */
  showEditToggle?: boolean;
  /** Callback when positions change (for persistence) */
  onPositionsChange?: (positions: Record<string, Position>) => void;
  className?: string;
}

function Root({
  children,
  centerY = 206,
  initialPositions = {},
  showEditToggle = true,
  onPositionsChange,
  className,
}: RootProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [positions, setPositions] = useState<Record<string, Position>>(initialPositions);

  const updatePosition = useCallback(
    (id: string, pos: Position) => {
      setPositions((prev) => {
        const next = { ...prev, [id]: pos };
        onPositionsChange?.(next);
        return next;
      });
    },
    [onPositionsChange]
  );

  return (
    <RadialLayoutContext.Provider
      value={{ isEditMode, setIsEditMode, centerY, positions, updatePosition }}
    >
      <div
        className={cn("flex-1 relative overflow-visible", className)}
        style={{ background: isEditMode ? "rgba(59, 130, 246, 0.02)" : "transparent" }}
      >
        {/* Edit mode toggle */}
        {showEditToggle && (
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={cn(
              "absolute top-2 right-2 z-30 flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium transition-all",
              isEditMode
                ? "bg-blue-500 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            )}
          >
            {isEditMode ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            {isEditMode ? "Editing" : "Edit"}
          </button>
        )}

        {/* Grid lines in edit mode */}
        {isEditMode && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#3b82f6" strokeWidth="1" opacity="0.1" />
            <line x1="0" y1={centerY} x2="100%" y2={centerY} stroke="#3b82f6" strokeWidth="1" opacity="0.1" />
          </svg>
        )}

        {children}
      </div>
    </RadialLayoutContext.Provider>
  );
}

// ============================================================================
// RadialLayout.Ring - SVG ring visualization
// ============================================================================

interface RingProps {
  radius: number;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

function Ring({
  radius,
  stroke = "#1a1a1a",
  strokeWidth = 1,
  strokeDasharray = "4 4",
}: RingProps) {
  const { centerY } = useRadialLayout();

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      <circle
        cx="50%"
        cy={centerY}
        r={radius}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
      />
    </svg>
  );
}

// ============================================================================
// RadialLayout.Center - Center element (always at 50%, centerY)
// ============================================================================

interface CenterProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

function Center({ children, id = "center", className }: CenterProps) {
  const { isEditMode, centerY, positions, updatePosition } = useRadialLayout();
  const position = positions[id] || { x: 0, y: 0 };

  return (
    <DraggableItemInternal
      id={id}
      offsetX={position.x}
      offsetY={position.y}
      centerY={centerY}
      isEditMode={isEditMode}
      onDrag={(pos) => updatePosition(id, pos)}
      className={className}
    >
      {children}
    </DraggableItemInternal>
  );
}

// ============================================================================
// RadialLayout.Item - Positioned item (at offset from center)
// ============================================================================

interface ItemProps {
  children: React.ReactNode;
  id: string;
  /** X offset from center (pixels) */
  offsetX: number;
  /** Y offset from center (pixels) */
  offsetY: number;
  className?: string;
}

function Item({ children, id, offsetX, offsetY, className }: ItemProps) {
  const { isEditMode, centerY, positions, updatePosition } = useRadialLayout();

  // Use stored position if available, otherwise use provided offsets
  const position = positions[id] || { x: offsetX, y: offsetY };

  return (
    <DraggableItemInternal
      id={id}
      offsetX={position.x}
      offsetY={position.y}
      centerY={centerY}
      isEditMode={isEditMode}
      onDrag={(pos) => updatePosition(id, pos)}
      className={className}
    >
      {children}
    </DraggableItemInternal>
  );
}

// ============================================================================
// Internal: DraggableItem with proper positioning
// ============================================================================

interface DraggableItemInternalProps {
  id: string;
  offsetX: number;
  offsetY: number;
  centerY: number;
  isEditMode: boolean;
  onDrag: (pos: Position) => void;
  children: React.ReactNode;
  className?: string;
}

function DraggableItemInternal({
  id,
  offsetX,
  offsetY,
  centerY,
  isEditMode,
  onDrag,
  children,
  className,
}: DraggableItemInternalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      startX: offsetX,
      startY: offsetY,
    };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStart.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      onDrag({
        x: dragStart.current.startX + dx,
        y: dragStart.current.startY + dy,
      });
    },
    [isDragging, onDrag]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <motion.div
      className={cn(
        "absolute",
        isEditMode && "cursor-move",
        isDragging && "z-50",
        className
      )}
      style={{
        left: `calc(50% + ${offsetX}px)`,
        top: centerY + offsetY,
        transform: "translate(-50%, -50%)",
      }}
      onMouseDown={handleMouseDown}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isEditMode && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center z-10">
          <Move className="w-2.5 h-2.5 text-white" />
        </div>
      )}
      {children}
    </motion.div>
  );
}

// ============================================================================
// Export compound component
// ============================================================================

export const RadialLayout = {
  Root,
  Ring,
  Center,
  Item,
  /** Utility to calculate radial offsets */
  calculateOffsets: calculateRadialOffsets,
};

export type { Position, RadialPositionConfig };
