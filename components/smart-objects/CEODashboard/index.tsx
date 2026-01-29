"use client";

import { SmartObjectContainer } from "../SmartObjectContainer";
import { RadialView } from "./RadialView";
import { GridView } from "./GridView";

interface CEODashboardProps {
  className?: string;
}

/**
 * CEODashboard - Executive overview Smart Object
 *
 * Uses SmartObjectContainer for:
 * - Fixed 960×540 dimensions (16:9)
 * - View mode toggle (radial/grid)
 * - Presentation mode (fullscreen with Esc to exit)
 * - Consistent outer frame styling
 *
 * Views:
 * - Radial: High-level executive overview with CEO center, KPI ring, leadership team
 * - Grid: Detailed dashboard with all charts, metrics, and data visualization
 */
export function CEODashboard({ className }: CEODashboardProps) {
  return (
    <SmartObjectContainer
      radialView={<RadialView />}
      gridView={<GridView />}
      className={className}
    />
  );
}

// Re-export views for direct usage if needed
export { RadialView } from "./RadialView";
export { GridView } from "./GridView";
