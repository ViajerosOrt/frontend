import { Avatar, Button, Group, Menu, Modal, Stack, Text } from "@mantine/core"

import { Flex } from "@mantine/core"
import { BackButton } from "../BackButton/BackButton"
import { Chat, useLeaveTravelMutation } from "@/graphql/__generated__/gql"
import { BOLD, VIAJERO_GREEN, VIAJERO_GREEN_LIGHT } from "@/consts"
import { travelImages } from "@/utils"
import { useDisclosure } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { useRouter } from "next/router"

export const ChatHeaderSection = ({ chat }: { chat: Chat }) => {
  const [opened, { open: openLeaveTravel, close }] = useDisclosure(false);
  const router = useRouter();
  const [leaveTravel] = useLeaveTravelMutation();

  const handleLeaveTravel = async () => {
    try {
      await leaveTravel({ variables: { travelId: chat.travel?.id } });
      showNotification({
        title: 'Travel left',
        message: 'You have left the travel',
        color: 'green',
      });
      close();
      router.push('/chats');
    } catch (error: any) {
      showNotification({
        title: 'Error',
        message: error.message ?? 'Error leaving travel',
        color: 'red',
      });
    }
  }

  return (
    <Flex
      bg={VIAJERO_GREEN_LIGHT}
      justify="space-between"
      align="center"
      p="md"
      style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'white',
        zIndex: 10,
      }}
    >
      <BackButton />
      {/* TODO: Add travel image */}
      <Group>
        <Avatar src={travelImages[0 % travelImages.length]} radius="xl" size={40} />

        <Text fw={BOLD}>
          {chat?.travel?.travelTitle ?? 'No Title'}
        </Text>
      </Group>

      <Menu>
        <Menu.Target>
          <Button variant="filled" color={VIAJERO_GREEN}>Config</Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={() => router.push(`/chats/${chat.id}/details`)}>Details</Menu.Item>
          <Menu.Item color="red" onClick={openLeaveTravel}>Leave travel</Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Modal opened={opened} onClose={close} centered p={0}>
        <Stack align="center">
          <Text >Are you sure you want to leave this travel?</Text>
          <Group>
            <Button color="red" onClick={handleLeaveTravel}>Leave</Button>
            <Button variant="outline" onClick={close}>Cancel</Button>
          </Group>
        </Stack>
      </Modal>
    </Flex >
  )
}