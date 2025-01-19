import React, { createContext, useContext } from "react";
import { useApolloClient } from "@apollo/client";
import { notifications, showNotification } from "@mantine/notifications";
import { useChatUpdatedSubscription } from "@/graphql/__generated__/gql";
import { useAuth } from "@/hooks/useAth";
import { VIAJERO_GREEN } from "@/consts/consts";
import { useRouter } from "next/router";
import { Box, Text, Image, Avatar } from "@mantine/core";
import Link from "next/link";

export function ChatMessageListener() {
  const client = useApolloClient();
  const { currentUser } = useAuth();
  const router = useRouter();

  // This subscription is used to listen for new messages in any of the chats the user is part of.
  useChatUpdatedSubscription({
    variables: {
      userId: currentUser?.id as string
    },
    skip: !currentUser?.id,
    onSubscriptionData: ({ subscriptionData }) => {
      const newMessage = subscriptionData.data?.chatUpdated;
      console.log(newMessage)
      if (newMessage) {
        // Only show notification if not in chat pages
        if (router.query.id !== newMessage.chat.id) {
          showNotification({
            title: null,
            color: "transparent",
            position: "top-center",
            withCloseButton: false,
            withBorder: false,
            icon: <Avatar src={newMessage.chat.travel.imageUrl || "/default_travel.jpg"} alt="Viajero Logo" radius="xl" size={40} />,
            style: {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
            message: (
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#dcf8c6",
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid #e6e6e6",
                  maxWidth: "300px",
                  wordBreak: "break-word",
                }}
                component={Link}
                href={`/chats/${newMessage.chat.id}`}
                onClick={() => {
                  notifications.clean();

                }}
              >
                <Text size="sm" fw={600} color="dimmed">
                  {newMessage.user.name}
                </Text>
                <Text size="sm">{newMessage.content}</Text>
              </Box>
            ),
            autoClose: 3000,
          });
        }

        client.refetchQueries({
          include: ["GET_CHAT_BY_ID", "GET_CHATS_FOR_USER"],
        });
      }
    },
    onError: (error) => {
      console.error("Subscription Error:", error);
    },
  });

  return null
}

export default ChatMessageListener