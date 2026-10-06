"use client";

import { Composer } from "base-ui/chat";
import { useDraftMessage } from "base-ui/hooks/useDraftMessage";
import { useEventSource } from "base-ui/hooks/useEventSource";
import { ChatMessageList, ChatMessageListHandler, ScrollBottomButton } from "hero-next/blocks/chat";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function ChatPage() {
  const t = useTranslations();
  const { slug } = useParams<{ slug: string }>();
  const { sendChatMessage } = useEventSource();
  const messageListHandler = useRef<ChatMessageListHandler>(null);
  const [atBottom, setAtBottom] = useState<boolean>(false);

  const handleTurnStarted = (id: string) => {
    messageListHandler.current?.stickToMessage(id);
  };

  useEffect(() => {
    const { message, clearDraft } = useDraftMessage.getState();
    if (message) {
      clearDraft();
      if (message.conversationID !== slug) {
        return;
      }

      sendChatMessage(message.content, `/api/chat/${slug}`, handleTurnStarted);
    }
  }, []);

  return (
    <React.Fragment>
      <div className="flex-1">
        <ChatMessageList handleRef={messageListHandler} scrollPositionListener={setAtBottom} />
      </div>
      {/* Radius of Composer is 24px, using '-mx-6' to enable Composer to cover message list when scrolling to top.*/}
      <div className="sticky bottom-0 left-0 z-10 -mx-6">
        <ScrollBottomButton onClick={() => messageListHandler.current?.scrollToBottom()} visible={!atBottom} />
        <Composer url={`/api/chat/${slug}`} onTurnStarted={handleTurnStarted} />
        <p className="text-background-inverse bg-background py-2 text-center text-xs">
          {t("chat.reliabilityTip")}
        </p>
      </div>
    </React.Fragment>
  );
}
