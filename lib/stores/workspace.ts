import { create } from "zustand";

export interface DroppedItem {
  id: string;
  itemType: "artifact" | "text";
  title: string;
  content?: string; // For text messages
  artifactType?: "pdf" | "chart" | "table" | "image" | "text";
  thumbnail?: string;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  zone: "shared" | "private";
  createdAt: string;
  droppedAt: number;
}

interface NewItemData {
  itemType: "artifact" | "text";
  title: string;
  content?: string;
  artifactType?: string;
  thumbnail?: string;
}

interface WorkspaceState {
  sharedItems: DroppedItem[];
  privateItems: DroppedItem[];

  addToShared: (item: NewItemData, position: { x: number; y: number }) => void;
  addToPrivate: (item: NewItemData, position: { x: number; y: number }) => void;
  removeFromShared: (itemId: string) => void;
  removeFromPrivate: (itemId: string) => void;
  resizeItem: (zone: "shared" | "private", itemId: string, width: number, height: number) => void;
  moveToShared: (itemId: string) => void;
  moveToPrivate: (itemId: string) => void;
}

let itemIdCounter = 0;

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  sharedItems: [],
  privateItems: [],

  addToShared: (itemData, position) =>
    set((state) => ({
      sharedItems: [
        ...state.sharedItems,
        {
          id: `dropped_${++itemIdCounter}_${Date.now()}`,
          ...itemData,
          artifactType: itemData.artifactType as DroppedItem["artifactType"],
          zone: "shared",
          position,
          createdAt: new Date().toISOString(),
          droppedAt: Date.now(),
        },
      ],
    })),

  addToPrivate: (itemData, position) =>
    set((state) => ({
      privateItems: [
        ...state.privateItems,
        {
          id: `dropped_${++itemIdCounter}_${Date.now()}`,
          ...itemData,
          artifactType: itemData.artifactType as DroppedItem["artifactType"],
          zone: "private",
          position,
          createdAt: new Date().toISOString(),
          droppedAt: Date.now(),
        },
      ],
    })),

  removeFromShared: (itemId) =>
    set((state) => ({
      sharedItems: state.sharedItems.filter((item) => item.id !== itemId),
    })),

  removeFromPrivate: (itemId) =>
    set((state) => ({
      privateItems: state.privateItems.filter((item) => item.id !== itemId),
    })),

  resizeItem: (zone, itemId, width, height) =>
    set((state) => {
      if (zone === "shared") {
        return {
          sharedItems: state.sharedItems.map((item) =>
            item.id === itemId ? { ...item, size: { width, height } } : item
          ),
        };
      } else {
        return {
          privateItems: state.privateItems.map((item) =>
            item.id === itemId ? { ...item, size: { width, height } } : item
          ),
        };
      }
    }),

  moveToShared: (itemId) =>
    set((state) => {
      const item = state.privateItems.find((i) => i.id === itemId);
      if (!item) return state;
      return {
        privateItems: state.privateItems.filter((i) => i.id !== itemId),
        sharedItems: [...state.sharedItems, { ...item, zone: "shared" }],
      };
    }),

  moveToPrivate: (itemId) =>
    set((state) => {
      const item = state.sharedItems.find((i) => i.id === itemId);
      if (!item) return state;
      return {
        sharedItems: state.sharedItems.filter((i) => i.id !== itemId),
        privateItems: [...state.privateItems, { ...item, zone: "private" }],
      };
    }),
}));
