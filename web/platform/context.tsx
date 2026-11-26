"use client";

import { RavenPlatformProvider } from "base-ui/platform";
import { webSkillsLoader } from "./skills";
import { cookieTokenStore } from "./token";

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  return (
    <RavenPlatformProvider
      value={{
        skillsLoader: webSkillsLoader,
        tokenStore: cookieTokenStore,
      }}
    >
      {children}
    </RavenPlatformProvider>
  );
}
