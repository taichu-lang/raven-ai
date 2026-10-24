import { Skill } from "hero-next/chat";
import { create } from "zustand";

/**
 * A message submitted on the landing page, waiting to be sent by the conversation page.
 *
 * Lifecycle: written by DraftComposer right before navigating to the slug page, read once by
 * ChatPageContent's mount effect, then cleared. This store survives client-side navigation,
 * which is exactly the window the draft needs to live through. It carries plain data only —
 * the request's AbortController is NOT stored here: it is created by `sendChatMessage` in the
 * conversation page's ChatContext, whose lifetime matches the request's.
 */
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
