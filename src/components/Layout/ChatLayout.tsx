// components/ChatLayout.tsx
import React from "react";
import { DualPageLayout } from "./DualPageLayout";
import { ChatList } from "../Chats/ChatlList";

export function ChatLayout({ children, mobileToggle = false }: { children: React.ReactNode, mobileToggle?: boolean }) {
  return (
    <DualPageLayout
      leftColumn={<ChatList />}
      rightColumn={children}
      mobileToggle={mobileToggle}
    />
  );
}
