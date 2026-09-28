"use client";

import { useDraftMessage } from "base-ui/hooks/useDraftMessage";
import { useEventSource } from "base-ui/hooks/useEventSource";
import { ChatMessageList } from "hero-next/blocks/chat";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function ChatPage() {
  const { slug } = useParams<{ slug: string }>();
  const { sendChatMessage } = useEventSource();

  useEffect(() => {
    const { message, clearDraft } = useDraftMessage.getState();
    if (message) {
      clearDraft();
      if (message.conversationID !== slug) {
        return;
      }

      sendChatMessage(message.content, `/api/chat/${slug}`);
    }
  }, []);

  return (
    <div className="flex-1">
      <ChatMessageList />
    </div>
  );
}
