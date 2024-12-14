import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { BOLD, SEMI_BOLD, VIAJERO_GREEN } from "@/consts";
import { Review, TravelDto, useUserByIdQuery } from "@/graphql/__generated__/gql";
import { useAuth } from "@/hooks/useAth";
import { travelImages } from "@/utils";
import { Box, Card, Container, Group, Image, Stack, Text, Title, Button, Modal } from "@mantine/core";
import { FaPlane } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { useState } from "react";
import { TravelDetailsModal } from "@/components/TravelDetailsModal/TravelDetailsModal";
import { ProfileDetails } from "@/components/ProfileDetails/ProfileDetails";
import { useDisclosure } from "@mantine/hooks";

export default function Reviews() {
  const { currentUser } = useAuth()
  const [selectedTravel, setSelectedTravel] = useState<TravelDto | undefined>(undefined);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [opened, { open: openUserModal, close: closeUserModal }] = useDisclosure(false);



  const { data, loading } = useUserByIdQuery({
    variables: { userByIdId: currentUser?.id || '' },
    skip: !!!currentUser?.id
  })

  const user = data?.userById
  const reviews = user?.reviewsCreated

  const travelReviews = reviews?.filter((review) => review.type === "TRAVEL")
  const participantReviews = reviews?.filter((review) => review.type === "USER")

  if (loading) {
    return <ViajeroLoader />
  }

  return (
    <Container size="xl" mt="xl">
      <Title order={2} size={32} mb={20} ta="center" fw={BOLD}>
        Reviews
      </Title>
      <Text size="lg" mb={60} ta="center" >
        Manage your reviews for trips and participants, whether creating, editing, or adding new ones.
      </Text>

      {reviews && reviews.length > 0 ? (
        <Stack gap="xl">
          {travelReviews && travelReviews.length > 0 && (
            <Stack gap="md">
              <Title order={2} size={24} fw={SEMI_BOLD}>
                Travel Reviews
              </Title>
              <Stack gap="md" w="100%">
                {travelReviews.map((review, index) => (
                  <ReviewCard
                    key={review.id}
                    review={review as Review}
                    setSelectedTravel={setSelectedTravel}
                    setSelectedImageSrc={setSelectedImageSrc}
                    setSelectedUserId={setSelectedUserId}
                    index={index}
                  />
                ))}
              </Stack>
            </Stack>
          )}

          {participantReviews && participantReviews.length > 0 && (
            <Stack gap="md">
              <Title order={2} size={24} fw={SEMI_BOLD}>
                Participant Reviews
              </Title>
              <Stack gap="md" w="100%">
                {participantReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review as Review}
                    setSelectedTravel={setSelectedTravel}
                    setSelectedImageSrc={setSelectedImageSrc}
                    setSelectedUserId={setSelectedUserId}
                    openUserModal={openUserModal}
                  />
                ))}
              </Stack>
            </Stack>
          )}
        </Stack>
      ) : (
        <Card p="xl" radius="md" withBorder>
          <Text ta="center" c="dimmed">
            You haven't written any reviews yet!
          </Text>
        </Card>
      )}

      <TravelDetailsModal
        selectedTravel={selectedTravel}
        setSelectedTravel={setSelectedTravel}
        selectedImageSrc={selectedImageSrc}
        showJoinButton={false}
        showMaxCap={false}
      />

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
        <ProfileDetails userId={selectedUserId || ''} />
      </Modal>
    </Container>
  )
}

export const ReviewCard = ({ review, setSelectedTravel, setSelectedImageSrc, setSelectedUserId, index, openUserModal }: {
  review: Review,
  setSelectedTravel: any,
  setSelectedImageSrc: any,
  setSelectedUserId: any,
  index?: number,
  openUserModal?: () => void
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Text size="lg" style={{ lineHeight: 1.4 }}>
          {review.content}
        </Text>

        <Group gap="xs">
          {[...Array(5)].map((_, i) => (
            <Text key={i} c={i < Number(review.stars) ? "yellow" : "gray"}>★</Text>
          ))}
        </Group>

        {review.type === "TRAVEL" ? (
          <Card.Section p="md" bg="gray.0">
            <Stack gap={4}>
              <Group mb={10}>
                <FaPlane size={20} color={VIAJERO_GREEN} />
                <Text size="md" fw={SEMI_BOLD}>Travel Review</Text>
              </Group>
              <Group>
                <Box>
                  <Text size="md">{review.travel?.travelTitle}</Text>
                  <Text mt={20} size="sm" c="dimmed" lineClamp={2}>{review.travel?.travelDescription}</Text>
                </Box>
              </Group>
              <Stack align="center">
                <Button
                  mt="sm"
                  variant="light"
                  w="40%"
                  color={VIAJERO_GREEN}
                  onClick={() => {
                    setSelectedTravel(review.travel);
                    setSelectedImageSrc(travelImages[index || 0 % travelImages.length]);
                  }}
                >
                  View Travel Details
                </Button>
              </Stack>
            </Stack>
          </Card.Section>
        ) : (
          <Card.Section p="md" bg="gray.0">
            <Stack gap={4}>
              <Group mb={10}>
                <CgProfile size={20} color={VIAJERO_GREEN} />
                <Text size="md" fw={SEMI_BOLD}>Participant Review</Text>
              </Group>
              <Box>
                <Text size="md">{review.receivedUserBy?.name}</Text>
                <Text mt={10} size="sm" c="dimmed">{review.receivedUserBy?.email}</Text>
              </Box>
              <Stack align="center">
                <Button
                  mt="sm"
                  variant="light"
                  w="40%"
                  color={VIAJERO_GREEN}
                  onClick={() => {
                    setSelectedUserId(review.receivedUserBy?.id);
                    openUserModal && openUserModal();
                  }}
                >
                  View Profile
                </Button>
              </Stack>
            </Stack>

          </Card.Section>
        )
        }
      </Stack>
    </Card>
  );
}