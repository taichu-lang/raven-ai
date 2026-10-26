"use client";

import { Button, Description, Label, Radio, RadioGroup, ScrollShadow, Tabs } from "@heroui/react";
import type { HumanConfirmation } from "hero-next/chat";
import { CheckIcon } from "lucide-react";
import { useState } from "react";

/**
 * Renders the questions of one HumanConfirmation (the LLM asking the user, via QuestionTool).
 *
 * One tab per question (titled by its header) so the drawer stays compact; each tab holds a
 * single-choice radio group. Answering a question records the choice and auto-advances to the
 * next tab; answered tabs show a check mark and can be revisited to change the selection.
 *
 * Once every question is answered, the submit button hands a map of question id -> chosen
 * option label to `onSubmit`, which resumes the paused turn.
 */
export function ConfirmationPanel({
  confirmation,
  onSubmit,
}: {
  confirmation: HumanConfirmation;
  onSubmit: (answers: Record<string, string>) => void;
}) {
  const { questions } = confirmation.arguments;

  // Tabs are keyed by question index. Answers are kept per index so each RadioGroup is
  // controlled and restores its selection when the user navigates back to a tab.
  const [activeKey, setActiveKey] = useState("0");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const allAnswered = questions.every((_, index) => answers[index]);

  const handleSubmit = () => {
    onSubmit(Object.fromEntries(questions.map((q, index) => [q.id, answers[index]])));
  };

  const handleAnswer = (index: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
    // Auto-advance to the next question; stay on the last one when finished.
    if (index + 1 < questions.length) {
      setActiveKey(String(index + 1));
    }
  };

  return (
    <Tabs className="w-full" selectedKey={activeKey} onSelectionChange={(key) => setActiveKey(String(key))}>
      <Tabs.ListContainer>
        <Tabs.List aria-label="确认问题">
          {questions.map((question, index) => (
            <Tabs.Tab id={String(index)} key={index}>
              <span className="flex items-center gap-1">
                {answers[index] && <CheckIcon className="size-3" />}
                {question.header}
              </span>
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
      {questions.map((question, index) => (
        <Tabs.Panel id={String(index)} key={index} className="pt-3">
          {/* One question per tab is usually short, but long option lists can still
              overflow the drawer, so keep the panel scrollable. */}
          <ScrollShadow orientation="vertical" className="max-h-64">
            <RadioGroup
              name={`${confirmation.id}-${index}`}
              variant="secondary"
              value={answers[index] ?? null}
              onChange={(value) => handleAnswer(index, value)}
            >
              <Label>{question.question}</Label>
              {question.options.map((option) => (
                <Radio key={option.label} value={option.label}>
                  <Radio.Content>
                    <Radio.Control>
                      <Radio.Indicator />
                    </Radio.Control>
                    {option.label}
                  </Radio.Content>
                  <Description>{option.description}</Description>
                </Radio>
              ))}
            </RadioGroup>
          </ScrollShadow>
        </Tabs.Panel>
      ))}
      <div className="flex justify-end pt-2">
        <Button size="sm" isDisabled={!allAnswered} onPress={handleSubmit}>
          提交
        </Button>
      </div>
    </Tabs>
  );
}
