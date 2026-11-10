"server-only";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    console.log("server url is required.");
    return NextResponse.error();
  }

  const response = await fetch(`${serverUrl}/api/v1/auth/otp/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  });
  if (!response.ok) {
    console.log("failed to verify code, status: ", response.status);
    return NextResponse.error();
  }

  return NextResponse.json(await response.json());
}
