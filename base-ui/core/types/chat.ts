import { Message } from "hero-next/chat";

export interface Conversation {
  id: number;
  conversation_id: string;
  title: string;
  metadata: Record<string, string>;
  created_at: number;
}

export interface ConversationView extends Conversation {
  messages: Message[];
}
