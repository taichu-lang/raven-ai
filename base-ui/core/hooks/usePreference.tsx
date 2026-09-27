import { create } from "zustand";

interface Preference {
  locale: string;
  theme: string;
  setLocale: (locale: string) => void;
  setTheme: (theme: string) => void;
}

export const usePreference = create<Preference>((set) => ({
  locale: "zh",
  theme: "dark",

  setLocale: (locale: string) => {
    set({ locale });
  },

  setTheme: (theme: string) => {
    set({ theme });
  },
}));
