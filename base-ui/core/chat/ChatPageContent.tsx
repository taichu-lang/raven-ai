"use client";

import { Composer, getConversation } from "base-ui/chat";
import { useConversationMutations } from "base-ui/hooks/useConversationMutations";
import { useDraftMessage } from "base-ui/hooks/useDraftMessage";
import { useEventSource } from "base-ui/hooks/useEventSource";
import { useRavenPlatform } from "base-ui/platform";
import {
  ChatMessageList,
  ChatMessageListHandler,
  ScrollBottomButton,
  useChatContext,
} from "hero-next/blocks/chat";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useRef, useState } from "react";

export function ChatPageContent({ slug }: { slug: string }) {
  const t = useTranslations();
  const { sendChatMessage } = useEventSource();
  const messageListHandler = useRef<ChatMessageListHandler>(null);
  const [atBottom, setAtBottom] = useState<boolean>(false);
  const { setConversation } = useConversationMutations();
  const { hydrate, setStatus } = useChatContext();
  const { baseUrl } = useRavenPlatform();

  // The conversation that this page instance has already initialized. React invokes mount effects
  // twice in development, and the first invocation clears the draft, so without this guard the
  // second one would mistake a new conversation for a history navigation.
  const initializedRef = useRef<string | null>(null);

  const handleTurnStarted = useCallback((id: string) => {
    messageListHandler.current?.stickToMessage(id);
  }, []);

  const fetchConversation = useCallback(async () => {
    setStatus("loading");
    const response = await getConversation(baseUrl, slug);
    if (response) {
      setConversation(response);
      hydrate(response.messages);
    }

    setStatus("idle");
  }, [setStatus, baseUrl, setConversation, hydrate, slug]);

  useEffect(() => {
    if (initializedRef.current === slug) {
      return;
    }

    initializedRef.current = slug;

    const { message, clearDraft } = useDraftMessage.getState();
    // A matching draft means the message was submitted from the landing page, which only stores it
    // and navigates here; the conversation itself is created by this first turn.
    if (message?.conversationID === slug) {
      clearDraft();
      sendChatMessage(
        {
          model: "gpt-4.1",
          text: message.content,
          metadata: {
            skills: message.skills,
          },
        },
        `${baseUrl}/api/v1/chat/${slug}`,
        handleTurnStarted,
      );
      return;
    }

    // Either navigated from the history list, or the draft belongs to another conversation.
    clearDraft();
    fetchConversation();
  }, [baseUrl, fetchConversation, slug, sendChatMessage, handleTurnStarted]);

  return (
    <React.Fragment>
      <div className="flex-1">
        <ChatMessageList handleRef={messageListHandler} scrollPositionListener={setAtBottom} />
      </div>
      {/* Radius of Composer is 24px, using '-mx-6' to enable Composer to cover message list when scrolling to top.*/}
      <div className="sticky bottom-0 left-0 z-10 -mx-6">
        <ScrollBottomButton onClick={() => messageListHandler.current?.scrollToBottom()} visible={!atBottom} />
        <Composer url={`${baseUrl}/api/v1/chat/${slug}`} onTurnStarted={handleTurnStarted} />
        <p className="text-background-inverse bg-background py-2 text-center text-xs">
          {t("chat.reliabilityTip")}
        </p>
      </div>
    </React.Fragment>
  );
}
