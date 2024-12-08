import { TravelDto } from "../../graphql/__generated__/gql";
import { ViajeroEmptyMessage } from "../../components/ViajeroEmptyMessage/viajeroEmptyMessage";
import { ViajeroLoader } from "../../components/ViajeroLoader/ViajeroLoader";
import { Container, Title, Grid } from "@mantine/core";
import { MyTravelsList } from "../../components/Travel/TravelList/MyTravelsList";
import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAth";
import { useMyTravelFilters } from "@/hooks/useMyTravelsFilters";

export default function Travels() {
  const { currentUser } = useAuth()
  const { filters, updateFilters, applyFilters, defaultFilters, data, loading } = useMyTravelFilters();

  const travels = data?.travels?.map((travel) => {
    const { ...rest } = travel;
    return rest as TravelDto;
  }) || [];

  const myTravels = travels.filter((travel) => travel.creatorUser.email == currentUser?.email)


  return (
    <Container size="xl" mt="xl">

      <Grid>
        <MyTravelsList travels={myTravels} loading={loading} filters={filters} updateFilters={updateFilters} applyFilters={applyFilters} defaultFilters={defaultFilters} />
      </Grid>
    </Container>
  );
}