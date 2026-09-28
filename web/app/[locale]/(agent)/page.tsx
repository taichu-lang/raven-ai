"use client";

import { Typography } from "@heroui/react";
import { Composer } from "base-ui/chat";
import { useTranslations } from "next-intl";

export default function ChatPage() {
  const t = useTranslations();

  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-center gap-5">
      <div className="w-full justify-start">
        <Typography type="h3">{t("chat.greeting")}</Typography>
      </div>
      <Composer draft={true} />
    </div>
  );
}
