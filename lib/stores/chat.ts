import { create } from "zustand";
import type { ChatMessage, Artifact } from "../mock-data/chat-artifacts";

interface ChatState {
  // Panel state
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;

  // Messages
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;

  // Input
  inputValue: string;
  setInputValue: (value: string) => void;

  // Artifacts
  artifacts: Artifact[];
  addArtifact: (artifact: Artifact) => void;
  removeArtifact: (id: string) => void;
  clearArtifacts: () => void;

  // Typing indicator
  isEntityTyping: boolean;
  setEntityTyping: (typing: boolean) => void;

  // Artifacts panel expanded state
  isArtifactsPanelExpanded: boolean;
  toggleArtifactsPanel: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  // Panel
  isPanelOpen: false,
  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false }),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),

  // Messages
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),

  // Input
  inputValue: "",
  setInputValue: (value) => set({ inputValue: value }),

  // Artifacts
  artifacts: [],
  addArtifact: (artifact) =>
    set((state) => ({
      artifacts: state.artifacts.some((a) => a.id === artifact.id)
        ? state.artifacts
        : [...state.artifacts, artifact],
    })),
  removeArtifact: (id) =>
    set((state) => ({
      artifacts: state.artifacts.filter((a) => a.id !== id),
    })),
  clearArtifacts: () => set({ artifacts: [] }),

  // Typing
  isEntityTyping: false,
  setEntityTyping: (typing) => set({ isEntityTyping: typing }),

  // Artifacts panel
  isArtifactsPanelExpanded: false,
  toggleArtifactsPanel: () =>
    set((state) => ({
      isArtifactsPanelExpanded: !state.isArtifactsPanelExpanded,
    })),
}));
