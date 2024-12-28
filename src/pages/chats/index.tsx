import { ChatLayout } from "@/components/Layout/ChatLayout";
import { Box, Center, Text } from "@mantine/core";

// pages/chats/index.tsx
import React from "react";

function ChatsPage() {
  return null
}

ChatsPage.getLayout = function getLayout(page: React.ReactNode) {
  return <ChatLayout mobileToggle={false}>{page}</ChatLayout>;
};

export default ChatsPage;