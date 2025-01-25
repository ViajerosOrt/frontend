import { ActionIcon, Avatar, Box, Button, Group, Menu, Modal, Stack, Text, Textarea } from "@mantine/core"

import { Flex } from "@mantine/core"
import { Chat, useSendMessageMutation } from "@/graphql/__generated__/gql"
import { BOLD, VIAJERO_GREEN, VIAJERO_GREEN_LIGHT } from "@/consts"
import { travelImages } from "@/utils"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { FaRobot } from "react-icons/fa"
import { useDisclosure } from "@mantine/hooks"
import { IoClose, IoSend } from "react-icons/io5"
import { useState } from "react"
import { showNotification } from "@mantine/notifications"

export const ChatHeaderSection = ({ chat, to, showAiButton = false }: { chat: Chat, to?: string, showAiButton?: boolean }) => {
  const [aiModalOpened, { open: openAiModal, close: closeAiModal }] = useDisclosure(false);
  const [newMessage, setNewMessage] = useState("");

  const [sendMessage] = useSendMessageMutation({
    refetchQueries: ["Chat"],
  });

  const handleSendMessage = async () => {
    try {
      const botMessage = newMessage.startsWith('@bot') ? newMessage : `@bot ${newMessage}`

      await sendMessage({
        variables: {
          chatId: chat?.id as string,
          createMessageInput: {
            content: botMessage,
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

  return (
    <>
      <Flex
        bg={VIAJERO_GREEN_LIGHT}
        align="center"
        justify="space-between"
        p="md"
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 10,
        }}
      >
        <ActionIcon variant="filled" component={Link} href={to || "/chats"} px="md" color={VIAJERO_GREEN}>
          <FontAwesomeIcon icon={faChevronLeft} color="white" />
        </ActionIcon>

        <Link href={`/chats/${chat.id}/details`} style={{ flex: 1 }}>
          <Group justify="center">
            <Avatar src={chat.travel.imageUrl! || travelImages[0 % travelImages.length]} radius="xl" size={40} />
            <Text fw={BOLD}>
              {chat?.travel?.travelTitle ?? 'No Title'}
            </Text>
          </Group>
        </Link>
        {showAiButton && (
          <Box
            variant="transparent"
            onClick={openAiModal}
          >
            <FaRobot color="white" size={24} />
          </Box>
        )}


      </Flex>

      <Modal
        opened={aiModalOpened}
        centered
        withCloseButton={false}
        onClose={closeAiModal}
      >
        <Box style={{ position: 'relative' }}>
          <ActionIcon
            variant="filled"
            color="gray"
            radius="xl"
            style={{
              position: 'absolute',
              top: 10,
              right: 0,
              zIndex: 10
            }}
            onClick={() => {
              closeAiModal();
            }}
          >
            <IoClose size={18} />
          </ActionIcon>
        </Box>
        <Stack gap="lg" p="md">
          <Text size="lg" fw={BOLD} ta="center">
            AI Travel Assistant
          </Text>
          <Text c="dimmed" ta="center">
            Ask me anything about your travel plans! I can help you with recommendations,
            itineraries, local tips, and more.
          </Text>
          <Text c="dimmed" ta="center">
            You can also type @bot to start a conversation with me in the chat.
          </Text>
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(event) => setNewMessage(event.currentTarget.value)}
            minRows={3}
            maxRows={6}
            autosize
            radius="md"
          />
          <Button fullWidth color={VIAJERO_GREEN} onClick={handleSendMessage}>
            <IoSend size={18} />
          </Button>
        </Stack>
      </Modal>
    </>
  )
}