"use client";

import { ToggleButton } from "@heroui/react";
import { useTheme } from "hero-next/theme";

export function ThemeToggle() {
  const { isDark, mounted, toggleTheme } = useTheme();

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
