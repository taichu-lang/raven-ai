"use client";

import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useChatContext } from "hero-next/blocks/chat";
import { ResponseChunk } from "hero-next/chat";

interface ChatRequest {
  text: string;
}

interface MessageMetadata {
  message_id: string;
  assistant_id: string;
}

export function useEventSource() {
  const { addUserMessage, onStream, stopStreaming } = useChatContext();

  const sendChatMessage = async (
    content: string,
    url: string,
    onTurnStarted: (index: number) => void,
  ) => {
    const req: ChatRequest = {
      text: content,
    };

    // Before agent execution, a metadata event will be accepted, which belongs
    // to each turn.
    const onStart = (data: string) => {
      // The 'assistant_id' returns from the server, and is immutable, then the
      // message list will not be re-rendered.
      const meta = JSON.parse(data) as MessageMetadata;
      const idx = addUserMessage(
        {
          message_id: meta.message_id,
          role: "user",
          content: content,
        },
        meta.assistant_id,
      );
      onTurnStarted?.(idx);
    };

    const onDelta = (data: string) => {
      const message = JSON.parse(data) as ResponseChunk;
      for (const content of message.contents) {
        if (content.type === "text") {
          onStream(message.id, content.text);
        }
      }
    };

    const onFinal = (data: string) => {
      const message = JSON.parse(data) as ResponseChunk;
      let text = "";
      for (const content of message.contents) {
        if (content.type === "text") {
          text += content.text;
        }
      }
      stopStreaming("done", {
        message_id: message.id,
        role: message.role,
        content: text,
      });
    };

    // event: delta, data: {"text":"Hello","type":"text"}
    // event: final, data: {"text":"Hello! How can I help you today? 😊","type":"text"}
    // event: usage, data: {"input_tokens":18,"output_tokens":11,"total_tokens":29,"type":"usage"}
    try {
      await fetchEventSource(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
        onmessage(ev) {
          switch (ev.event) {
            case "error":
              console.error("on error: ", ev.data);
              stopStreaming("error");
              break;

            case "turn_start":
              onStart(ev.data);
              break;

            case "delta":
              onDelta(ev.data);
              break;

            case "final":
              onFinal(ev.data);
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
      });
    } catch (err) {
      // handle the error thrown by `onerror` callback.
      console.error("on error: ", err);
      stopStreaming("error");
    }
  };

  return { sendChatMessage };
}
