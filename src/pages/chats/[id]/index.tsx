import { ChatHeaderSection } from "@/components/Chats/ChatHeaderSection";
import ChatMessage from "@/components/Chats/ChatMessage";
import { ChatLayout } from "@/components/Layout/ChatLayout";
import { ViajeroEmptyMessage } from "@/components/ViajeroEmptyMessage/viajeroEmptyMessage";
import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { VIAJERO_GREEN } from "@/consts/consts";
import { Message, useChatMessageAddedSubscription, useSendMessageMutation } from "@/graphql/__generated__/gql";
import { GET_CHAT_BY_ID } from "@/graphql/chats/chats.queries";
import { useAuth } from "@/hooks/useAth";
import { useQuery } from "@apollo/client";
import { Box, Button, Flex, Paper, Textarea, Text } from "@mantine/core";
import { useInViewport } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import { IoArrowDown } from "react-icons/io5";

function ChatPage() {
  const router = useRouter();
  const { id } = router.query;
  const { currentUser } = useAuth()
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([])
  const { ref, inViewport } = useInViewport();
  const [showNewMessageIndicator, setShowNewMessageIndicator] = useState(false);
  const initialRenderRef = useRef(true);

  const { data, loading, error } = useQuery(GET_CHAT_BY_ID, {
    variables: {
      chatId: id as string,
    },
  });

  const { data: chatMessageAddedData } = useChatMessageAddedSubscription({
    variables: { chatId: id as string },
    skip: !id,
    onError: (error) => {
      console.log(error)
    },
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

  const scrollToBottom = ({ withSmoothScroll = true }: { withSmoothScroll?: boolean }) => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: withSmoothScroll ? 'smooth' : 'auto'
      });
    }
  };

  // We scroll to bottom only on initial render
  useEffect(() => {
    if (initialRenderRef.current && !loading && chat?.messages) {
      setTimeout(() => {
        scrollToBottom({ withSmoothScroll: false });
      }, 100);
      initialRenderRef.current = false;
    }
  }, [loading, chat?.messages]);

  // Update the messages when new data is received via subscription
  useEffect(() => {
    if (chatMessageAddedData?.chatMessageAdded) {
      setMessages((prevMessages: any) =>
        [...prevMessages, chatMessageAddedData.chatMessageAdded].sort((a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      );

      // If the new message is from the current user, scroll to the bottom
      if (chatMessageAddedData.chatMessageAdded.user.id === currentUser?.id) {
        setTimeout(() => {
          scrollToBottom({ withSmoothScroll: true });
        }, 100);
        return
      }

      // If a new message is added and the user is not at the bottom of the chat, show an icon
      if (!inViewport) {
        setShowNewMessageIndicator(true);
      }
    }
  }, [chatMessageAddedData]);

  // Hide the new message indicator when the user scrolls to the bottom
  useEffect(() => {
    if (inViewport) {
      setShowNewMessageIndicator(false);
    }
  }, [inViewport]);

  // Update the messages when the chat messages from the query change
  useEffect(() => {
    if (chat?.messages) {
      setMessages(chat.messages.slice().sort((a: Message, b: Message) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ));
    }
  }, [chat?.messages]);

  const [sendMessage] = useSendMessageMutation({
    refetchQueries: ["Chat"],
  });

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
        id="chat-container"
        style={{
          flex: 1,
          overflowY: "auto",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none"
          }
        }}>

        {chat?.messages?.length === 0 && (
          <ViajeroEmptyMessage message="No messages in this chat yet." />
        )}
        {messages?.map((message: Message) => (
          <ChatMessage key={message?.id} message={message} isCurrentUser={message.user.id === currentUser?.id} />
        ))}
        <Box ref={ref} />

        {showNewMessageIndicator && (
          <Box
            style={{
              position: "sticky",
              bottom: "0",
              padding: "1rem",
              display: "flex",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <Button
              variant="filled"
              color={VIAJERO_GREEN}
              onClick={() => scrollToBottom({ withSmoothScroll: true })}
              style={{
                borderRadius: "20px",
                gap: "8px",
                padding: "0.5rem 1rem",
                minWidth: "150px",
              }}
            >
              <Text size="sm">New message</Text>
              <IoArrowDown size={16} />
            </Button>
          </Box>
        )}
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