import { toast } from "@heroui/react";
import { useRavenPlatform } from "base-ui/platform";
import { ApiCodeOK, ApiCodeSystem, ApiResponse } from "base-ui/types/api";
import { AuthMethod, LoginRequest, User, UserAuth } from "base-ui/types/profile";
import { useCallback, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// `unknown` means the session has not been checked yet (ex: the page has just loaded).
export type AuthStatus = "unknown" | "authenticated" | "anonymous";

interface AuthState {
  user: User | null;
  status: AuthStatus;
  method: AuthMethod;
  isModalOpen: boolean;
  // `false` on the server and during the hydration render, `true` once the persisted state is applied on the client.
  // Gate any UI that depends on the persisted `user` with it, otherwise the SSR html paints the logged-out state first.
  hydrated: boolean;

  setHydrated: () => void;
  toggleAuthModal: (open: boolean) => void;
  setMethod: (method: AuthMethod) => void;
  setUser: (user: User) => void;
  setAnonymous: () => void;
  signOut: () => void;
}

// Only `user` is persisted, so the profile can be rendered right after a reload. `status` is deliberately not persisted:
// it stays `unknown` until `restore` has verified the session with the backend.
// The storage is synchronous, so zustand hydrates on creation. `useSyncExternalStore` renders `getInitialState()` while
// hydrating (matches the server render), then re-renders with the persisted user right after, without a mismatch.
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      status: "unknown",
      method: "wechat",
      isModalOpen: false,
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),
      toggleAuthModal: (open) => set({ isModalOpen: open }),
      setMethod: (method) => set({ method }),
      signOut: () => set({ user: null, status: "anonymous" }),
      setUser: (user: User) => set({ user, status: "authenticated" }),
      setAnonymous: () => set({ user: null, status: "anonymous" }),
    }),
    {
      name: "raven-auth",
      partialize: (state) => ({ user: state.user }),
      // Never runs on the server (no storage). On the client it runs synchronously at creation, but React still renders
      // `getInitialState()` (hydrated = false) for the hydration pass, so the flag flips only after hydration finishes.
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

export const useAuthHydrated = () => useAuth((s) => s.hydrated);

export function useAuthExt() {
  const { baseUrl, device, tokenStore } = useRavenPlatform();
  const setUser = useAuth((s) => s.setUser);
  const signOut = useAuth((s) => s.signOut);
  const setAnonymous = useAuth((s) => s.setAnonymous);
  const [pending, setPending] = useState<boolean>(false);

  const login = useCallback(
    async (req: LoginRequest): Promise<number> => {
      try {
        setPending(true);
        const client = await fetch(`${baseUrl}/api/v1/auth/login`, {
          method: "POST",
          body: JSON.stringify(req),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!client.ok) {
          toast.danger("Network issue");
          return ApiCodeSystem;
        }

        const data = (await client.json()) as ApiResponse<UserAuth>;
        if (data.code > 0) {
          return data.code;
        }

        const { token, expires_at, ...user } = data.data;
        // Each platform decides where the token is persisted (HttpOnly cookie, system keychain, ...).
        await tokenStore.set(token, expires_at);
        setUser(user);
        return ApiCodeOK;
      } catch {
        toast.danger("Network issue");
      } finally {
        setPending(false);
      }

      return ApiCodeSystem;
    },
    [baseUrl, tokenStore, setUser],
  );

  const logout = useCallback(async () => {
    try {
      await tokenStore.clear();
    } catch {
      toast.danger("Network issue");
      return;
    }
    signOut();
  }, [tokenStore, signOut]);

  // Restores the session after a reload by asking the backend who the token belongs to.
  const restore = useCallback(async () => {
    try {
      // Web: `token` is always null, the HttpOnly cookie is attached by the browser (and by the next.js route).
      const token = await tokenStore.get();
      if (device === "desktop" && !token) {
        setAnonymous();
        return;
      }

      const res = await fetch(`${baseUrl}/api/v1/auth/me`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.status === 401) {
        await tokenStore.clear().catch(() => {});
        setAnonymous();
        return;
      }

      if (!res.ok) {
        // Do not drop the token on server errors, it may still be valid.
        setAnonymous();
        return;
      }

      const data = (await res.json()) as ApiResponse<User>;
      if (data.code > 0) {
        setAnonymous();
        return;
      }

      setUser(data.data);
    } catch {
      setAnonymous();
    }
  }, [baseUrl, device, tokenStore, setUser, setAnonymous]);

  return { pending, login, logout, restore };
}
