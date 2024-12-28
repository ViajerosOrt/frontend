import { ChatLayout } from "@/components/Layout/ChatLayout";
import { TravelCard } from "@/components/Travel/TravelCard/TravelCard";
import { ViajeroEmptyMessage } from "@/components/ViajeroEmptyMessage/viajeroEmptyMessage";
import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { TravelDto, User } from "@/graphql/__generated__/gql";
import { GET_CHAT_BY_ID } from "@/graphql/chats/chats.queries";
import { useQuery } from "@apollo/client";
import { Box, Text, Title, Button, Group, Flex, Stack, Container, Paper, Avatar, ActionIcon, Modal } from "@mantine/core";
import { useState } from "react";
import { useRouter } from "next/router";
import { travelImages } from "@/utils";
import { TravelDetailsModal } from "@/components/TravelDetailsModal/TravelDetailsModal";
import { GET_TRAVEL_BY_ID } from "@/graphql/travels/travels.queries";
import { ChatHeaderSection } from "@/components/Chats/ChatHeaderSection";
import { ST } from "next/dist/shared/lib/utils";
import { FaWhatsapp } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FaInstagram } from "react-icons/fa";
import { BOLD, SEMI_BOLD } from "@/consts";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ProfileDetails } from "@/components/ProfileDetails/ProfileDetails";
import { useDisclosure } from "@mantine/hooks";

function ChatDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [selectedTravel, setSelectedTravel] = useState<TravelDto | undefined>(undefined);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [opened, { open: openUserModal, close: closeUserModal }] = useDisclosure(false);
  const { isMobile } = useIsMobile();

  const { data, loading, error } = useQuery(GET_CHAT_BY_ID, {
    variables: {
      chatId: id as string,
    },
  });

  const chat = data?.chat;

  const { data: travelData, loading: travelLoading, error: travelError } = useQuery(GET_TRAVEL_BY_ID, {
    variables: {
      id: chat?.travel?.id as string,
    },
    skip: !chat?.travel?.id,
  });

  const travel = travelData?.travel;

  if (loading || travelLoading) return <ViajeroLoader />;

  if (error || travelError) return <ViajeroEmptyMessage message="Error loading chat" />;

  return (
    <Box>
      <ChatHeaderSection chat={chat} to={`/chats/${chat?.id}`} />
      <Stack p="md" align="center" bg="#e5ddd5" h="100vh" w="100%">
        <Title order={3}>{travel?.travelTitle}</Title>

        {/* TODO: USE REAL IMAGE */}
        <Box w={isMobile ? "100%" : "50%"}>
          <TravelCard travel={travel} imageSrc={travelImages[1 % travelImages.length]} setSelectedTravel={(travel) => {
            setSelectedTravel(travel);
            setSelectedImageSrc(travelImages[1 % travelImages.length]);
          }} showOpenChatButton={false} />
        </Box>

        <Title order={3} ta="center" my={15}>Participants</Title>
        {chat?.users?.map((user: User) => (
          <Paper
            key={user.id}
            shadow="sm"
            p="md"
            mb="md"
            withBorder
            radius="md"
            w="100%"
            style={{
              transition: 'transform 0.2s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-2px)',
                backgroundColor: '#f8f9fa'
              }
            }}
            onClick={() => {
              setSelectedUserId(user.id);
              openUserModal();
            }}
          >
            <Group justify="space-between" w="100%" h="100%" wrap="nowrap">
              <Group wrap="nowrap">
                <Avatar
                  alt={user.name}
                  radius="xl"
                  size={40}
                  color="green"
                >
                  <CgProfile size={25} />
                </Avatar>
                <Stack>
                  <Text fw={BOLD}>{user.name}</Text>
                  <Text size="sm" c="dimmed" truncate>
                    {user.description || 'No description available'}
                  </Text>
                </Stack>
              </Group>
              {!isMobile && (
                <Group gap="xs" wrap="nowrap">
                  {user.instagram && (
                    <Group>
                      <FaInstagram color="#E1306C" className="h-6 w-6" />
                      <Text fw={SEMI_BOLD}>{user.instagram}</Text>
                    </Group>
                  )}
                  {user.whatsapp && (
                    <Group ml={30}>
                      <FaWhatsapp color="#25D366" className="h-6 w-6" />
                      <Text fw={SEMI_BOLD}>{user.whatsapp}</Text>
                    </Group>
                  )}
                </Group>
              )}
            </Group>
          </Paper>
        ))}

      </Stack>

      {/* Selected Participant modal */}
      <Modal
        opened={opened}
        centered
        onClose={() => {
          closeUserModal();
          setTimeout(() => {
            setSelectedUserId(undefined);
          }, 300);
        }}
        size="2xl"
      >
        <ProfileDetails userId={selectedUserId || ''} showViewProfile={false} />
      </Modal>
      {/* Travel Details Modal */}
      <TravelDetailsModal
        selectedTravel={selectedTravel}
        setSelectedTravel={setSelectedTravel}
        selectedImageSrc={selectedImageSrc}
      />

    </Box >
  );
}

ChatDetails.getLayout = function getLayout(page: React.ReactNode) {
  return <ChatLayout mobileToggle={true}>{page}</ChatLayout>;
};

export default ChatDetails;