import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { BOLD, SEMI_BOLD, VIAJERO_GREEN } from "@/consts";
import { Review, TravelDto, useUserByIdQuery } from "@/graphql/__generated__/gql";
import { useAuth } from "@/hooks/useAth";
import { Card, Container, Stack, Text, Title, Button, Modal } from "@mantine/core";
import { useState } from "react";
import { TravelDetailsModal } from "@/components/TravelDetailsModal/TravelDetailsModal";
import { ProfileDetails } from "@/components/ProfileDetails/ProfileDetails";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { IoBook } from "react-icons/io5";
import { ReviewLeftCard } from "@/components/ReviewLeftCard/ReviewLeftCard";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Reviews() {
  const { currentUser } = useAuth()
  const { isMobile } = useIsMobile();
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
      <Text size="lg" ta="center" >
        Manage your reviews for trips and participants, whether creating, editing, or adding new ones.
      </Text>

      <Button
        component={Link}
        href="/reviews/selectTravel"
        mt="md"
        mb={20}
        size="md"
        radius="md"
        color={VIAJERO_GREEN}
        rightSection={<IoBook />}
        styles={{
          root: {
            width: isMobile ? '100%' : 'auto',
          }
        }}
      >
        Add a review
      </Button>

      {reviews && reviews.length > 0 ? (
        <Stack gap="xl">
          {travelReviews && travelReviews.length > 0 && (
            <Stack gap="md">
              <Title order={2} size={24} fw={SEMI_BOLD}>
                Travel Reviews
              </Title>
              <Stack gap="md" w="100%">
                {travelReviews.map((review, index) => (
                  <ReviewLeftCard
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
                  <ReviewLeftCard
                    key={review.id}
                    review={review as Review}
                    setSelectedTravel={setSelectedTravel}
                    setSelectedImageSrc={setSelectedImageSrc}
                    setSelectedUserId={setSelectedUserId}
                    openUserModal={openUserModal}
                    showViewProfile={true}
                  />
                ))}
              </Stack>
            </Stack>
          )}
        </Stack>
      ) : (
        <Card p="xl" radius="md" withBorder>
          <Text ta="center" c="dimmed">
            You havent written any reviews yet!
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
        styles={{
          content: {
            overflowY: 'scroll',
            scrollbarWidth: 'none',
          },
        }}
        opened={opened}
        centered
        size={isMobile ? "100%" : "60%"}
        onClose={() => {
          closeUserModal();
          setTimeout(() => {
            setSelectedUserId(undefined);
          }, 300);
        }}
      >
        <ProfileDetails userId={selectedUserId || ''} showViewProfile={false} />
      </Modal>
    </Container>
  )
}

