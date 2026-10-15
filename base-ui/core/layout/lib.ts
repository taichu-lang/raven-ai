import { ApiResponse } from "base-ui/types/api";
import { Conversation } from "base-ui/types/chat";

export async function getConversations(
  from: number,
  limit: number,
  signal?: AbortSignal,
): Promise<Conversation[]> {
  try {
    const params = new URLSearchParams();
    params.set("from", from.toString());
    params.set("limit", limit.toString());
    const client = await fetch(`/api/conversations?${params}`, { signal });
    const response = (await client.json()) as ApiResponse<Conversation[]>;
    if (response.code === 0) {
      return response.data;
    }
    return [];
  } catch {
    return [];
  }
}
