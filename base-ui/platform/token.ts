export interface TokenStore {
  // Returns null if there is no token or it has expired.
  get: () => Promise<string | null>;
  // `expiresAt` is a unix timestamp in seconds.
  set: (token: string, expiresAt: number) => Promise<void>;
  clear: () => Promise<void>;
}

// Used by platforms whose token is managed outside of the ui layer (ex: web keeps it in an HttpOnly cookie that is
// written by the next.js server and attached to requests by the browser automatically).
export const noopTokenStore: TokenStore = {
  get: async () => null,
  set: async () => {},
  clear: async () => {},
};
