"use client";

import { Button } from "@heroui/react";
import { Composer } from "base-ui/chat";
import { useDraftMessage } from "base-ui/hooks/useDraftMessage";
import { useEventSource } from "base-ui/hooks/useEventSource";
import { ChatMessageList, ChatMessageListHandler } from "hero-next/blocks/chat";
import { ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

export default function ChatPage() {
  const t = useTranslations();
  const { slug } = useParams<{ slug: string }>();
  const { sendChatMessage } = useEventSource();
  const messageListHandler = useRef<ChatMessageListHandler>(null);

  const handleTurnStarted = (index: number) => {
    messageListHandler.current?.stickToMessage(index);
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
        <ChatMessageList handleRef={messageListHandler} />
      </div>
      <div className="bg-background sticky bottom-0 left-0 z-10">
        <Button isIconOnly onClick={() => messageListHandler.current?.scrollToBottom()}>
          <ArrowDown className="text-muted size-4" />
        </Button>
        <Composer url={`/api/chat/${slug}`} onTurnStarted={handleTurnStarted} />
        <p className="text-background-inverse my-2 text-center text-xs">{t("chat.reliabilityTip")}</p>
      </div>
    </React.Fragment>
  );
}
