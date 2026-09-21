"use client";

import { Button, ButtonGroup, ToggleButton } from "@heroui/react";
import { useState } from "react";

import { DemoBlock, ShowcaseSection } from "../_components/showcase-section";

export function ButtonsSection() {
  return (
    <ShowcaseSection
      id="buttons"
      title="Buttons"
      description="Button / ButtonGroup / ToggleButton"
    >
      <DemoBlock title="Variants">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="danger-soft">Danger Soft</Button>
      </DemoBlock>

      <DemoBlock title="Sizes">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </DemoBlock>

      <DemoBlock title="Disabled">
        <Button isDisabled>Primary</Button>
        <Button isDisabled variant="secondary">
          Secondary
        </Button>
        <Button isDisabled variant="outline">
          Outline
        </Button>
      </DemoBlock>

      <DemoBlock title="Loading">
        <Button isPending>
          {({ isPending }) => <>{isPending ? "Loading…" : "Submit"}</>}
        </Button>
      </DemoBlock>

      <DemoBlock title="Button Group">
        <ButtonGroup variant="tertiary">
          <Button>Left</Button>
          <Button>
            <ButtonGroup.Separator />
            Middle
          </Button>
          <Button>
            <ButtonGroup.Separator />
            Right
          </Button>
        </ButtonGroup>
      </DemoBlock>

      <DemoBlock title="Toggle Button">
        <ToggleButtonDemo />
      </DemoBlock>
    </ShowcaseSection>
  );
}

function ToggleButtonDemo() {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <ToggleButton isSelected={isSelected} onChange={setIsSelected}>
        {isSelected ? "Liked" : "Like"}
      </ToggleButton>
      <span className="text-sm text-muted">
        State: {isSelected ? "selected" : "unselected"}
      </span>
    </div>
  );
}
