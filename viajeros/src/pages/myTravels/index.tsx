import { useApolloClient } from "@apollo/client";
import { useEffect, useState } from "react";
import { TravelDto, useFindAllTravelByUserQuery } from "@/graphql/__generated__/gql";
import { ViajeroEmptyMessage } from "@/components/ViajeroEmptyMessage/viajeroEmptyMessage";
import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { Container, Title, Grid, Button } from "@mantine/core";
import Link from "next/link";
import { FaPlane } from "react-icons/fa";
import { VIAJERO_GREEN } from "@/consts";
import { MyTravelsList } from "@/components/Travel/TravelList/MyTravelsList";

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
    const { __typename, ...rest } = travel;
    return rest as TravelDto;
  }) || [];

  return (
    <Container size="xl" mt="xl">
      {}
      <Title order={2} mb={20} size={24} ta="center" style={{
                        fontSize: '40px',
                        fontWeight: 'bold',
                        color: 'black',
                        marginRight: '200px',
                    }}>
        My Travels
      </Title>

      {}
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