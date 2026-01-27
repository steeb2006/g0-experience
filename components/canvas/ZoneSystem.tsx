"use client";

import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/lib/stores";

interface ZoneSystemProps {
  className?: string;
}

export function ZoneSystem({ className }: ZoneSystemProps) {
  const { activeZone, setActiveZone } = useCanvasStore();

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex flex-col",
        className
      )}
    >
      {/* Shared Zone - Top */}
      <div
        className="relative flex-1 border-b border-dashed border-transparent transition-colors duration-200"
        style={{
          borderColor:
            activeZone === "shared"
              ? "var(--g0-zone-shared)"
              : "transparent",
          backgroundColor:
            activeZone === "shared"
              ? "var(--g0-zone-shared-bg)"
              : "transparent",
        }}
        onMouseEnter={() => setActiveZone("shared")}
        onMouseLeave={() => setActiveZone(null)}
      >
        {activeZone === "shared" && (
          <div className="absolute left-4 top-4 animate-fade-in">
            <span className="rounded-full bg-[var(--g0-zone-shared)] px-3 py-1 text-xs font-medium text-[var(--g0-text-inverse)]">
              Shared Zone
            </span>
          </div>
        )}
      </div>

      {/* Smart Object Zone - Center */}
      <div
        className="pointer-events-auto relative flex min-h-[400px] items-center justify-center border-y border-dashed border-transparent transition-colors duration-200"
        style={{
          borderColor:
            activeZone === "smart" ? "var(--g0-zone-smart)" : "transparent",
          backgroundColor:
            activeZone === "smart" ? "var(--g0-zone-smart-bg)" : "transparent",
        }}
      >
        {/* The Smart Object will be rendered here as children */}
      </div>

      {/* Private Zone - Bottom */}
      <div
        className="relative flex-1 border-t border-dashed border-transparent transition-colors duration-200"
        style={{
          borderColor:
            activeZone === "private"
              ? "var(--g0-zone-private)"
              : "transparent",
          backgroundColor:
            activeZone === "private"
              ? "var(--g0-zone-private-bg)"
              : "transparent",
        }}
        onMouseEnter={() => setActiveZone("private")}
        onMouseLeave={() => setActiveZone(null)}
      >
        {activeZone === "private" && (
          <div className="absolute bottom-4 left-4 animate-fade-in">
            <span className="rounded-full bg-[var(--g0-zone-private)] px-3 py-1 text-xs font-medium text-white">
              Private Zone
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
