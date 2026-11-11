"use client";

import { Chip } from "@heroui/react";
import {
  ChatComposeButton,
  ChatComposer,
  ChatComposerDrawer,
  MessageBubble,
  TurnBubble,
  TurnBubbleMetadata,
  TurnContextProvider,
} from "hero-next/chat";
import { PaperclipIcon } from "lucide-react";
import { DemoBlock, ShowcaseSection } from "../_components/showcase-section";

export function ChatSection() {
  return (
    <ShowcaseSection id="chat" title="AI Chat" description="ChatMessage">
      <DemoBlock title="MessageList">
        <TurnContextProvider
          turn={{
            status: "done",
            conversation_id: "1",
            turn_seq: 1,
            tokens_used: 20,
            iterations: 1,
            created_at: 0,
            updated_at: 0,
            messages: [
              { role: "user", id: "1", contents: [{ type: "text", text: "Hi, how are you today?" }] },
              { role: "assistant", id: "2", contents: [{ type: "text", text: "How can i help you?" }] },
            ],
          }}
        >
          <div className="flex w-full flex-col gap-3">
            <TurnBubble
              role="user"
              align="end"
              messages={[
                { role: "user", id: "1", contents: [{ type: "text", text: "Hi, how are you today?" }] },
              ]}
            >
              <MessageBubble variant="filled">Hi, how are you today?</MessageBubble>
              <TurnBubbleMetadata reveal="hover" spacing="sm" />
            </TurnBubble>
            <TurnBubble
              role="assistant"
              messages={[
                { role: "assistant", id: "2", contents: [{ type: "text", text: "How can i help you?" }] },
              ]}
            >
              <MessageBubble>How can i help you?</MessageBubble>
              <TurnBubbleMetadata spacing="sm" enableTurnInfo={true} />
            </TurnBubble>
          </div>
        </TurnContextProvider>
      </DemoBlock>
      <DemoBlock title="ChatComposer">
        <ChatComposer
          drawer={
            <ChatComposerDrawer>
              <Chip className="bg-background">some-file.pdf</Chip>
            </ChatComposerDrawer>
          }
          onSubmit={() => {}}
          headerActions={
            <ChatComposeButton>
              <PaperclipIcon />
            </ChatComposeButton>
          }
          headerContext={<p>80%</p>}
          statusBar={{
            type: "error",
            message: "file limit exceeded",
          }}
        />
      </DemoBlock>
    </ShowcaseSection>
  );
}
