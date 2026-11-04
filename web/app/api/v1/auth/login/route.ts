"server-only";

import { NextRequest, NextResponse } from "next/server";

// Passes the login request through to the backend. Persisting the returned token is done by the client via
// `tokenStore` (see `app/actions/session.ts`).
export async function POST(request: NextRequest) {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    console.log("server url is required.");
    return NextResponse.error();
  }

  const response = await fetch(`${serverUrl}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  });
  if (!response.ok) {
    console.log("failed to login, status: ", response.status);
    return NextResponse.error();
  }

  return NextResponse.json(await response.json());
}
