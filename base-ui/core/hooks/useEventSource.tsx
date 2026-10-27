"use client";

import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Conversation } from "base-ui/types/chat";
import {
  BaseMessage,
  QuestionToolArgs,
  Skill,
  ToolCallContent,
  ToolResultContent,
  useChatContext,
} from "hero-next/chat";
import { useConversationMutations } from "./useConversationMutations";
import { usePreference } from "./usePreference";

// One turn represents one conversation round, beginning with a user message.
// One turn consists of one or more iterations, ex: llm -> function -> llm.
// So one user input might receive multiple assistant messages.
const EventType = {
  ConversationStart: "conversation.start",
  TurnStart: "turn.start",
  ReasoningDelta: "llm.reasoning.delta",
  Delta: "llm.delta",
  IterationDone: "llm.complete",
  ToolCall: "tool.call",
  ToolResult: "tool.result",
  TurnEnd: "turn.end",
  HumanInLoop: "runtime.hitl",
} as const;

interface ChatRequestMeta {
  skills?: Skill[];
}

// The user's answers to a pending question tool call.
interface Resumption {
  // The id and name of the tool call that asked the questions.
  id: string;
  name: string;
  // question id -> the selected option label.
  answers: Record<string, string>;
}

// A request either starts a new turn (text) or resumes a turn paused by human-in-the-loop (resume).
interface ChatRequest {
  text?: string;
  metadata?: ChatRequestMeta;
  resume?: Resumption;
  model: string;
}

interface TurnStartEventData {
  messages: BaseMessage[];
}

