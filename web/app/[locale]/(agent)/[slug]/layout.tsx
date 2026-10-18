import { ChatNav } from "base-ui/chat";
import { ChatScrollArea } from "hero-next/blocks/chat";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatScrollArea>
      <ChatNav />
      <div className="mx-auto mt-4 flex w-full max-w-5xl flex-1 flex-col px-6">{children}</div>
    </ChatScrollArea>
  );
}
