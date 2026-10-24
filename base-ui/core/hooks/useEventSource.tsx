"use client";

import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Conversation } from "base-ui/types/chat";
import { BaseMessage, Skill, ToolCallContent, ToolResultContent, useChatContext } from "hero-next/chat";
import { useConversationMutations } from "./useConversationMutations";
import { usePreference } from "./usePreference";

// One turn represents one conversation round, beginning with a user message.
// One turn consists of one or more iterations, ex: llm -> function -> llm.
// So one user input might receive multiple assistant messages.
const EventType = {
  ConversationStart: "conversation.start",
  TurnStart: "turn.start",
  Delta: "llm.delta",
  IterationDone: "llm.complete",
  ToolCall: "tool.call",
  ToolResult: "tool.result",
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
  messages: BaseMessage[];
}

export function useEventSource() {
  const {
    setStatus,
    addUserMessage,
    onStream,
    onToolCall,
    onToolResult,
    onStreamDone,
    beginRequest,
    endRequest,
  } = useChatContext();
  const { onConversationCreated } = useConversationMutations();
  const model = usePreference((s) => s.model);

  // Message flow on the stream. A turn (one user message) spans one or more
  // iterations; each iteration is one model call, optionally preceded by the
  // tool calls that feed it:
  //
  //   conversation.start      once per conversation; no strict ordering with
  //                           turn.start: the backend emits it asynchronously.
  //   turn.start
  //   |
  //   |  iteration 1
  //   |    tool.call           only when tools are involved, e.g. a skill;
  //   |    ...                 tools run in parallel, so tool.call and
  //   |    tool.result         tool.result interleave.
  //   |    llm.delta           the model is called only after all tools
  //   |    ...                 of this iteration finish, so the first
  //   |    llm.complete        llm.delta means the tool calls are done;
  //   |                       llm.complete ends the iteration, not the turn.
  //   |
  //   |  iteration 2..n        happens when the previous iteration's model
  //   |    ...                 reply requests more tools; same shape as above.
  //   |
  //   turn.end                 after the final iteration.
  //
  const sendChatMessage = async (
    request: Omit<ChatRequest, "model">,
    url: string,
    onTurnStarted: (id: string) => void,
  ) => {
    const onConversationStart = (data: string) => {
      const c = JSON.parse(data) as Conversation;
      onConversationCreated(c);
    };

    // Before agent execution, a metadata event will be accepted, which belongs to each turn.
    const onTurnStart = (data: string) => {
      // The 'assistant_id' returns from the server, and is immutable, then the message list will not be
      // re-rendered.
      const meta = JSON.parse(data) as TurnStartEventData;
      addUserMessage(meta.messages);
      onTurnStarted?.(meta.messages[0].id);
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
      onStreamDone(message);
    };

    const onToolCallStart = (data: string) => {
      const message = JSON.parse(data) as ToolCallContent;
      onToolCall(message);
    };

    // The result of a tool call made in a previous iteration. Attach it to the matching ToolCallContent
    // instead of appending a standalone tool message, so the tool call card can show the outcome.
    const onToolResultMessage = (data: string) => {
      const message = JSON.parse(data) as BaseMessage;
      const results = message.contents.filter(
        (content): content is ToolResultContent => content.type === "tool_result",
      );
      onToolResult(results);
    };

    const onEnd = () => {
      setStatus("idle");
    };

    // event: llm.delta, data: {"id":"msg_0362e91557a3ba07006ac45f1a9b9887d0b9ffe543b0ccedaf","role":"assistant","contents":[{"text":"Hello","type":"text"}]}
    // event: llm.complete, data: {"id":"resp_0362e91557a3ba07006ac45f19f79087d09eecad0a0426e5a4","role":"assistant","contents":[{"text":"Hello! How can I help you today? 😊","type":"text"}]}
    // event: tool.result, data: {"id":"msg_0362e91557a3ba07006ac45f1a9b9887d0b9ffe543b0ccedaf","role":"tool","contents":[{"type":"tool_result","tool_call_id":"call_01","name":"search","result":"..."}]}
    // event: turn.end, data: [DONE]

    // The controller is created and registered in the chat store, not passed in by the caller:
    // its lifetime must follow the request (which spans the landing page -> conversation page
    // navigation for the first turn), not the composer component that triggered the submit.
    // beginRequest also aborts any previous in-flight request, and the page's cancel button
    // (cancelRequest) aborts this one through the same store.
    const abort = beginRequest();
    try {
      setStatus("sending");
      await fetchEventSource(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...request,
          model,
        }),
        signal: abort.signal,
        onmessage(ev) {
          switch (ev.event) {
            case "error":
              console.error("on error: ", ev.data);
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

            case EventType.ToolCall:
              onToolCallStart(ev.data);
              break;

            case EventType.ToolResult:
              onToolResultMessage(ev.data);
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
      setStatus("idle");
    } finally {
      // The stream settled (turn.end, error, or aborted by cancelRequest, which resolves
      // without throwing). Unregister the controller; the identity check inside endRequest
      // makes this a no-op if a newer request has already superseded this one.
      endRequest(abort);
    }
  };

  return { sendChatMessage };
}
