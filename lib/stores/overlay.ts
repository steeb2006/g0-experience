import { create } from "zustand";
import type { PersonDetailData } from "@/lib/mock-data/person-detail";

interface OverlayState {
  isOpen: boolean;
  overlayType: "person-detail" | null;
  data: PersonDetailData | null;

  // Actions
  openPersonDetail: (person: PersonDetailData) => void;
  closeOverlay: () => void;
}

export const useOverlayStore = create<OverlayState>((set) => ({
  isOpen: false,
  overlayType: null,
  data: null,

  openPersonDetail: (person) =>
    set({
      isOpen: true,
      overlayType: "person-detail",
      data: person,
    }),

  closeOverlay: () =>
    set({
      isOpen: false,
      overlayType: null,
      data: null,
    }),
}));
