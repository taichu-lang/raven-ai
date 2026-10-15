"server-only";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    console.log("server url is required.");
    return NextResponse.error();
  }

  const params = request.nextUrl.searchParams;
  const url = new URL(`${serverUrl}/api/v1/conversations`);
  params.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url, {
    method: "GET",
  });
  if (response.status !== 200) {
    console.log("failed to get conversations, status: ", response.status);
    return NextResponse.error();
  }

  const data = await response.json();
  return NextResponse.json(data);
}
