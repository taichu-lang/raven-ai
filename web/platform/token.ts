import { clearSession, storeSession } from "@/app/actions/session";
import { TokenStore } from "base-ui/platform";

// The token is kept in an HttpOnly cookie written by the next.js server (via server actions), so scripts can't read it
// back: `get` always returns null, and the browser attaches the cookie to same-origin requests automatically.
export const cookieTokenStore: TokenStore = {
  get: async () => null,
  set: storeSession,
  clear: clearSession,
};
