"server-only";

import { buildAuthHeader } from "base-ui/platform/cookie";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    return NextResponse.error();
  }

  const { slug } = await params;

  const auth = await buildAuthHeader();
  const response = await fetch(`${serverUrl}/api/v1/mcp/${slug}/enable`, {
    method: "POST",
    headers: { ...auth },
    body: await request.text(),
    signal: request.signal,
  });

  const data = await response.json();
  return NextResponse.json(data);
}
