"use client";

import { useConversationMutations } from "base-ui/hooks/useConversationMutations";

export function Nav() {
  const { conversation } = useConversationMutations();

  return (
    <div className="border-default bg-background sticky top-0 left-0 z-10 flex h-14 shrink-0 items-center border-b px-4">
      {conversation.title && <p className="text-sm">{conversation.title}</p>}
    </div>
  );
}
