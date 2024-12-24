import { ChatLayout } from "@/components/Layout/ChatLayout";
import ChatDetailsPage from "..";
import { Box, Text } from "@mantine/core";

function ChatDetails() {
  return (
    <Box>
      <Text>Chat Details</Text>
    </Box>
  )
}

ChatDetails.getLayout = function getLayout(page: React.ReactNode) {
  return <ChatLayout mobileToggle={true}>{page}</ChatLayout>;
};

export default ChatDetailsPage;