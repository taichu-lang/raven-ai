"use client";

import { Card } from "@heroui/react";
import { useRavenPlatform } from "base-ui/platform";
import { Loading } from "hero-next/effects";
import { Button } from "hero-next/ui/Button";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { MCPServer } from "../types/mcp";
import { enableMCP, getList } from "./lib";

function ServerCard({ id, name, description, command }: MCPServer) {
  const { baseUrl } = useRavenPlatform();

  return (
    <Card className="max-w-xs">
      <Card.Header className="gap-2">
        <Card.Title className="text-base">{name}</Card.Title>
        <Card.Description>{description}</Card.Description>
        <Button
          className="inset-e-3 absolute top-3"
          size="sm"
          variant="outline"
          onClick={() => enableMCP(baseUrl, id)}
        >
          Enable
        </Button>
      </Card.Header>
      <Card.Content>
        <code>{command}</code>
      </Card.Content>
    </Card>
  );
}

export function MCPPageContent() {
  const [from, setFrom] = useState<number>(0);
  const [servers, setServers] = useState<MCPServer[]>([]);
  const { baseUrl } = useRavenPlatform();
  const [loading, startTransition] = useTransition();
  const initRef = useRef<boolean>(false);

  const getServers = useCallback(async () => {
    try {
      const data = await getList(baseUrl, from);
      setServers((prev) => [...prev, ...data]);

      const last = data.at(-1);
      if (last) {
        setFrom(last.id);
      }
    } catch {}
  }, [baseUrl, from]);

  useEffect(() => {
    if (initRef.current) {
      return;
    }

    initRef.current = true;
    startTransition(getServers);
  }, [getServers]);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid-col-3 grid gap-6">
        {servers.map((s) => (
          <ServerCard {...s} key={s.id} />
        ))}
      </div>
      {loading && <Loading />}
    </div>
  );
}
