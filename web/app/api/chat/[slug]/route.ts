"server-only";

import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    return NextResponse.error();
  }

  const { slug } = await params;
  const headers = Object.fromEntries(request.headers);

  const upstream = await fetch(`${serverUrl}/api/v1/chat/${slug}`, {
    method: "POST",
    headers: { ...headers },
    body: await request.text(),
    signal: request.signal,
  });

  if (!upstream.ok) {
    const err = await upstream.text().catch(() => "server error");
    const event = `event: error\ndata: ${err}\n\n`;
    return new Response(event, {
      // We can not get the status code from fetchEventSource, so just be 200.
      status: 200,
      headers: {
        // Content type must be `text/event-stream`, as fetchEventSource only
        // supports event stream. If content type is `application/json` here,
        // `onerror` callback will be called, however, data in the callback is
        // not the `event` above, but a content type mismatch error.
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
