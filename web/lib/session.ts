import "server-only";

import { cookies } from "next/headers";

export const SESSION_COOKIE = "raven_session";

// Local development usually runs on plain http, where a `Secure` cookie would be dropped by some browsers (ex: Safari).
// Default to secure in production only; `COOKIE_SECURE` (`true`/`false`) overrides it explicitly.
function isSecure(): boolean {
  const override = process.env.COOKIE_SECURE;
  if (override === "true") return true;
  if (override === "false") return false;
  return process.env.NODE_ENV === "production";
}

// `expiresAt` is a unix timestamp in seconds.
export async function setSessionToken(token: string, expiresAt: number) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: isSecure(),
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt * 1000),
  });
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

export async function clearSessionToken() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function buildAuthHeader(): Promise<HeadersInit> {
  const token = await getSessionToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }

  return {};
}
