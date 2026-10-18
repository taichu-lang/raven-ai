import { AnnotationListView } from "base-ui/chat";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full">
      <div className="flex-1">{children}</div>
      <AnnotationListView />
    </div>
  );
}
