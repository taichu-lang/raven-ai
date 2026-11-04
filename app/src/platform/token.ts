import { TokenStore } from "base-ui/platform";
import { invoke } from "@tauri-apps/api/core";

// The token is persisted in the system keychain by the rust side, see `src-tauri/src/token.rs`.
export const keychainTokenStore: TokenStore = {
  get: () => invoke<string | null>("token_get"),
  set: (token, expiresAt) => invoke<void>("token_set", { token, expiresAt }),
  clear: () => invoke<void>("token_clear"),
};
