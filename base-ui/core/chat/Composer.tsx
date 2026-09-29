"use client";

import { useDraftMessage } from "base-ui/hooks/useDraftMessage";
import { useEventSource } from "base-ui/hooks/useEventSource";
import { ChatComposer } from "hero-next/chat";
import { useRouter } from "hero-next/i18n/navigation";
import { useTranslations } from "next-intl";

export function Composer({
  url,
  onTurnStarted,
}: {
  url: string;
  onTurnStarted: (index: number) => void;
}) {
  const t = useTranslations();
  const { sendChatMessage } = useEventSource();

  const handleSubmit = (content: string) => {
    sendChatMessage(content, url, onTurnStarted);
  };

  return (
    <ChatComposer
      onSubmit={handleSubmit}
      input={{ placeholder: t("chat.placeholder") }}
    />
  );
}

export function DraftComposer() {
  const t = useTranslations();
  const router = useRouter();

  const handleSubmit = (content: string) => {
    const { setDraft } = useDraftMessage.getState();
    const cid = crypto.randomUUID();
    setDraft({ conversationID: cid, content });
    router.push(`/${cid}`);
  };

  return (
    <ChatComposer
      onSubmit={handleSubmit}
      input={{ placeholder: t("chat.placeholder") }}
    />
  );
}
