import { create } from "zustand";

export interface Command {
  id: string;
  label: string;
  category: "boards" | "actions" | "entity";
  shortcut?: string;
  icon?: string;
  action: () => void;
}

interface CommandPaletteState {
  // Open state
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Selected index for keyboard navigation
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  moveUp: () => void;
  moveDown: (maxIndex: number) => void;

  // Commands
  commands: Command[];
  setCommands: (commands: Command[]) => void;
}

export const useCommandPaletteStore = create<CommandPaletteState>((set) => ({
  // Open state
  isOpen: false,
  open: () => set({ isOpen: true, searchQuery: "", selectedIndex: 0 }),
  close: () => set({ isOpen: false, searchQuery: "", selectedIndex: 0 }),
  toggle: () =>
    set((state) => ({
      isOpen: !state.isOpen,
      searchQuery: "",
      selectedIndex: 0,
    })),

  // Search
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query, selectedIndex: 0 }),

  // Selection
  selectedIndex: 0,
  setSelectedIndex: (index) => set({ selectedIndex: index }),
  moveUp: () =>
    set((state) => ({
      selectedIndex: Math.max(0, state.selectedIndex - 1),
    })),
  moveDown: (maxIndex) =>
    set((state) => ({
      selectedIndex: Math.min(maxIndex, state.selectedIndex + 1),
    })),

  // Commands
  commands: [],
  setCommands: (commands) => set({ commands }),
}));
