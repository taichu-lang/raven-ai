"use client";

import { Chip } from "@heroui/react";
import { ModelSelector } from "hero-next/blocks/chat";
import {
  ChatComposeButton,
  ChatComposer,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageContextProvider,
  ChatMessageList,
  ChatMessageMetadata,
} from "hero-next/chat";
import { PaperclipIcon } from "lucide-react";
import { DemoBlock, ShowcaseSection } from "../_components/showcase-section";

export function ChatSection() {
  return (
    <ShowcaseSection id="chat" title="AI Chat" description="ChatMessage">
      <DemoBlock title="MessageList">
        <ChatMessageList>
          <ChatMessage role="user" align="end">
            <ChatMessageContextProvider
              message={{
                role: "user",
                message_id: "1",
                content: "Hi, how are you today?",
              }}
            >
              <ChatMessageBubble variant="filled">
                Hi, how are you today?
              </ChatMessageBubble>
              <ChatMessageMetadata
                reveal="hover"
                spacing="sm"
              ></ChatMessageMetadata>
            </ChatMessageContextProvider>
          </ChatMessage>
          <ChatMessage role="assistant">
            <ChatMessageContextProvider
              message={{
                role: "assistant",
                message_id: "2",
                content: "How can i help you?",
              }}
            >
              <ChatMessageBubble>How can i help you?</ChatMessageBubble>
              <ChatMessageMetadata spacing="sm"></ChatMessageMetadata>
            </ChatMessageContextProvider>
          </ChatMessage>
        </ChatMessageList>
      </DemoBlock>
      <DemoBlock title="ChatComposer">
        <ChatComposer
          drawer={<Chip>some-file.pdf</Chip>}
          onSubmit={() => {}}
          headerActions={
            <ChatComposeButton>
              <PaperclipIcon />
            </ChatComposeButton>
          }
          headerContext={<p>80%</p>}
          footActions={
            <ModelSelector
              models={[
                { id: "opus-4.8", name: "Opus 4.8", provider: "claude" },
                { id: "gpt-5", name: "GPT-5", provider: "openai" },
              ]}
              onChange={(v) => console.log("selected model: ", v)}
            />
          }
          status={{
            type: "error",
            message: "file limit exceeded",
          }}
        />
      </DemoBlock>
    </ShowcaseSection>
  );
}
