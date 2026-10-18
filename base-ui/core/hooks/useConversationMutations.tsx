"use client";

import { InfiniteScrollViewHandle } from "hero-next/layout";
import { useCallback } from "react";
import { create } from "zustand";
import { Conversation } from "../types/chat";

interface ConversationScroller {
  scrollRef: React.RefObject<InfiniteScrollViewHandle | null> | null;

  setScrollRef: (ref: React.RefObject<InfiniteScrollViewHandle | null>) => void;
  reloadRecent: () => void;
}

export const useConversationScroller = create<ConversationScroller>()((set, get) => ({
  scrollRef: null,

  setScrollRef: (ref) => set({ scrollRef: ref }),
  reloadRecent: () => {
    const ref = get().scrollRef;
    if (ref?.current) {
      ref.current.refresh("recent");
    }
  },
}));

interface ConversationValue {
  conversation: Conversation;

  setConversation: (c: Partial<Conversation>) => void;
}

const useConversationStore = create<ConversationValue>()((set, get) => ({
  conversation: {
    id: 0,
    conversation_id: "",
    title: "",
    metadata: {},
    created_at: 0,
  },

  setConversation: (c) => set({ conversation: { ...get().conversation, ...c } }),
}));

export function useConversationMutations() {
  const { conversation } = useConversationStore();
  const { setConversation } = useConversationStore.getState();
  const { reloadRecent } = useConversationScroller.getState();

  const onConversationCreated = useCallback(
    (c: Conversation) => {
      setConversation(c);
      reloadRecent();
    },
    [setConversation, reloadRecent],
  );

  const clearConversation = useCallback(
    () => setConversation({ id: 0, conversation_id: "", title: "", metadata: {}, created_at: 0 }),
    [setConversation],
  );

  return {
    conversation,
    setConversation,
    clearConversation,
    onConversationCreated,
  };
}
