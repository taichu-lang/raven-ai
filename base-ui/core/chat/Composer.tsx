"use client";

import { Chip } from "@heroui/react";
import { useDraftMessage } from "base-ui/hooks/useDraftMessage";
import { useEventSource } from "base-ui/hooks/useEventSource";
import { useRavenPlatform } from "base-ui/platform";
import {
  ChatComposer,
  ChatComposerDrawer,
  ChatComposerValue,
  useActiveTurn,
  useChatView,
} from "hero-next/chat";
import { Loading } from "hero-next/effects";
import { useRouter } from "hero-next/i18n/navigation";
import { useTranslations } from "next-intl";
import React from "react";
import { ActionSelector } from "./ActionSelector";
import { ConfirmationPanel } from "./ConfirmationPanel";
import { ModelSelector } from "./ModelSelector";

function NotificationDrawer({ url }: { url: string }) {
  const t = useTranslations();
  const status = useActiveTurn((s) => s.status);
  const runningToolCalls = useActiveTurn((s) => s.runningToolCalls);
  const confirmation = useActiveTurn((s) => s.confirmation);
  const loading = useChatView((s) => s.loading);
  const { sendChatMessage } = useEventSource();

  // Human-in-the-loop: the agent is waiting for the user to answer its questions.
  // Only a single HumanConfirmation is supported for now.
  if (status === "approval" && confirmation.length > 0) {
    return (
      <ChatComposerDrawer>
        <ConfirmationPanel
          confirmation={confirmation[0]}
          // Resume the paused turn: same endpoint, no new user message, only the answers.
          onSubmit={(answers) =>
            sendChatMessage({ resume: { id: confirmation[0].id, name: confirmation[0].name, answers } }, url)
          }
        />
      </ChatComposerDrawer>
    );
  }

  let node: React.ReactNode = null;
  if (loading) {
    node = t("chat.loadingConversation");
  } else if (status === "sending") {
    node = t("chat.initializingAgent");
  } else if (status === "reasoning") {
    node = t("chat.thinking");
  } else if (status === "streaming") {
    node = t("chat.modelProcessing");
  } else if (runningToolCalls > 0) {
    node = (
      <>
        <Chip>{runningToolCalls}</Chip>
        {t("chat.runningTools")}
      </>
    );
  }

  if (node) {
    return (
      <ChatComposerDrawer className="text-muted gap-2 text-xs">
        <Loading size="xs" />
        {node}
      </ChatComposerDrawer>
    );
  }

  return null;
}

export function Composer({ url, onTurnStarted }: { url: string; onTurnStarted: (id: string) => void }) {
  const t = useTranslations();
  const { sendChatMessage } = useEventSource();
  const status = useActiveTurn((s) => s.status);
  const loading = useChatView((s) => s.loading);

  const handleSubmit = ({ markdown, skills }: ChatComposerValue) => {
    sendChatMessage(
      {
        // markdown inline each skill as `<skill>` xml, same as the draft (first message) path.
        text: markdown,
        metadata: {
          skills,
        },
      },
      url,
      onTurnStarted,
    );
  };

  return (
    <ChatComposer
      onSubmit={handleSubmit}
      input={{ placeholder: t("chat.placeholder") }}
      drawer={<NotificationDrawer url={url} />}
      footActions={<ActionSelector />}
      footContext={<ModelSelector />}
      disabled={loading || status !== "idle"}
    />
  );
}

export function DraftComposer() {
  const t = useTranslations();
  const router = useRouter();
  const { conversationRouter } = useRavenPlatform();

  const handleSubmit = ({ skills, markdown }: ChatComposerValue) => {
    // Store the draft and navigate; the slug page's ChatPageContent sends it. No request
    // starts here, so no AbortController is involved — the controller is created by
    // sendChatMessage inside the slug page's ChatContext, where the cancel button can reach it.
    const { setDraft } = useDraftMessage.getState();
    const cid = crypto.randomUUID();
    setDraft({ conversationID: cid, content: markdown, skills });
    router.push(conversationRouter(cid));
  };

  // No ChatContext here.
  return (
    <ChatComposer
      onSubmit={handleSubmit}
      input={{ placeholder: t("chat.placeholder") }}
      footActions={<ActionSelector />}
      footContext={<ModelSelector />}
    />
  );
}
