"use client";

import { cn } from "@heroui/react";
import { Carousel } from "hero-next/layout";
import { BotIcon, PaletteIcon, SparklesIcon, WorkflowIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

// Module-level slide config (react-compiler friendly): icons are component
// references, not JSX created during render.
const SLIDES = [
  { key: "create", Icon: SparklesIcon, gradient: "from-indigo-500/40 via-sky-500/20 to-transparent" },
  { key: "agent", Icon: BotIcon, gradient: "from-fuchsia-500/40 via-purple-500/20 to-transparent" },
  { key: "flow", Icon: WorkflowIcon, gradient: "from-emerald-500/40 via-teal-500/20 to-transparent" },
  { key: "design", Icon: PaletteIcon, gradient: "from-amber-500/40 via-orange-500/20 to-transparent" },
] as const;

export function FeatureCarousel(): ReactNode {
  const t = useTranslations();

  return (
    <Carousel
      animation="fade"
      indicatorVariant="progress"
      showArrows={false}
      radius="rounded-xl"
      aspectRatio=""
      className="h-full min-h-[560px] bg-neutral-950"
      indicatorLabel={(i) => t("auth.goToSlide", { index: i + 1 })}
      slides={SLIDES.map(({ key, Icon, gradient }) => (
        <div key={key} className="relative h-full w-full">
          {/* Gradient layer, cross-faded with the slide */}
          <div aria-hidden className={cn("absolute inset-0 bg-linear-to-br", gradient)} />

          {/* Copy layer, slight rise as it fades in */}
          <div className="absolute inset-0 flex flex-col justify-center gap-4 p-10">
            <div
              className={cn(
                "flex size-14 translate-y-3 items-center justify-center rounded-2xl bg-white/10 backdrop-blur",
                "transition-all duration-700 ease-out group-data-[active]/slide:translate-y-0",
              )}
            >
              <Icon className="size-7 text-white" />
            </div>
            <h3
              className={cn(
                "translate-y-3 text-2xl font-semibold text-white",
                "transition-all delay-75 duration-700 ease-out group-data-[active]/slide:translate-y-0",
              )}
            >
              {t(`auth.slides.${key}.title`)}
            </h3>
            <p
              className={cn(
                "max-w-[300px] translate-y-3 text-sm leading-6 text-white/70",
                "transition-all delay-150 duration-700 ease-out group-data-[active]/slide:translate-y-0",
              )}
            >
              {t(`auth.slides.${key}.desc`)}
            </p>
          </div>
        </div>
      ))}
    />
  );
}
