"use client";

import { ChatPageContent } from "base-ui/chat";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const { slug } = useParams<{ slug: string }>();
  return <ChatPageContent slug={slug} />;
}
