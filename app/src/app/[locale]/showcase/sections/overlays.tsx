"use client";

import { Button, Modal, Popover, Tooltip } from "@heroui/react";

import { DemoBlock, ShowcaseSection } from "../_components/showcase-section";

export function OverlaysSection() {
  return (
    <ShowcaseSection
      id="overlays"
      title="Overlays"
      description="Modal / Popover / Tooltip"
    >
      <DemoBlock title="Modal">
        <Modal>
          <Button variant="secondary">Open modal</Button>
          <Modal.Backdrop>
            <Modal.Container>
              <Modal.Dialog className="sm:max-w-[360px]">
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>Welcome to HeroUI</Modal.Heading>
                </Modal.Header>
                <Modal.Body>
                  <p>
                    A beautiful, fast, and modern React UI library for building accessible and
                    highly customizable web applications.
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="w-full" slot="close">
                    Continue
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      </DemoBlock>

      <DemoBlock title="Popover">
        <Popover>
          <Button>Click me</Button>
          <Popover.Content className="max-w-64">
            <Popover.Dialog>
              <Popover.Heading>Popover title</Popover.Heading>
              <p className="mt-2 text-sm text-muted">
                This is the popover content, you can place anything here.
              </p>
            </Popover.Dialog>
          </Popover.Content>
        </Popover>
      </DemoBlock>

      <DemoBlock title="Tooltip">
        <Tooltip delay={0}>
          <Button variant="secondary">Hover me</Button>
          <Tooltip.Content>
            <p>This is a tooltip</p>
          </Tooltip.Content>
        </Tooltip>
      </DemoBlock>
    </ShowcaseSection>
  );
}
