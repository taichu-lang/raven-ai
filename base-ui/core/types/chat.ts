export interface Conversation {
  id: number;
  conversation_id: string;
  title: string;
  metadata: Record<string, string>;
  created_at: number;
}
