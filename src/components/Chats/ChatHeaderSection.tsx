import { ActionIcon, Avatar, Button, Group, Menu, Modal, Stack, Text } from "@mantine/core"

import { Flex } from "@mantine/core"
import { Chat } from "@/graphql/__generated__/gql"
import { BOLD, VIAJERO_GREEN, VIAJERO_GREEN_LIGHT } from "@/consts"
import { travelImages } from "@/utils"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"

export const ChatHeaderSection = ({ chat, to }: { chat: Chat, to?: string }) => {

  return (
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

    </Flex>
  )
}