"use client";

import { RavenPlatformProvider } from "base-ui/platform";
import { webSkillsLoader } from "./skills";

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  return (
    <RavenPlatformProvider value={{ device: "web", skillsLoader: webSkillsLoader }}>
      {children}
    </RavenPlatformProvider>
  );
}
