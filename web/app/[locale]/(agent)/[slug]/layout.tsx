"use client";

import { Composer } from "base-ui/chat";
import { ChatScrollArea } from "hero-next/blocks/chat";
import { useTranslations } from "next-intl";
import { Nav } from "./Nav";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations();

  return (
    <ChatScrollArea>
      <Nav />
      <div className="mx-auto mt-4 flex w-full max-w-5xl flex-1 flex-col px-6">
        {children}
        <div className="bg-background sticky bottom-0 left-0 z-10">
          <Composer />
          <p className="text-background-inverse my-2 text-center text-xs">
            {t("chat.reliabilityTip")}
          </p>
        </div>
      </div>
    </ChatScrollArea>
  );
}
