import { ChatLayout } from "@/components/Layout/ChatLayout";
import { TravelCard } from "@/components/Travel/TravelCard/TravelCard";
import { ViajeroEmptyMessage } from "@/components/ViajeroEmptyMessage/viajeroEmptyMessage";
import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { Item, TravelDto, useAssignItemToUserMutation, useExpelFromTravelMutation, useLeaveTravelMutation, User, useRemoveItemToUserMutation, useRemoveTravelMutation } from "@/graphql/__generated__/gql";
import { GET_CHAT_BY_ID } from "@/graphql/chats/chats.queries";
import { useQuery } from "@apollo/client";
import { Box, Text, Title, Group, Stack, Paper, Avatar, Modal, Switch, Loader, Button } from "@mantine/core";
import { useState } from "react";
import { useRouter } from "next/router";
import { travelImages } from "@/utils";
import { TravelDetailsModal } from "@/components/TravelDetailsModal/TravelDetailsModal";
import { GET_TRAVEL_BY_ID } from "@/graphql/travels/travels.queries";
import { ChatHeaderSection } from "@/components/Chats/ChatHeaderSection";
import { FaWhatsapp } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { BOLD, SEMI_BOLD, VIAJERO_GREEN } from "@/consts";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ProfileDetails } from "@/components/ProfileDetails/ProfileDetails";
import { useDisclosure } from "@mantine/hooks";
import { useAuth } from "@/hooks/useAth";
import { debounce } from "lodash";
import { showNotification } from "@mantine/notifications";

function ChatDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { currentUser } = useAuth();

  const [selectedTravel, setSelectedTravel] = useState<TravelDto | undefined>(undefined);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [selectedRemoveUserId, setSelectedRemoveUserId] = useState<string | undefined>(undefined);

  const [leaveTravelOpened, { open: openLeaveTravel, close: closeLeaveTravel }] = useDisclosure(false);
  const [leaveTravel] = useLeaveTravelMutation();

  const [loadingItems, setLoadingItems] = useState<string[]>([]);

  const [opened, { open: openUserModal, close: closeUserModal }] = useDisclosure(false);
  const [removeTravelOpened, { open: openRemoveTravel, close: closeRemoveTravel }] = useDisclosure(false);

  const [removeUserOpened, { open: openRemoveUser, close: closeRemoveUser }] = useDisclosure(false);


  const [removeTravel, { loading: loadingRemoveTravel }] = useRemoveTravelMutation();
  const [expelUserFromTravel, { loading: loadingRemoveUser }] = useExpelFromTravelMutation();

  const { isMobile } = useIsMobile();

  const [assignItemToUser] = useAssignItemToUserMutation({
    refetchQueries: ["ChatUser", "Travel"]
  });

  const [removeItemFromUser] = useRemoveItemToUserMutation({
    refetchQueries: ["ChatUser", "Travel"]
  });

  const { data, loading, error, refetch: refetchChat } = useQuery(GET_CHAT_BY_ID, {
    variables: {
      chatId: id as string,
    },
  });
  const chat = data?.chat;

  const { data: travelData, loading: travelLoading, error: travelError, refetch: refetchTravel } = useQuery(GET_TRAVEL_BY_ID, {
    variables: {
      id: chat?.travel?.id as string,
    },
    skip: !chat?.travel?.id,
  });

  const travel = travelData?.travel;

  const travelItems = travel?.checklist?.items
    ? [...travel.checklist.items].sort((a: Item, b: Item) => a.name.localeCompare(b.name))
    : [];

  const participants = chat?.users
    ? [...chat.users].sort((a: User, b: User) => a.name.localeCompare(b.name))
    : [];

  const isCreator = (userId: string) => userId === travel?.creatorUser?.id;

  const handleDebouncedRefetch = debounce(() => {
    refetchTravel();
    setLoadingItems([]);
  }, 500)

  const handleAssignItemToUser = (itemId: string) => {
    setLoadingItems((prev) => [...prev, itemId]);

    assignItemToUser({
      variables: {
        assignItemToUserId: travel?.id || '',
        itemId: itemId
      }
    });

    handleDebouncedRefetch();
  }

  const handleRemoveItemFromUser = (itemId: string) => {
    setLoadingItems((prev) => [...prev, itemId]);

    removeItemFromUser({
      variables: {
        removeItemToUserId: travel?.id || '',
        itemId: itemId
      }
    });

    handleDebouncedRefetch();
  }

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

  const handleRemoveTravel = async () => {
    try {
      await removeTravel({ variables: { removeTravelId: travel?.id } });
      showNotification({
        title: 'Travel removed',
        message: 'The travel has been removed',
        color: 'green',
      });
      closeRemoveTravel();
      router.push('/travels');
    } catch (error: any) {
      console.log(error)
    }
  }

  const handleRemoveUser = async () => {
    try {
      await expelUserFromTravel({ variables: { bannedUserId: selectedRemoveUserId || '', travelId: travel?.id } });
      showNotification({
        title: 'User removed',
        message: 'The user has been removed from the travel',
        color: 'green',
      });
      closeRemoveUser();
      refetchChat();
    } catch (error: any) {
      console.log(error)
    }
  }

  if (loading || travelLoading) return <ViajeroLoader />;

  if (error || travelError) return <ViajeroEmptyMessage message="Error loading chat" />;


  return (
    <Box bg="#e5ddd5" h="100%" w="100%">
      <ChatHeaderSection chat={chat} to={`/chats/${chat?.id}`} />
      <Stack p="md" align="center" >
        <Title order={3}>{travel?.travelTitle}</Title>

        <Box w={isMobile ? "100%" : "50%"}>
          <TravelCard travel={travel} imageSrc={travel.imageUrl! || travelImages[1 % travelImages.length]} setSelectedTravel={(travel) => {
            setSelectedTravel(travel);
            setSelectedImageSrc(travelImages[1 % travelImages.length]);
          }} showOpenChatButton={false} />
        </Box>

        <Title order={3} ta="center" my={15}>Participants</Title>
        {participants.map((participant: User) => (
          <Paper
            key={participant.id}
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
              setSelectedUserId(participant.id);
              openUserModal();
            }}
          >
            <Group justify="space-between" w="100%" h="100%" wrap="nowrap">
              <Group wrap="nowrap">
                <Avatar
                  alt={participant.name}
                  radius="xl"
                  size={40}
                  src={participant.userImage}
                  color="green"
                >

                </Avatar>
                <Stack >
                  <Text fw={BOLD}>{participant.name}</Text>
                </Stack>

                {/* Badge for creator */}
                {isCreator(participant.id) && (
                  <Box>
                    <Box
                      style={{
                        backgroundColor: 'orange',
                        padding: '4px 8px',
                        borderRadius: '12px',
                      }}
                    >
                      <Text size="xs" c="white" fw={SEMI_BOLD}>
                        Creator
                      </Text>
                    </Box>
                  </Box>
                )}

                {/* If the current user is the creator, show the remove button for the participant */}
                {!isCreator(participant.id) && isCreator(currentUser?.id || '') && (
                  <Button variant="outline" color="red" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRemoveUserId(participant.id);
                    openRemoveUser();
                  }}>Remove</Button>
                )}

              </Group>


              {!isMobile && (
                <Group gap="xs" wrap="nowrap">
                  {participant.instagram && (
                    <Group>
                      <FaInstagram color="#E1306C" className="h-6 w-6" />
                      <Text fw={SEMI_BOLD}>{participant.instagram}</Text>
                    </Group>
                  )}
                  {participant.whatsapp && (
                    <Group ml={30}>
                      <FaWhatsapp color="#25D366" className="h-6 w-6" />
                      <Text fw={SEMI_BOLD}>{participant.whatsapp}</Text>
                    </Group>
                  )}
                </Group>
              )}
            </Group>
          </Paper>

        ))}

        <Paper
          p="md"
          radius="md"
          withBorder
          mt={20}
          w="100%"
        >
          <Title order={4} mb="sm">Checklist Items</Title>
          <Text c="dimmed" size="sm" mb="lg">
            Select the items you’d like to bring along for your travel. Some items may already taken by other participants.
          </Text>
          <Stack>
            {travelItems.map((item: Item, index: number) => (
              <Group key={index}>
                <Switch
                  label={item.name}
                  value={item.id}
                  checked={item.state}
                  color={VIAJERO_GREEN}
                  // Only enable if the item is not taken by other user, or if the item is loading
                  disabled={(item.user?.id !== currentUser?.id && item.state) || loadingItems.includes(item.id)}
                  onChange={() => {
                    if (!item.state) {
                      handleAssignItemToUser(item.id);
                    } else {
                      handleRemoveItemFromUser(item.id);
                    }
                  }
                  }
                />
                {item.user && (
                  <Text size="sm" c="dimmed">
                    Taken by {item.user.id === currentUser?.id ? "You" : item.user.name}
                  </Text>
                )}
                {loadingItems.includes(item.id) && (
                  <Loader size="xs" color={VIAJERO_GREEN} />
                )}
              </Group>
            ))}
            {(!travel?.checklist?.items || travel.checklist.items.length === 0) && (
              <Text c="dimmed" ta="center">No checklist items available</Text>
            )}
          </Stack>
        </Paper>


        {!isCreator(currentUser?.id || '') && (
          <Button variant="outline" color="red" onClick={openLeaveTravel} w="100%">Leave travel</Button>
        )}
        {isCreator(currentUser?.id || '') && (
          <Button variant="filled" color="red" onClick={openRemoveTravel} w="100%">Delete travel</Button>
        )}
      </Stack>

      {/* Selected Participant modal */}
      <Modal
        opened={opened}
        centered
        size={isMobile ? "100%" : "60%"}
        styles={{
          content: {
            overflowY: 'scroll',
            scrollbarWidth: 'none',
          },
        }}
        onClose={() => {
          closeUserModal();
          setTimeout(() => {
            setSelectedUserId(undefined);
          }, 300);
        }}
      >
        <ProfileDetails userId={selectedUserId || ''} showViewProfile={false} />
      </Modal>
      {/* Travel Details Modal */}
      <TravelDetailsModal
        selectedTravel={selectedTravel}
        setSelectedTravel={setSelectedTravel}
        selectedImageSrc={selectedImageSrc}
      />

      {/* Leave Travel Modal */}
      <Modal opened={leaveTravelOpened} onClose={closeLeaveTravel} centered p={0}>
        <Stack align="center">
          <Text >Are you sure you want to leave this travel?</Text>
          <Group>
            <Button color="red" onClick={handleLeaveTravel}>Leave</Button>
            <Button variant="outline" onClick={closeLeaveTravel}>Cancel</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Remove Travel Modal */}
      <Modal opened={removeTravelOpened} onClose={closeRemoveTravel} centered p={0}>
        <Stack align="center">
          <Text>Are you sure you want to remove this travel?</Text>
          <Group>
            <Button color="red" onClick={handleRemoveTravel} disabled={loadingRemoveTravel} loading={loadingRemoveTravel}>Remove</Button>
            <Button variant="outline" onClick={closeRemoveTravel}>Cancel</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Remove User Modal */}
      <Modal opened={removeUserOpened} onClose={closeRemoveUser} centered p={0}>
        <Stack align="center">
          <Text>Are you sure you want to remove this user from the travel?</Text>
          <Group>
            <Button color="red" onClick={handleRemoveUser} disabled={loadingRemoveUser} loading={loadingRemoveUser}>Remove</Button>
            <Button variant="outline" onClick={closeRemoveUser}>Cancel</Button>
          </Group>
        </Stack>
      </Modal>
    </Box >
  );
}

ChatDetails.getLayout = function getLayout(page: React.ReactNode) {
  return <ChatLayout mobileToggle={true}>{page}</ChatLayout>;
};

export default ChatDetails;