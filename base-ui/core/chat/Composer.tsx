"use client";

import { useDraftMessage } from "base-ui/hooks/useDraftMessage";
import { ChatComposer } from "hero-next/chat";
import { useRouter } from "hero-next/i18n/navigation";
import { useTranslations } from "next-intl";

export function Composer({ draft = false }: { draft?: boolean }) {
  const t = useTranslations();
  const router = useRouter();

  const handleSubmit = (content: string) => {
    if (draft) {
      const { setDraft } = useDraftMessage.getState();
      const cid = crypto.randomUUID();
      setDraft({ conversationID: cid, content });
      router.push(`/${cid}`);
    }
  };

  return (
    <ChatComposer
      onSubmit={handleSubmit}
      input={{ placeholder: t("chat.placeholder") }}
    />
  );
}
