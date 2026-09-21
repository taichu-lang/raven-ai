"use client";

import {
  Checkbox,
  Description,
  Input,
  Label,
  ListBox,
  NumberField,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextArea,
} from "@heroui/react";

import { DemoBlock, ShowcaseSection } from "../_components/showcase-section";

export function FormsSection() {
  return (
    <ShowcaseSection
      id="forms"
      title="Forms"
      description="Input / TextArea / Checkbox / RadioGroup / Switch / NumberField / Select"
    >
      <DemoBlock title="Input">
        <Input aria-label="Name" className="w-64" placeholder="Enter your name" />
      </DemoBlock>

      <DemoBlock title="TextArea">
        <TextArea
          aria-label="Message"
          className="h-24 w-96"
          placeholder="Write a short message…"
        />
      </DemoBlock>

      <DemoBlock title="Checkbox">
        <Checkbox name="terms">
          <Checkbox.Content>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            Accept terms and conditions
          </Checkbox.Content>
        </Checkbox>
      </DemoBlock>

      <DemoBlock title="Radio Group">
        <RadioGroup defaultValue="pro" name="plan">
          <Label>Choose a plan</Label>
          <Description>Pick the plan that suits you best</Description>
          <Radio value="starter">
            <Radio.Content>
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              Starter
            </Radio.Content>
          </Radio>
          <Radio value="pro">
            <Radio.Content>
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              Pro
            </Radio.Content>
          </Radio>
          <Radio value="teams">
            <Radio.Content>
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              Teams
            </Radio.Content>
          </Radio>
        </RadioGroup>
      </DemoBlock>

      <DemoBlock title="Switch">
        <Switch>
          <Switch.Content>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            Enable notifications
          </Switch.Content>
        </Switch>
      </DemoBlock>

      <DemoBlock title="Number Field">
        <NumberField className="w-full max-w-64" defaultValue={1024} minValue={0} name="width">
          <Label>Width</Label>
          <NumberField.Group>
            <NumberField.DecrementButton />
            <NumberField.Input className="w-[120px]" />
            <NumberField.IncrementButton />
          </NumberField.Group>
        </NumberField>
      </DemoBlock>

      <DemoBlock title="Select">
        <Select className="w-64" placeholder="Select a state">
          <Label>State</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id="florida" textValue="Florida">
                Florida
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="delaware" textValue="Delaware">
                Delaware
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="california" textValue="California">
                California
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="texas" textValue="Texas">
                Texas
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>
      </DemoBlock>
    </ShowcaseSection>
  );
}
