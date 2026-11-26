export type Transport = "stdio" | "http";

export interface MCPServer {
  id: number;
  name: string;
  description: string;
  transport: Transport;
  command: string;
  args: string[];
  url: string;
  headers: Record<string, string>;
  enabled: boolean;
}
