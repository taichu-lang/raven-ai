import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Preference {
  locale: string;
  theme: string;
  // Selected model id, null means "auto".
  model: string | null;
  setLocale: (locale: string) => void;
  setTheme: (theme: string) => void;
  setModel: (model: string | null) => void;
}

export const usePreference = create<Preference>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "raven-preference",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ locale, theme, model }) => ({ locale, theme, model }),
      // Hydration is triggered manually (see PreferenceSync in AppSidebar)
      // so the server and client first render stay consistent.
      skipHydration: true,
    },
  ),
);
