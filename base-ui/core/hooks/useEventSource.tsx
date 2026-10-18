"use client";

import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Conversation } from "base-ui/types/chat";
import { useChatContext } from "hero-next/blocks/chat";
import { BaseMessage, Skill } from "hero-next/chat";
import { useConversationMutations } from "./useConversationMutations";

// One turn represents one conversation round, begin with a user message.
// One turn is consists of one or more iterations, ex: llm -> function -> llm.
// So one user input might receive multiple assistant messages.
const EventType = {
  ConversationStart: "conversation.start",
  TurnStart: "turn.start",
  Delta: "llm.delta",
  IterationDone: "llm.complete",
  TurnEnd: "turn.end",
} as const;

interface ChatRequestMeta {
  skills?: Skill[];
}

interface ChatRequest {
  text: string;
  model: string;
  metadata: ChatRequestMeta;
}

interface TurnStartEventData {
  input: BaseMessage[];
}

export function useEventSource() {
  const { setStatus, addUserMessage, onStream, stopStreaming } = useChatContext();
  const { onConversationCreated } = useConversationMutations();

  const sendChatMessage = async (request: ChatRequest, url: string, onTurnStarted: (id: string) => void) => {
    const onConversationStart = (data: string) => {
      const c = JSON.parse(data) as Conversation;
      onConversationCreated(c);
    };

    // Before agent execution, a metadata event will be accepted, which belongs to each turn.
    const onTurnStart = (data: string) => {
      // The 'assistant_id' returns from the server, and is immutable, then the message list will not be
      // re-rendered.
      const meta = JSON.parse(data) as TurnStartEventData;
      const message = meta.input[0];
      addUserMessage(message);
      onTurnStarted?.(message.id);
    };

    const onDelta = (data: string) => {
      const message = JSON.parse(data) as BaseMessage;
      for (const content of message.contents) {
        if (content.type === "text") {
          onStream(message.id, content.text);
        }
      }
    };

    const onAssistantComplete = (data: string) => {
      const message = JSON.parse(data) as BaseMessage;
      stopStreaming("done", message);
    };

    const onEnd = () => {
      setStatus("idle");
    };

    // event: llm.delta, data: {"id":"msg_0362e91557a3ba07006ac45f1a9b9887d0b9ffe543b0ccedaf","role":"assistant","contents":[{"text":"Hello","type":"text"}]}
    // event: llm.complete, data: {"id":"resp_0362e91557a3ba07006ac45f19f79087d09eecad0a0426e5a4","role":"assistant","contents":[{"text":"Hello! How can I help you today? 😊","type":"text"}]}
    // event: turn.end, data: [DONE]
    try {
      setStatus("sending");
      await fetchEventSource(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        onmessage(ev) {
          switch (ev.event) {
            case "error":
              console.error("on error: ", ev.data);
              stopStreaming("error");
              setStatus("idle");
              break;

            case EventType.ConversationStart:
              onConversationStart(ev.data);
              break;

            case EventType.TurnStart:
              onTurnStart(ev.data);
              break;

            case EventType.Delta:
              onDelta(ev.data);
              break;

            case EventType.IterationDone:
              onAssistantComplete(ev.data);
              break;

            case EventType.TurnEnd:
              onEnd();
              break;

            default:
              console.log("on message: ", ev.event, ev.data);
              break;
          }
        },
        onclose() {
          // close streaming.
        },
        onerror(err) {
          // throw the error, otherwise sse connection will be reconnected.
          throw err;
        },
        // Do not close the connection when the page is hidden, user might open put the page in the
        // background, do something else, and return to the page to check the result.
        openWhenHidden: true,
      });
    } catch (err) {
      // handle the error thrown by `onerror` callback.
      console.error("on error: ", err);
      stopStreaming("error");
      setStatus("idle");
    }
  };

  return { sendChatMessage };
}
