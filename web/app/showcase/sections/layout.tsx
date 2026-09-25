import { Card, Link, Separator, Typography } from "@heroui/react";

import { DemoBlock, ShowcaseSection } from "../_components/showcase-section";

export function LayoutSection() {
  return (
    <ShowcaseSection
      id="layout"
      title="Layout & Typography"
      description="Card / Separator / Typography"
    >
      <DemoBlock title="Card">
        <Card className="w-[360px]">
          <Card.Header>
            <Card.Title>Become an Acme creator!</Card.Title>
            <Card.Description>
              Head over to the Acme Creator Hub to start earning rewards from fans and
              supporters.
            </Card.Description>
          </Card.Header>
          <Card.Footer>
            <Link href="#">
              Creator Hub
              <Link.Icon />
            </Link>
          </Card.Footer>
        </Card>
      </DemoBlock>

      <DemoBlock title="Separator">
        <div className="w-full max-w-md">
          <div className="space-y-1">
            <h4 className="text-medium font-medium">HeroUI v3 Components</h4>
            <p className="text-small text-default-400">
              A beautiful, fast, and modern React UI library.
            </p>
          </div>
          <Separator className="my-4" />
          <div className="flex h-5 items-center space-x-4 text-small">
            <div>Blog</div>
            <Separator orientation="vertical" />
            <div>Docs</div>
            <Separator orientation="vertical" />
            <div>Source</div>
          </div>
        </div>
      </DemoBlock>

      <DemoBlock title="Typography">
        <div className="flex max-w-xl flex-col gap-4">
          <Typography type="h1">Build better interfaces</Typography>
          <Typography type="h2">Keep typography semantic</Typography>
          <Typography type="h3">Composable by default</Typography>
          <Typography type="h4">Subheading</Typography>
          <Typography>
            HeroUI Typography uses React Aria Components&apos; Text as a primitive, offering
            semantic typography types and render-prop polymorphism.
          </Typography>
          <Typography color="muted" type="body-sm">
            Smaller, muted body text for secondary descriptions.
          </Typography>
          <Typography type="code">pnpm add @heroui/react</Typography>
        </div>
      </DemoBlock>
    </ShowcaseSection>
  );
}
