"use client";

import { ChatScrollArea } from "hero-next/blocks/chat";
import { Nav } from "./Nav";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatScrollArea>
      <Nav />
      <div className="mx-auto mt-4 flex w-full max-w-5xl flex-1 flex-col px-6">
        {children}
      </div>
    </ChatScrollArea>
  );
}
