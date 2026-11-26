import { AnthropicIcon } from "hero-next/icons/Anthropic";
import { DeepSeekIcon } from "hero-next/icons/DeepSeek";
import { GeminiIcon } from "hero-next/icons/Gemini";
import { MoonShotIcon } from "hero-next/icons/MoonShot";
import { OpenAIIcon } from "hero-next/icons/OpenAI";
import { QwenIcon } from "hero-next/icons/Qwen";
import { TencentIcon } from "hero-next/icons/Tencent";
import { ZaiIcon } from "hero-next/icons/Zai";
import { ModelPublisher } from "../types/models";

export function ModelIcon({ publisher, className }: { publisher: ModelPublisher; className?: string }) {
  switch (publisher) {
    case "anthropic":
      return <AnthropicIcon className={className} />;
    case "google":
      return <GeminiIcon className={className} />;
    case "openai":
      return <OpenAIIcon className={className} />;
    case "deepseek":
      return <DeepSeekIcon className={className} />;
    case "moonshot":
      return <MoonShotIcon className={className} />;
    case "qwen":
      return <QwenIcon className={className} />;
    case "tencent":
      return <TencentIcon className={className} />;
    case "zai":
      return <ZaiIcon className={className} />;
  }
}
