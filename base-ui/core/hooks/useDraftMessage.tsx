import { Skill } from "hero-next/chat";
import { create } from "zustand";

interface DraftMessage {
  content: string;
  conversationID: string;
  skills?: Skill[];
}

interface DraftMessageValue {
  message?: DraftMessage;

  setDraft: (message: DraftMessage) => void;
  clearDraft: () => void;
}

export const useDraftMessage = create<DraftMessageValue>((set) => ({
  message: undefined,

  setDraft: (message) => {
    set({ message });
  },

  clearDraft: () => {
    set({ message: undefined });
  },
}));
