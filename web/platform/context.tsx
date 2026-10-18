"use client";

import { RavenPlatformProvider } from "base-ui/platform";
import { webSkillsLoader } from "./skills";

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  return (
    <RavenPlatformProvider
      value={{ baseUrl: "", device: "web", skillsLoader: webSkillsLoader, conversationRouter: (id) => `/${id}` }}
    >
      {children}
    </RavenPlatformProvider>
  );
}
