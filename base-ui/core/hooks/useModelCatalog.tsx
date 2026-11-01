"use client";

import { useRavenPlatform } from "base-ui/platform";
import { ModelCatalog, groupModelsByFamily } from "base-ui/types/models";
import { useEffect, useMemo, useState } from "react";

export function useModelCatalog() {
  const { baseUrl } = useRavenPlatform();
  const [models, setModels] = useState<ModelCatalog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const client = await fetch(`${baseUrl}/api/v1/models`, {
          signal: controller.signal,
        });
        const response = (await client.json()) as ModelCatalog[];
        setModels(response);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setModels([]);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [baseUrl]);

  const groups = useMemo(() => groupModelsByFamily(models), [models]);

  return { models, groups, loading };
}
