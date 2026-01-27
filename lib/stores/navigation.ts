import { create } from "zustand";

interface NavigationState {
  // Drawer state
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;

  // Current navigation
  currentOrgId: string;
  currentWorkspaceId: string;
  currentBoardId: string;
  setCurrentOrg: (orgId: string) => void;
  setCurrentWorkspace: (workspaceId: string) => void;
  setCurrentBoard: (boardId: string) => void;

  // Breadcrumb state for sub-boards
  breadcrumb: Array<{ id: string; name: string }>;
  setBreadcrumb: (items: Array<{ id: string; name: string }>) => void;
  addToBreadcrumb: (item: { id: string; name: string }) => void;
  clearBreadcrumb: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  // Drawer
  isDrawerOpen: false,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

  // Navigation
  currentOrgId: "org_acme",
  currentWorkspaceId: "ws_finance",
  currentBoardId: "board_overview",
  setCurrentOrg: (orgId) => set({ currentOrgId: orgId }),
  setCurrentWorkspace: (workspaceId) => set({ currentWorkspaceId: workspaceId }),
  setCurrentBoard: (boardId) => set({ currentBoardId: boardId }),

  // Breadcrumb
  breadcrumb: [],
  setBreadcrumb: (items) => set({ breadcrumb: items }),
  addToBreadcrumb: (item) =>
    set((state) => ({ breadcrumb: [...state.breadcrumb, item] })),
  clearBreadcrumb: () => set({ breadcrumb: [] }),
}));
