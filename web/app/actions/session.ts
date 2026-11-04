"use server";

import { clearSessionToken, setSessionToken } from "@/lib/session";

// Server actions are public POST endpoints, so the arguments must be validated.
export async function storeSession(token: string, expiresAt: number) {
  if (typeof token !== "string" || !token || typeof expiresAt !== "number" || !Number.isFinite(expiresAt)) {
    throw new Error("invalid session");
  }
  await setSessionToken(token, expiresAt);
}

export async function clearSession() {
  await clearSessionToken();
}
