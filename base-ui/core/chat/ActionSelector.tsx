"use client";

import { Dropdown, Label } from "@heroui/react";
import { useLoadSkills } from "base-ui/platform";
import { ChatComposeButton, Skill, useChatComposer } from "hero-next/chat";
import { ChevronRightIcon, HammerIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

function SkillSelector() {
  const t = useTranslations();
  const { loadSkills, skills } = useLoadSkills();
  const { addSkill } = useChatComposer();

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  if (skills.length === 0) {
    return null;
  }

  const handleSkillSelected = (s: Skill) => {
    addSkill(s);
  };

  return (
    <Dropdown.Menu>
      <Dropdown.SubmenuTrigger>
        <Dropdown.Item id="skills" textValue={t("chat.skills")}>
          <HammerIcon className="text-muted size-4 shrink-0" />
          <Label>{t("chat.skills")}</Label>
          <Dropdown.SubmenuIndicator>
            <ChevronRightIcon className="text-muted size-4" />
          </Dropdown.SubmenuIndicator>
        </Dropdown.Item>
        <Dropdown.Popover>
          <Dropdown.Menu onAction={(_, v) => handleSkillSelected(v as Skill)}>
            {skills.map((skill) => (
              <Dropdown.Item key={skill.name} id={skill.name} textValue={skill.name} value={skill}>
                <Label>{skill.name}</Label>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown.SubmenuTrigger>
    </Dropdown.Menu>
  );
}

export function ActionSelector() {
  return (
    <Dropdown>
      <ChatComposeButton>
        <PlusIcon className="text-muted size-5" />
      </ChatComposeButton>
      <Dropdown.Popover placement="top left">
        <SkillSelector />
      </Dropdown.Popover>
    </Dropdown>
  );
}
