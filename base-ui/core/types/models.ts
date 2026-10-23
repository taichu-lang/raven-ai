export interface Model {
  id: string;
  name: string;
  provider: string;
  family: string;
}

export const MODELS: Model[] = [
  { id: "gpt-5.5", name: "GPT-5.5", provider: "openai", family: "openai" },
  { id: "codex-5.3", name: "Codex 5.3", provider: "openai", family: "openai" },
  { id: "sonnet-4.8", name: "Sonnet 4.8", provider: "anthropic", family: "claude" },
  { id: "opus-4.8", name: "Opus 4.8", provider: "anthropic", family: "claude" },
  { id: "qwen3.8-max", name: "Qwen 3.8 Max", provider: "alibaba", family: "qwen" },
];

export function groupModelsByFamily(models: Model[]): [string, Model[]][] {
  const groups = new Map<string, Model[]>();
  for (const m of models) {
    groups.set(m.family, [...(groups.get(m.family) ?? []), m]);
  }
  return [...groups];
}
