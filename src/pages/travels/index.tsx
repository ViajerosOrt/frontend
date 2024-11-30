import { TravelList } from "@/components/Travel/TravelList/TravelList";
import { ViajeroEmptyMessage } from "@/components/ViajeroEmptyMessage/viajeroEmptyMessage";
import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { TravelDto, useTravelsQuery } from "@/graphql/__generated__/gql";
import {
  Button,
  Container,
  Grid,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { VIAJERO_GREEN } from "@/consts";
import { FaPlane } from "react-icons/fa";



export default function Travels() {

  const { data, loading } = useTravelsQuery({
    fetchPolicy: 'cache-and-network'
  })

  const travelsDtos = data?.travels

  if (loading) {
    return (
      <ViajeroLoader />
    )
  }

  return (
    <Container size="xl" mt="xl">

      <Button
        component={Link}
        href="/travels/travelCreate"
        mt="md"
        size="md"
        radius="md"
        color={VIAJERO_GREEN}
        rightSection={<FaPlane />}
      >
        Create a new travel
      </Button>

      <Title order={2} mb={20} size={24} ta="center">
        Choose your next travel
      </Title>
      {!travelsDtos || travelsDtos.length === 0 ? (
        <ViajeroEmptyMessage message="No travels were found" />
      ) : (
        <Grid>
          <TravelList travelsDtos={travelsDtos as TravelDto[]} />
        </Grid>
      )}

    </Container>
  );
}