export function useEventSource() {
  const {
    setStatus,
    addUserMessage,
    onStream,
    onReasoningStream,
    onToolCall,
    onToolResult,
    onStreamDone,
    beginRequest,
    endRequest,
    onConfirmation,
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
    onTurnStarted?: (id: string) => void,
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
      // A resumed turn carries no new user message.
      if (meta.messages?.length) {
        addUserMessage(meta.messages);
        onTurnStarted?.(meta.messages[0].id);
      }
    };

    const onReasoningDelta = (data: string) => {
      const message = JSON.parse(data) as BaseMessage;
      for (const content of message.contents) {
        if (content.type === "text") {
          onReasoningStream(message.id, content.text);
        }
      }
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
      // The agent will send turn.end even if an approval is pending, as resources bound to this turn should
      // be released. After the approval is processed, the turn will be resumed.
      setStatus("idle");
    };

    const onHumanConfirmation = (data: string) => {
      const message = JSON.parse(data) as ToolCallContent[];
      const confirmation = message.map((m) => {
        // The tool arguments may double-encode `questions` as a JSON string instead of an
        // array (JSON.parse only decodes one level), so normalize it here and let consumers
        // always see QuestionToolArgs.
        const args = JSON.parse(m.arguments) as { questions: QuestionToolArgs["questions"] | string };
        const questions =
          typeof args.questions === "string"
            ? (JSON.parse(args.questions) as QuestionToolArgs["questions"])
            : args.questions;
        return {
          id: m.id,
          name: m.name,
          arguments: { questions },
        };
      });
      onConfirmation(confirmation);
    };

    // event: llm.reasoning.delta, data: {"id":"msg_5281e7e2-212a-4273-b3f7-8acbe9ce9960","role":"assistant","contents":[{"text":"The","type":"text"}]}
    // event: llm.delta, data: {"id":"msg_0362e91557a3ba07006ac45f1a9b9887d0b9ffe543b0ccedaf","role":"assistant","contents":[{"text":"Hello","type":"text"}]}
    // event: llm.complete, data: {"id":"resp_0362e91557a3ba07006ac45f19f79087d09eecad0a0426e5a4","role":"assistant","contents":[{"text":"Hello! How can I help you today? 😊","type":"text"}]}
    // or:
    // event: llm.complete, data: {"id":"resp_96779961-2de2-9a43-8df5-cbad1c018e9a","role":"assistant","contents":[{"id":"msg_5281e7e2-212a-4273-b3f7-8acbe9ce9960","summary":"The user just says \"旅行路线规划\" (travel route planning) in Chinese. Very vague. I should ask clarifying questions. I should use the question tool to gather details. But maybe I should first respond conversationally in Chinese, and ask questions.\n\nLet me use the question tool with up to 3 questions: destination, travel dates/duration, style/party composition. Actually, the key info needed: 目的地, 天数/时间, 出行人数与偏好. Budget too. Let me limit to 3 questions.\n\nLet me ask:\n1. 目的地 (where) — options like 国内城市, 周边国家, 还没定/需要推荐... \n2. 天数与时间\n3. 旅行风格\n\nActually for destination, options are hard. Let me offer: \"还没定，帮我推荐\", \"国内短途\", \"长线/出境\". Hmm, better: ask about destination type.\n\nI'll keep it warm and concise, in Chinese.","type":"reasoning"},{"text":"好呀，帮你规划！不过得先摸清几个关键信息，不然容易做成一份\"看着挺美但走不动\"的行程 😄\n\n先回答我这几个问题：\n\n","type":"text"},{"id":"call_f39a869e513d456c832a8d88","name":"question","arguments":"{\"questions\": \"[{\\\"id\\\": \\\"destination\\\", \\\"header\\\": \\\"目的地\\\", \\\"question\\\": \\\"这次想去哪儿？\\\", \\\"options\\\": [{\\\"label\\\": \\\"还没定，帮我推荐\\\", \\\"description\\\": \\\"告诉我出发城市和季节，我给你几个候选路线对比\\\"}, {\\\"label\\\": \\\"已经有明确目的地\\\", \\\"description\\\": \\\"直接说城市/地区，我按那里排行程\\\"}, {\\\"label\\\": \\\"出境游\\\", \\\"description\\\": \\\"日本、东南亚、欧洲等，需要考虑签证和交通衔接\\\"}]}, {\\\"id\\\": \\\"duration\\\", \\\"header\\\": \\\"天数时间\\\", \\\"question\\\": \\\"大概玩几天，什么时候出发？\\\", \\\"options\\\": [{\\\"label\\\": \\\"周末 2-3 天\\\", \\\"description\\\": \\\"节奏紧凑，主打一个核心区域\\\"}, {\\\"label\\\": \\\"4-6 天\\\", \\\"description\\\": \\\"一条主线 + 一两个周边点\\\"}, {\\\"label\\\": \\\"7 天以上\\\", \\\"description\\\": \\\"可以多城市串联，需要留出缓冲日\\\"}]}, {\\\"id\\\": \\\"style\\\", \\\"header\\\": \\\"风格偏好\\\", \\\"question\\\": \\\"你更想要什么样的节奏和内容？\\\", \\\"options\\\": [{\\\"label\\\": \\\"松弛慢游\\\", \\\"description\\\": \\\"每天 1-2 个点，睡到自然醒，重体验不赶场\\\"}, {\\\"label\\\": \\\"经典打卡全覆盖\\\", \\\"description\\\": \\\"把必去景点尽量排进去，接受早出晚归\\\"}, {\\\"label\\\": \\\"自然风光/徒步\\\", \\\"description\\\": \\\"山川湖海优先，博物馆商圈往后排\\\"}, {\\\"label\\\": \\\"美食与在地生活\\\", \\\"description\\\": \\\"以小馆子、市集、街区漫游为主线\\\"}]}]\"}","type":"tool_call"}]}
    // event: tool.result, data: {"id":"msg_0362e91557a3ba07006ac45f1a9b9887d0b9ffe543b0ccedaf","role":"tool","contents":[{"type":"tool_result","tool_call_id":"call_01","name":"search","result":"..."}]}
    // event: turn.end, data: [DONE]

    // The controller is created and registered in the chat store, not passed in by the caller:
    // its lifetime must follow the request (which spans the landing page -> conversation page
    // navigation for the first turn), not the composer component that triggered the submit.
    // beginRequest also aborts any previous in-flight request, and the page's cancel button
    // (cancelRequest) aborts this one through the same store.
    const abort = beginRequest();
    try {
      if (request.resume) {
        // setStatus ignores changes while in "approval", so dismiss the pending confirmation first.
        onConfirmation([]);
      }
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

            case EventType.ReasoningDelta:
              onReasoningDelta(ev.data);
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

            case EventType.HumanInLoop:
              onHumanConfirmation(ev.data);
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
