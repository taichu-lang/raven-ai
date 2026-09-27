import { Typography } from "@heroui/react";

import { ThemeToggle } from "./_components/theme-toggle";
import { ButtonsSection } from "./sections/buttons";
import { ChatSection } from "./sections/chat";
import { DataDisplaySection } from "./sections/data-display";
import { FeedbackSection } from "./sections/feedback";
import { FormsSection } from "./sections/forms";
import { LayoutSection } from "./sections/layout";
import { NavigationSection } from "./sections/navigation";
import { OverlaysSection } from "./sections/overlays";

const NAV_ITEMS = [
  { id: "buttons", label: "Buttons" },
  { id: "forms", label: "Forms" },
  { id: "data-display", label: "Data Display" },
  { id: "feedback", label: "Feedback" },
  { id: "navigation", label: "Navigation" },
  { id: "overlays", label: "Overlays" },
  { id: "layout", label: "Layout & Typography" },
  { id: "chat", label: "ChatMessage" },
];

export default function ShowcasePage() {
  return (
    <div className="flex flex-col gap-8 pb-24">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Typography type="h1">HeroUI Component Showcase</Typography>
          <Typography color="muted" type="body-sm">
            Live demos of the most common HeroUI v3 components — use this page
            to preview UI adjustments across the whole set at once.
          </Typography>
        </div>
        <ThemeToggle />
      </div>

      <nav className="border-default flex flex-wrap gap-x-4 gap-y-2 rounded-lg border p-4 text-sm">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            className="text-muted hover:text-foreground"
            href={`#${item.id}`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <ButtonsSection />
      <FormsSection />
      <DataDisplaySection />
      <FeedbackSection />
      <NavigationSection />
      <OverlaysSection />
      <LayoutSection />
      <ChatSection />
    </div>
  );
}
