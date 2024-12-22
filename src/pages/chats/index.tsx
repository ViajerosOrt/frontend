import { ChatLayout } from "@/components/Layout/ChatLayout";
import { Box, Center, Text } from "@mantine/core";

// pages/chats/index.tsx
import React from "react";

function ChatsPage() {
  return (
    <Box h="100%" w="100%">
      <Center>
        <Text>Select a conversation</Text>
      </Center>
    </Box>
  );
}

ChatsPage.getLayout = function getLayout(page: React.ReactNode) {
  return <ChatLayout mobileToggle={false}>{page}</ChatLayout>;
};

export default ChatsPage;