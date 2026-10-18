import { ApiResponse } from "base-ui/types/api";
import { ConversationView } from "base-ui/types/chat";

export async function getConversation(
  server: string,
  conversationID: string,
): Promise<ConversationView | null> {
  try {
    const client = await fetch(`${server}/api/v1/conversations/${conversationID}`);
    const response = (await client.json()) as ApiResponse<ConversationView>;
    if (response.code === 0) {
      return response.data;
    }
  } catch {}

  return null;
}
