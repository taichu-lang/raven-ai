"use client";

import { Chip } from "@heroui/react";
import { useDraftMessage } from "base-ui/hooks/useDraftMessage";
import { useEventSource } from "base-ui/hooks/useEventSource";
import { useRavenPlatform } from "base-ui/platform";
import { useChatContext } from "hero-next/blocks/chat";
import { ChatComposer, ChatComposerDrawer, ChatComposerValue } from "hero-next/chat";
import { Loading } from "hero-next/effects";
import { useRouter } from "hero-next/i18n/navigation";
import { useTranslations } from "next-intl";
import React from "react";
import { ActionSelector } from "./ActionSelector";
import { ModelSelector } from "./ModelSelector";

function NotificationDrawer() {
  const { status, runningToolCalls } = useChatContext();

  let node: React.ReactNode = null;
  switch (status) {
    case "loading":
      node = "正在加载对话";
      break;

    case "sending":
      node = "Agent初始化";
      break;

    case "streaming":
      node = "模型处理中";
      break;

    default:
      if (runningToolCalls > 0) {
        node = (
          <>
            <Chip>{runningToolCalls}</Chip>工具正在执行
          </>
        );
      } else {
        node = null;
      }
      break;
  }

  if (node) {
    return (
      <ChatComposerDrawer className="text-accent-foreground gap-2 text-xs">
        <Loading size="xs" />
        {node}
      </ChatComposerDrawer>
    );
  }

  return null;
}

function BaseChatComposer({
  onSubmit,
  enableDrawer = true,
}: {
  onSubmit: (value: ChatComposerValue) => void;
  enableDrawer?: boolean;
}) {
  const t = useTranslations();
  return (
    <ChatComposer
      onSubmit={onSubmit}
      input={{ placeholder: t("chat.placeholder") }}
      drawer={enableDrawer ? <NotificationDrawer /> : null}
      footActions={<ActionSelector />}
      footContext={<ModelSelector />}
    />
  );
}

export function Composer({ url, onTurnStarted }: { url: string; onTurnStarted: (id: string) => void }) {
  const { sendChatMessage } = useEventSource();

  const handleSubmit = ({ text, skills }: ChatComposerValue) => {
    sendChatMessage(
      {
        text: text,
        metadata: {
          skills,
        },
      },
      url,
      onTurnStarted,
    );
  };

  return <BaseChatComposer onSubmit={handleSubmit} />;
}

export function DraftComposer() {
  const router = useRouter();
  const { conversationRouter } = useRavenPlatform();

  const handleSubmit = ({ skills, markdown }: ChatComposerValue) => {
    const { setDraft } = useDraftMessage.getState();
    const cid = crypto.randomUUID();
    setDraft({ conversationID: cid, content: markdown, skills });
    router.push(conversationRouter(cid));
  };

  // No ChatContext here.
  return <BaseChatComposer onSubmit={handleSubmit} enableDrawer={false} />;
}
