import type { ReactNode } from "react";

interface ShowcaseSectionProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function ShowcaseSection({
  id,
  title,
  description,
  children,
}: ShowcaseSectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-b border-default py-10 last:border-b-0"
    >
      <div className="mb-6 space-y-1">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {description ? (
          <p className="text-sm text-muted">{description}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  );
}

interface DemoBlockProps {
  title: string;
  children: ReactNode;
}

export function DemoBlock({ title, children }: DemoBlockProps) {
  return (
    <div className="rounded-lg border border-default p-6">
      <h3 className="mb-4 text-sm font-medium text-muted">{title}</h3>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}
