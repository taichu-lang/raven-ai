import { Skill } from "hero-next/chat";
import { createContext, useCallback, useContext, useState } from "react";
import { SkillsLoader } from "./skills";

export type DeviceType = "web" | "desktop";

// RavenPlatform defines all the interfaces that need different implementations depending on the device type.
export interface RavenPlatform {
  device: DeviceType;
  skillsLoader: SkillsLoader;
}

const noopLoader: SkillsLoader = {
  loadSkills: async () => [],
};

const RavenPlatformContext = createContext<RavenPlatform>({
  device: "web",
  skillsLoader: noopLoader,
});

export const useRavenPlatform = () => useContext(RavenPlatformContext);
export const RavenPlatformProvider = RavenPlatformContext.Provider;

export function useLoadSkills() {
  const { skillsLoader } = useRavenPlatform();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadSkills = useCallback(async () => {
    setLoading(true);
    try {
      const skills = await skillsLoader.loadSkills();
      setSkills(skills);
    } finally {
      setLoading(false);
    }
  }, [skillsLoader]);

  return { skills, loadSkills, loading };
}
