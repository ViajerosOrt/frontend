import { Box, List, Loader, Text, Image, Paper, Avatar, Group, Stack, Anchor, Button } from "@mantine/core";
import Link from "next/link";
import { Chat, useChatUserQuery } from "@/graphql/__generated__/gql";
import { BOLD, SEMI_BOLD, VIAJERO_GREEN, VIAJERO_GREEN_LIGHT } from "@/consts";
import { ViajeroEmptyMessage } from "../ViajeroEmptyMessage/viajeroEmptyMessage";
import { ViajeroLoader } from "../ViajeroLoader/ViajeroLoader";
import { useIsMobile } from "@/hooks/useIsMobile";
import { CgProfile } from "react-icons/cg";
import { travelImages } from "@/utils";
import { useRouter } from "next/router";

export function ChatList() {
  const { data, loading, error } = useChatUserQuery({
    fetchPolicy: "cache-first"
  });
  const chats = data?.chatUser;

  const { isMobile } = useIsMobile();
  const router = useRouter();
  const selectedChatId = router.query.id;
  const isSelected = (chatId: string) => chatId === selectedChatId;

  if (loading) return (
    <Box w="100%" h="100%">
      <ViajeroLoader />;
    </Box>
  );

  if (error) return <ViajeroEmptyMessage message="Error loading chats" />;

  if (chats?.length === 0) return <ViajeroEmptyMessage message="No chats available" />

  return (
    <Box w="100%" h="100%">
      {chats?.map((chat, index) => (
        <Paper
          key={chat.id}
          component={Link}
          href={`/chats/${chat.id}`}
          shadow="sm"
          p="md"
          mb="md"
          withBorder
          radius="md"
          w="100%"
          style={{
            backgroundColor: isSelected(chat.id) ? VIAJERO_GREEN_LIGHT : 'transparent' // Change background color if selected
          }}
        >
          <Group gap="xl" wrap="nowrap" w="100%">
            {/* TODO: Add travel image */}
            <Avatar src={travelImages[index % travelImages.length]} radius="xl" size={40} />
            <Stack>
              <Text fw={BOLD}>{chat.travel?.travelTitle}</Text>
              {!isMobile && <Text truncate c={isSelected(chat.id) ? "black" : "dimmed"}>{chat.travel?.travelDescription}</Text>}
            </Stack>
            <Group gap={10} wrap="nowrap" ml="auto">
              <Text c="black">{chat.users?.length}</Text>
              <Avatar size={20} radius="xl" color="black">
                <CgProfile size={20} />
              </Avatar>
            </Group>
          </Group>
        </Paper>
      ))}
    </Box>
  );
}
