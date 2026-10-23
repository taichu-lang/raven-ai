"use client";

import { RavenPlatformProvider } from "base-ui/platform";
import { localSkillsLoader } from "./skills";

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  return (
    <RavenPlatformProvider
      value={{
        baseUrl: "http://localhost:8001",
        device: "desktop",
        skillsLoader: localSkillsLoader,
        // Dynamic routing does not support in tauri app, as `output` is `export`. Use static routing.
        conversationRouter: (id) => `/chat?id=${id}`,
      }}
    >
      {children}
    </RavenPlatformProvider>
  );
}
