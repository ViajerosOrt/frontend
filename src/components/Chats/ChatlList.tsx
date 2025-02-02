import { Box, Text, Paper, Avatar, Group, Stack } from "@mantine/core";
import Link from "next/link";
import { useChatUserQuery } from "@/graphql/__generated__/gql";
import { BOLD, VIAJERO_GREEN_LIGHT } from "@/consts";
import { ViajeroEmptyMessage } from "../ViajeroEmptyMessage/viajeroEmptyMessage";
import { ViajeroLoader } from "../ViajeroLoader/ViajeroLoader";
import { useIsMobile } from "@/hooks/useIsMobile";
import { CgProfile } from "react-icons/cg";
import { travelImages } from "@/utils";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAth";

export function ChatList() {
  const currentUser = useAuth()
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
    <Box
      w="100%"
      mt={6}
      h="calc(100vh - 6rem)"
      px={6}
      style={{
        overflowY: 'auto',
        msOverflowStyle: "none",
        scrollbarWidth: "none",
        "&::WebkitScrollbar": {
          display: "none"
        }
      }}
    >
      {chats?.map((chat) => {
        const lastMessage = chat.messages?.[chat.messages.length - 1];

        return (
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
              backgroundColor: isSelected(chat.id) ? VIAJERO_GREEN_LIGHT : 'transparent'
            }}
          >
            <Group gap="xl" wrap="nowrap" w="100%">
              {/* TODO: Add travel image */}
              <Avatar src={chat.travel?.imageUrl} radius="xl" size={40} />
              <Stack>
                <Text fw={BOLD}>{chat.travel?.travelTitle}</Text>
                <Text truncate maw={isMobile ? 200 : 600} c={isSelected(chat.id) ? "black" : "dimmed"}>
                  {lastMessage ? (
                    <>
                      {lastMessage.user.name === currentUser?.currentUser?.name ? "You:" : `${lastMessage.user.name}:`} {lastMessage.content}
                    </>
                  ) : 'No messages yet'}
                </Text>
              </Stack>
              <Group gap={10} wrap="nowrap" ml="auto">
                <Text c="black">{chat.users?.length}</Text>
                <Avatar size={20} radius="xl" color="black">
                  <CgProfile size={20} />
                </Avatar>
              </Group>
            </Group>
          </Paper>
        );
      })}
    </Box>
  );
}
