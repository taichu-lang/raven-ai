"use client";

import { ChatPageContent } from "base-ui/chat";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Static export cannot enumerate conversation ids, so the id lives in the query string.
export default function ChatPageRoute() {
  return (
    <Suspense>
      <ChatPage />
    </Suspense>
  );
}

function ChatPage() {
  const slug = useSearchParams().get("id") ?? "";
  return <ChatPageContent slug={slug} />;
}
