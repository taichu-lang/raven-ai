import { ChatNav } from "base-ui/chat";
import { AnnotationListView, AnnotationListViewProvider, ChatScrollArea } from "hero-next/blocks/chat";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <AnnotationListViewProvider className="flex h-full w-full">
      <ChatScrollArea>
        <ChatNav />
        <div className="mx-auto mt-4 flex w-full max-w-5xl flex-1 flex-col px-6">{children}</div>
      </ChatScrollArea>
      <AnnotationListView />
    </AnnotationListViewProvider>
  );
}
