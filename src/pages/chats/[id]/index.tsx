import { ChatHeaderSection } from "@/components/Chats/ChatHeaderSection";
import ChatMessage from "@/components/Chats/ChatMessage";
import { ChatLayout } from "@/components/Layout/ChatLayout";
import { ViajeroEmptyMessage } from "@/components/ViajeroEmptyMessage/viajeroEmptyMessage";
import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { SEMI_BOLD } from "@/consts";
import { VIAJERO_GREEN } from "@/consts/consts";
import { Message, useSendMessageMutation } from "@/graphql/__generated__/gql";
import { GET_CHAT_BY_ID } from "@/graphql/chats/chats.queries";
import { useAuth } from "@/hooks/useAth";
import { useQuery } from "@apollo/client";
import { Box, Button, Flex, Paper, Textarea } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

function ChatPage() {
  const router = useRouter();
  const { id } = router.query;
  const { currentUser } = useAuth()
  const [newMessage, setNewMessage] = useState("");

  const { data, loading, error } = useQuery(GET_CHAT_BY_ID, {
    variables: {
      chatId: id as string,
    },
  });

  const [sendMessage] = useSendMessageMutation({
    refetchQueries: ["Chat"],
  });

  const chat = data?.chat;

  const handleSendMessage = async () => {
    try {
      await sendMessage({
        variables: {
          chatId: chat?.id as string,
          createMessageInput: {
            content: newMessage,
          },
        },
      });
      setNewMessage("");
    } catch (error) {
      showNotification({
        position: 'top-right',
        message: 'Error sending message',
        color: 'red',
      });
    }
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const orderedMessages = chat?.messages?.slice().sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  // Scroll to the bottom of the chat when the messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [chat?.messages]);

  if (loading) return <ViajeroLoader />;

  if (error) return <ViajeroEmptyMessage message="Error loading chat" />;

  return (
    <Box
      m={1}
      h="calc(100vh - 6rem)"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ChatHeaderSection chat={chat} />
      <Paper p="md" shadow="sm"
        bg="#e5ddd5"
        style={{
          flex: 1,
          overflowY: "auto",
        }}>
        {chat?.messages?.length === 0 && (
          <ViajeroEmptyMessage message="No messages in this chat yet." />
        )}
        {orderedMessages?.map((message: Message) => (
          <ChatMessage key={message?.id} message={message} isCurrentUser={message.user.id === currentUser?.id} />
        ))}
        <Box ref={messagesEndRef} />
      </Paper>
      <Flex gap="md" w="100%" mt="md">
        <Textarea
          placeholder="Type your message..."
          value={newMessage}
          onChange={(event) => setNewMessage(event.currentTarget.value)}
          autosize
          minRows={1}
          maxRows={5}
          w="85%"
        />
        <Button w="15%" variant="filled" color={VIAJERO_GREEN} onClick={handleSendMessage} disabled={newMessage.length === 0}>Send</Button>
      </Flex>
    </Box>
  );
}

ChatPage.getLayout = function getLayout(page: React.ReactNode) {
  return <ChatLayout mobileToggle={true}>{page}</ChatLayout>;
};

export default ChatPage;