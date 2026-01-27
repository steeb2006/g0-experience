import { create } from "zustand";
import { notifications as mockNotifications, type Notification } from "../mock-data/portal";

interface RecentBoard {
  id: string;
  name: string;
  workspaceId: string;
  workspaceName: string;
  visitedAt: number;
}

interface PortalState {
  // Recent boards
  recentBoards: RecentBoard[];
  addRecentBoard: (board: RecentBoard) => void;

  // Notifications
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;

  // Notifications dropdown
  isNotificationsOpen: boolean;
  openNotifications: () => void;
  closeNotifications: () => void;
  toggleNotifications: () => void;
}

export const usePortalStore = create<PortalState>((set) => ({
  // Recent boards - start with empty, populated as user navigates
  recentBoards: [],
  addRecentBoard: (board) =>
    set((state) => {
      // Remove existing entry for this board if present
      const filtered = state.recentBoards.filter((b) => b.id !== board.id);
      // Add to front, keep max 10
      return {
        recentBoards: [board, ...filtered].slice(0, 10),
      };
    }),

  // Notifications - start with mock data
  notifications: mockNotifications,
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  // Notifications dropdown
  isNotificationsOpen: false,
  openNotifications: () => set({ isNotificationsOpen: true }),
  closeNotifications: () => set({ isNotificationsOpen: false }),
  toggleNotifications: () =>
    set((state) => ({ isNotificationsOpen: !state.isNotificationsOpen })),
}));
