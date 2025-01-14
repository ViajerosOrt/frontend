import TravelCreateForm from "@/components/Travels/TravelCreateForm";
import TravelUpdateForm from "@/components/Travels/TravelUpdateForm";
import { useTravelQuery } from "@/graphql/__generated__/gql";
import { Container, Text } from "@mantine/core";
import { useRouter } from "next/router";

export default function EditTravel() {
  const router = useRouter();
  const { id } = router.query;


  return (
    <Container size="xl" mt="xl">
      <TravelUpdateForm travelId={id as string} />
    </Container>
  )
}