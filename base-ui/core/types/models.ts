export interface ReasoningOption {
  type: string;
  values: string[];
}

export interface Modalities {
  input: string[];
  output: string[];
}

export interface ModelLimit {
  context: number;
  input: number;
  output: number;
}

export interface ModelCost {
  input: number;
  output: number;
  cache_read: number;
  cache_write: number;
}

export interface ModelCatalog {
  id: string;
  name: string;
  description: string;
  family: string;
  reasoning: boolean;
  reasoning_options: ReasoningOption[];
  tool_call: boolean;
  structured_output: boolean;
  modalities: Modalities;
  limit: ModelLimit;
  cost: ModelCost;
  protocols: string[];
  provider: string;
}

export function groupModelsByFamily(models: ModelCatalog[]): [string, ModelCatalog[]][] {
  const groups = new Map<string, ModelCatalog[]>();
  for (const m of models) {
    groups.set(m.family, [...(groups.get(m.family) ?? []), m]);
  }
  return [...groups];
}
