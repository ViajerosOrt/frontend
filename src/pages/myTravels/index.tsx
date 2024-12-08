import { TravelDto } from "../../graphql/__generated__/gql";
import { ViajeroEmptyMessage } from "../../components/ViajeroEmptyMessage/viajeroEmptyMessage";
import { ViajeroLoader } from "../../components/ViajeroLoader/ViajeroLoader";
import { Container, Title, Grid } from "@mantine/core";
import { MyTravelsList } from "../../components/Travel/TravelList/MyTravelsList";
import React, { useEffect } from "react";
import { useTravelFilters } from "@/hooks/useTravelsFilters";
import { useAuth } from "@/hooks/useAth";

export default function Travels() {
  const { currentUser } = useAuth()
  const { data, loading } = useTravelFilters();

  const travels = data?.travels?.map((travel) => {
    const { ...rest } = travel;
    return rest as TravelDto;
  }) || [];

  const myTravels = travels.filter((travel) => travel.creatorUser.email == currentUser?.email)

  if (loading) {
    return (
      <ViajeroLoader />
    )
  }
  return (
    <Container size="xl" mt="xl">
      {!myTravels || myTravels.length === 0 ? (
        <ViajeroEmptyMessage message="No travels were found" />
      ) : (
        <Grid>
          <MyTravelsList travels={myTravels} />
        </Grid>
      )}
    </Container>
  );
}