import { TravelDto, useFindAllTravelByUserQuery } from "../../graphql/__generated__/gql";
import { ViajeroEmptyMessage } from "../../components/ViajeroEmptyMessage/viajeroEmptyMessage";
import { ViajeroLoader } from "../../components/ViajeroLoader/ViajeroLoader";
import { Container, Title, Grid } from "@mantine/core";
import { MyTravelsList } from "../../components/Travel/TravelList/MyTravelsList";
import React from "react";

export default function Travels() {

  const { data, loading } = useFindAllTravelByUserQuery({
    fetchPolicy: 'cache-and-network'
  })

  if (loading) {
    return (
      <ViajeroLoader />
    )
  }

  const travels = data?.findAllTravelByUser?.map((travel) => {
    const { ...rest } = travel;
    return rest as TravelDto;
  }) || [];

  return (
    <Container size="xl" mt="xl">
      {!travels || travels.length === 0 ? (
        <ViajeroEmptyMessage message="No travels were found" />
      ) : (
        <Grid>
          <MyTravelsList travels={travels} />
        </Grid>
      )}
    </Container>
  );
}