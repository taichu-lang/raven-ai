import { create } from "zustand";

interface Preference {
  locale: string;
  theme: string;
  // Selected model id, null means "auto".
  model: string | null;
  setLocale: (locale: string) => void;
  setTheme: (theme: string) => void;
  setModel: (model: string | null) => void;
}

export const usePreference = create<Preference>((set) => ({
  locale: "zh",
  theme: "dark",
  model: null,

  setLocale: (locale: string) => {
    set({ locale });
  },

  setTheme: (theme: string) => {
    set({ theme });
  },

  setModel: (model: string | null) => {
    set({ model });
  },
}));
