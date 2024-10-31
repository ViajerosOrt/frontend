import { TravelList } from "@/components/Travel/TravelList/TravelList";
import { ViajeroEmptyMessage } from "@/components/ViajeroEmptyMessage/viajeroEmptyMessage";
import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { useTravelsQuery } from "@/graphql/__generated__/gql";
import TravelCreateForm from "@/components/Travels/TravelCreateForm";
import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
  Button,
  Card,
  Container,
  Grid,
  Title,
} from "@mantine/core";
import { IoIosAirplane } from "react-icons/io";
import Link from "next/link";



export default function travels() {

  const { data, loading } = useTravelsQuery({
    fetchPolicy: 'cache-and-network'
  })

  const travels = data?.travels

  if (loading) {
    return (
      <ViajeroLoader />
    )
  }

  if (!travels) {
    return <ViajeroEmptyMessage message="No travels where found" />
  }

  return (
    <Container size="xl" mt="xl">
      <Title order={2} mb={20} size={24} ta="center">
        Choose your next travel
      </Title>
      <Button 
        component={Link} 
        href="/travels/travelCreate" 
        mt="md"
      >
        Create new travel
      </Button>
      <Grid>
        <TravelList travels={travels} />
      </Grid>
    </Container>
  );
}


