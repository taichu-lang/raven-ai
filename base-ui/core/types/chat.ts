import { Turn } from "hero-next/chat";

// Conversation is the brief summary of a conversation.
export interface Conversation {
  id: number;
  conversation_id: string;
  title: string;
  metadata: Record<string, string>;
  created_at: number;
}

// ConversationView is the full conversation view, including all turns.
export interface ConversationView extends Conversation {
  turns: Turn[];
}
