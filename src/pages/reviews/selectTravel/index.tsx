import { Container, Text, Title, SimpleGrid } from "@mantine/core";
import { BOLD } from "@/consts";
import { useAuth } from "@/hooks/useAth";
import { Travel, TravelDto, useUserByIdQuery } from "@/graphql/__generated__/gql";
import { SmallTravelDetails } from "@/components/Travel/SmallTravelDetails/SmallTravelDetails";
import { useRouter } from "next/router";
import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { BackButton } from "@/components/BackButton/BackButton";

export default function SelectTravel() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const { data, loading } = useUserByIdQuery({
    variables: { userByIdId: currentUser?.id || '' },
    skip: !currentUser?.id
  });

  if (loading) {
    return <ViajeroLoader />;
  }

  const endedTravels = data?.userById?.joinsTravels?.filter((travel) =>
    new Date(travel.finishDate) < new Date()
  ) || [];

  return (
    <Container size="xl" mt="xl">
      <BackButton />
      <Title order={2} size={32} mb={20} ta="center" fw={BOLD}>
        Select a Travel to Review
      </Title>
      <Text size="lg" mb={60} ta="center">
        Choose one of your completed travels to write a review to the travel or the participants.
        Share your experiences and help others plan their new trips!
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {endedTravels.map((travel, index) => (
          <div
            key={travel.id}
            onClick={() => router.push(`/reviews/${travel.id}`)}
            style={{ cursor: 'pointer' }}
          >
            {/* TODO: Cambiar index por foto */}
            <SmallTravelDetails travel={travel as Travel} index={index} showEdit={false} />
          </div>
        ))}
      </SimpleGrid>

      {endedTravels.length === 0 && (
        <Text ta="center" c="dimmed" mt={40}>
          You dont have any completed travels yet. Once you complete a travel, you can come back to write a review!
        </Text>
      )}
    </Container>
  );
}