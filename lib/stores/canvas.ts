import { create } from "zustand";

interface CanvasState {
  // Zoom
  zoom: number;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;

  // Viewport / Pan
  viewportX: number;
  viewportY: number;
  setViewport: (x: number, y: number) => void;
  pan: (deltaX: number, deltaY: number) => void;
  resetViewport: () => void;

  // View mode
  viewMode: "radial" | "grid";
  setViewMode: (mode: "radial" | "grid") => void;
  toggleViewMode: () => void;

  // Zone hover state
  activeZone: "shared" | "smart" | "private" | null;
  setActiveZone: (zone: "shared" | "smart" | "private" | null) => void;
}

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;
const ZOOM_STEP = 0.1;

export const useCanvasStore = create<CanvasState>((set) => ({
  // Zoom
  zoom: 1,
  setZoom: (zoom) =>
    set({ zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom)) }),
  zoomIn: () =>
    set((state) => ({
      zoom: Math.min(MAX_ZOOM, state.zoom + ZOOM_STEP),
    })),
  zoomOut: () =>
    set((state) => ({
      zoom: Math.max(MIN_ZOOM, state.zoom - ZOOM_STEP),
    })),
  resetZoom: () => set({ zoom: 1 }),

  // Viewport / Pan - start centered (0,0 positions smart object in center)
  viewportX: 0,
  viewportY: 0,
  setViewport: (x, y) => set({ viewportX: x, viewportY: y }),
  pan: (deltaX, deltaY) =>
    set((state) => ({
      viewportX: state.viewportX + deltaX,
      viewportY: state.viewportY + deltaY,
    })),
  resetViewport: () => set({ viewportX: 0, viewportY: 0 }),

  // View mode
  viewMode: "radial",
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleViewMode: () =>
    set((state) => ({
      viewMode: state.viewMode === "radial" ? "grid" : "radial",
    })),

  // Zone hover
  activeZone: null,
  setActiveZone: (zone) => set({ activeZone: zone }),
}));
