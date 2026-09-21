"use client";

import { ToggleButton } from "@heroui/react";

import { useThemeToggle } from "@/hooks/use-theme-toggle";

export function ThemeToggle() {
  const { isDark, mounted, toggleTheme } = useThemeToggle();

  return (
    <ToggleButton
      isDisabled={!mounted}
      isSelected={isDark}
      size="sm"
      variant="ghost"
      onChange={toggleTheme}
    >
      {mounted ? (isDark ? "Dark mode" : "Light mode") : "Theme"}
    </ToggleButton>
  );
}
