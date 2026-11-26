import { ApiResponse, EmptyPayload } from "../types/api";
import { MCPServer } from "../types/mcp";

export async function getList(url: string, from: number): Promise<MCPServer[]> {
  try {
    const client = await fetch(`${url}/api/v1/mcp?from=${from}`, {
      method: "GET",
    });
    const response = (await client.json()) as ApiResponse<MCPServer[]>;
    if (response.code !== 0) {
      return [];
    }

    return response.data;
  } catch {
    return [];
  }
}

export async function enableMCP(url: string, id: number): Promise<boolean> {
  try {
    const client = await fetch(`${url}/api/v1/mcp/${id}`, {
      method: "POST",
    });
    const response = (await client.json()) as ApiResponse<EmptyPayload>;
    return response.code === 0;
  } catch {
    return false;
  }
}
