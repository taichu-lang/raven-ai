"server-only";

import { buildAuthHeader, clearSessionToken } from "@/lib/session";
import { NextResponse } from "next/server";

// Returns the current user of the session cookie. The token is attached here, so it never reaches the browser scripts.
export async function GET() {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    console.log("server url is required.");
    return NextResponse.error();
  }

  const auth = await buildAuthHeader();
  const response = await fetch(`${serverUrl}/api/v1/auth/me`, {
    headers: auth,
  });
  if (response.status === 401) {
    // The token is expired or revoked, drop the stale cookie.
    await clearSessionToken();
    return NextResponse.json({ code: 401, message: "unauthorized" }, { status: 401 });
  }

  if (!response.ok) {
    console.log("failed to get current user, status: ", response.status);
    return NextResponse.error();
  }

  return NextResponse.json(await response.json());
}
