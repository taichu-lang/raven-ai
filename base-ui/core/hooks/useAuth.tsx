import { create } from "zustand";

type AuthMethod = "wechat" | "email";

export interface User {
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  method: AuthMethod;
  isModalOpen: boolean;

  toggleAuthModal: (open: boolean) => void;
  setMethod: (method: AuthMethod) => void;
  login: (input?: { account?: string }) => Promise<void>;
  signOut: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  method: "wechat",
  isModalOpen: false,

  toggleAuthModal: (open) => set({ isModalOpen: open }),
  setMethod: (method) => set({ method }),

  login: async (input) => {
    // TODO: replace with the real backend — account login posts credentials to
    // /auth/login; QR login is confirmed by polling/SSE on the qr ticket.
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({
      user: { name: input?.account ?? "leo", email: "leo@gmail.com" },
      isModalOpen: false,
    });
  },

  signOut: () => set({ user: null }),
}));
