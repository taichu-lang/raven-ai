"use client";

import { useDraftMessage } from "base-ui/hooks/useDraftMessage";
import { useEventSource } from "base-ui/hooks/useEventSource";
import { useRavenPlatform } from "base-ui/platform";
import { ChatComposer, ChatComposerValue } from "hero-next/chat";
import { useRouter } from "hero-next/i18n/navigation";
import { useTranslations } from "next-intl";
import { ActionSelector } from "./ActionSelector";

function BaseChatComposer({ onSubmit }: { onSubmit: (value: ChatComposerValue) => void }) {
  const t = useTranslations();
  return (
    <ChatComposer
      onSubmit={onSubmit}
      input={{ placeholder: t("chat.placeholder") }}
      footActions={<ActionSelector />}
    />
  );
}

export function Composer({ url, onTurnStarted }: { url: string; onTurnStarted: (id: string) => void }) {
  const { sendChatMessage } = useEventSource();

  const handleSubmit = ({ text, skills }: ChatComposerValue) => {
    sendChatMessage(
      {
        model: "gpt-4.1",
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

  return <BaseChatComposer onSubmit={handleSubmit} />;
}
