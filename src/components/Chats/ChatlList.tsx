import { Box, List, Loader, Text, Image, Paper, Avatar, Group, Stack, Anchor, Button } from "@mantine/core";
import Link from "next/link";
import { useChatUserQuery } from "@/graphql/__generated__/gql";
import { BOLD, SEMI_BOLD, VIAJERO_GREEN } from "@/consts";
import { ViajeroEmptyMessage } from "../ViajeroEmptyMessage/viajeroEmptyMessage";
import { ViajeroLoader } from "../ViajeroLoader/ViajeroLoader";
import { useIsMobile } from "@/hooks/useIsMobile";
import { CgProfile } from "react-icons/cg";

export function ChatList() {
  const { data, loading, error } = useChatUserQuery({
    fetchPolicy: "cache-first"
  });
  const chats = data?.chatUser;

  const { isMobile } = useIsMobile();

  if (loading) return
  <Box w="100%" h="100%">
    <ViajeroLoader />;
  </Box>

  if (error) return <ViajeroEmptyMessage message="Error loading chats" />;

  if (chats?.length === 0) return <ViajeroEmptyMessage message="No chats available" />
  console.log(chats);
  return (
    <Box w="100%" h="100%">
      {chats?.map((chat) => (
        <Paper
          component={Link}
          href={`/chats/${chat.id}`}
          shadow="sm"
          p="md"
          mb="md"
          withBorder
          radius="md"
          w="100%"
        >
          <Group gap="xl" wrap="nowrap" w="100%">
            <Avatar src={"/default_travel.jpg"} radius="xl" size={40} />
            <Stack>
              <Text fw={BOLD}>{chat.travel?.travelTitle}</Text>
              {!isMobile && <Text truncate c="dimmed">{chat.travel?.travelDescription}</Text>}
            </Stack>
            <Group gap={10} wrap="nowrap" ml="auto">
              <Text c={VIAJERO_GREEN}>{chat.users?.length}</Text>
              <Avatar size={20} radius="xl" color="green">
                <CgProfile size={20} />
              </Avatar>
            </Group>
          </Group>
        </Paper>
      ))
      }
    </Box>
  );
}
