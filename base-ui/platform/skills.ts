import { Skill } from "hero-next/chat";

export interface SkillsLoader {
  loadSkills: () => Promise<Skill[]>;
}
