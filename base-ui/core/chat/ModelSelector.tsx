"use client";

import { Dropdown, Label, Switch, Tooltip } from "@heroui/react";
import { usePreference } from "base-ui/hooks/usePreference";
import { groupModelsByFamily, MODELS } from "base-ui/types/models";
import { ChatComposeButton } from "hero-next/chat";
import { BoxIcon, ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const GROUPS = groupModelsByFamily(MODELS);

export function ModelSelector() {
  const t = useTranslations();
  const { model, setModel } = usePreference();
  const selected = MODELS.find((m) => m.id === model);
  const auto = !selected;

  const handleAutoChange = (isSelected: boolean) => {
    setModel(isSelected ? null : MODELS[0].id);
  };

  return (
    <Dropdown>
      <Tooltip>
        <Tooltip.Trigger>
          <ChatComposeButton aria-label={t("chat.modelPreference")}>
            <BoxIcon className="text-muted size-5" />
          </ChatComposeButton>
        </Tooltip.Trigger>
        <Tooltip.Content>{auto ? t("chat.modelPreference") : selected.name}</Tooltip.Content>
      </Tooltip>
      <Dropdown.Popover placement="top right" className="w-64">
        <div className="mx-3 mt-3 mb-1 flex items-center justify-between text-sm font-medium">
          {t("chat.modelPreference")}
          <Switch size="sm" isSelected={auto} onChange={handleAutoChange}>
            <Switch.Content className="text-muted text-xs">
              {t("chat.modelAuto")}
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch.Content>
          </Switch>
        </div>
        <Dropdown.Menu>
          {GROUPS.map(([family, models]) => (
            <Dropdown.SubmenuTrigger key={family}>
              <Dropdown.Item id={family} textValue={family}>
                <Label className="capitalize">{family}</Label>
                <ChevronRightIcon className="text-muted ms-auto size-4 shrink-0" />
              </Dropdown.Item>
              <Dropdown.Popover>
                <Dropdown.Menu
                  selectedKeys={selected ? [selected.id] : []}
                  selectionMode="single"
                  onSelectionChange={(keys) => {
                    const [key] = keys;
                    if (key) {
                      setModel(key as string);
                    }
                  }}
                >
                  {models.map((m) => (
                    <Dropdown.Item key={m.id} id={m.id} textValue={m.name}>
                      <Dropdown.ItemIndicator />
                      <Label>{m.name}</Label>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown.SubmenuTrigger>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
