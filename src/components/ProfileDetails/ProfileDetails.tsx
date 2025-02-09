import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { Review, Travel, useUserByIdQuery } from "@/graphql/__generated__/gql";
import { BOLD } from "@/consts";
import {
  Avatar,
  Box,
  Card,
  Center,
  Divider,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text
} from "@mantine/core";
import { CgProfile } from "react-icons/cg";
import { CountryFlag, getActivityAvatar } from "@/utils";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { SmallTravelDetails } from "../Travel/SmallTravelDetails/SmallTravelDetails";
import { useRouter } from "next/router";
import { ReviewReceivedCard } from "../ReviewReceivedCard/ReviewReceivedCard";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useAuth } from "@/hooks/useAth";
import { useIsMobile } from "@/hooks/useIsMobile";

export const ProfileDetails = ({ userId, showViewProfile = true }: { userId: string, showViewProfile?: boolean }) => {
  const currentUser = useAuth()
  const router = useRouter();
  const [opened, { open: openUserModal, close: closeUserModal }] = useDisclosure(false);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const { isMobile } = useIsMobile();
  const { data, loading } = useUserByIdQuery({
    variables: { userByIdId: userId || '' },
    skip: !!!userId
  })

  const user = data?.userById

  const currentUserIsProfile = currentUser?.currentUser?.id === userId

  if (loading || !user) {
    return (
      <Center h="100%" w="100%">
        <ViajeroLoader />
      </Center>
    )
  }
  return (
    <Stack gap="xl" p={isMobile ? 15 : 20} style={{ overflowY: "auto" }}>
      <Center>
        <Avatar src={user.userImage} size={120} radius="xl" color="green">
        </Avatar>
      </Center>

      <Box>
        <SimpleGrid cols={isMobile ? 1 : 3} spacing={isMobile ? "xs" : "lg"}>
          <Group align="end">
            <Text fw={BOLD}>Name:</Text>
            <Text>{user.name}</Text>
          </Group>
          <Group mt="xs">
            <Text fw={BOLD}>Email:</Text>
            <Text>{user.email}</Text>
          </Group>
          <Group mt="xs">
            <Text fw={BOLD}>Birth Date:</Text>
            <Text>{new Date(user.birthDate).toLocaleDateString()}</Text>
          </Group>
          {user.country && (
            <Group mt="xs">
              <Text fw={BOLD} >Country:</Text>
              <CountryFlag country={user.country}></CountryFlag>
            </Group>
          )}
          <Group mt="xs">
            <Text fw={BOLD} mb="xs" >Description:</Text>
            <Text mb="10px">{user.description || 'No description provided.'}</Text>
          </Group>
        </SimpleGrid>
      </Box>


      <Group align="start">
        <Text fw={BOLD} mb="xs" >Social Networks:</Text>
        {(user.whatsapp || user.instagram) ? (
          <>
            <Group mr={isMobile ? 60 : 20} >
              <FaWhatsapp color="#25D366" className="h-6 w-6" />
              <Text>{user.whatsapp}</Text>
            </Group>
            <Group>
              <FaInstagram color="#E1306C" className="h-6 w-6" />
              <Text >{user.instagram}</Text>
            </Group>
          </>
        ) : "You don't have social networks yet, add some in the edit page!"}

      </Group>

      <Divider />

      <Box>
        <Text fw={700} mb="xs">Activities:</Text>
        {user.userActivities && user.userActivities.length > 0 ? (
          <SimpleGrid cols={3} spacing="lg">
            {user.userActivities.map((activity) => (
              <Group key={activity.activityName}>
                {getActivityAvatar(activity.activityName, 'lg')}
                <Text>{activity.activityName}</Text>
              </Group>
            ))}
          </SimpleGrid>
        ) : (
          <Card p="xl" radius="md" withBorder style={{ maxWidth: '400px' }}>
            <Text ta="center" c="dimmed">
              No activities selected yet.
            </Text>
          </Card>
        )}
      </Box>
      <Divider />

      <Box>
        <Text fw={BOLD} ta="center" mb="xs">Travels Created</Text>
        {user?.travelsCreated && user?.travelsCreated.length > 0 ? (
          <SimpleGrid cols={isMobile ? 1 : 3} spacing="md">
            {user.travelsCreated.map((travel, index) => {
              return (
                <Box key={travel.id} style={{ cursor: currentUserIsProfile ? 'pointer' : 'default' }} onClick={() => {
                  if (currentUserIsProfile) {
                    router.push(`/myTravels`)
                  }
                }}>
                  <SmallTravelDetails showEdit={currentUserIsProfile} travel={travel as Travel} index={index} />
                </Box>
              )
            })}
          </SimpleGrid>
        ) : (
          <Box style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                                  <Card p="xl" radius="md" withBorder style={{ maxWidth: '400px' }}>
                                      <Text ta="center" c="dimmed">
                                      No travels created yet.
                                      </Text>
                                  </Card>
                              </Box>
        )}
      </Box>

      <Divider />

      <Box>
      <Text fw={BOLD} ta="center" mb="xs">Reviews received</Text>
        {user?.reviewsReceived && user.reviewsReceived.length > 0 ? (
          <>
            <Stack gap="md">
              {user.reviewsReceived?.map((review, index) => (
                <ReviewReceivedCard
                  key={review.id}
                  review={review as Review}
                  setSelectedUserId={setSelectedUserId}
                  index={index}
                  showCreatedBy={true}
                  openUserModal={openUserModal}
                  showViewProfile={showViewProfile}
                />
              ))}
            </Stack>
          </>
        ) : (
          <Box style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <Card p="xl" radius="md" withBorder style={{ maxWidth: '400px' }}>
              <Text ta="center" c="dimmed">
              No reviews received yet.
              </Text>
          </Card>
      </Box>
        )}
      </Box>
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
    </Stack >
  )
}