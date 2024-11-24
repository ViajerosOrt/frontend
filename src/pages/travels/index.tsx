import { TravelList } from "@/components/Travel/TravelList/TravelList";
import { ViajeroEmptyMessage } from "@/components/ViajeroEmptyMessage/viajeroEmptyMessage";
import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { Travel, useTravelsQuery } from "@/graphql/__generated__/gql";
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
import { VIAJERO_GREEN } from "@/consts";
import { FaPlane } from "react-icons/fa";



export default function Travels() {

  const { data, loading } = useTravelsQuery({
    fetchPolicy: 'cache-and-network'
  })

  const travels = data?.travels

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
        color = {VIAJERO_GREEN}
        rightSection={<FaPlane />}
      >
        Create a new travel
      </Button>

      <Title order={2} mb={20} size={24} ta="center">
        Choose your next travel
      </Title>
      {!travels || travels.length === 0 ? (
        <ViajeroEmptyMessage message="No travels were found" />
      ) : (
        <Grid>
           <TravelList travels={travels as Travel[]} />
        </Grid>
      )}
      
    </Container>
  );
}


