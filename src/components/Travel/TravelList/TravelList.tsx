import { TravelDto } from "../../../graphql/__generated__/gql";
import { TravelCard } from "../TravelCard/TravelCard";
import { useState } from "react";
import { travelImages } from "@/utils";
import React from "react";
import { TravelDetailsModal } from "@/components/TravelDetailsModal/TravelDetailsModal";
import { Grid } from "@mantine/core";


export const TravelList = ({ travels }: { travels: TravelDto[] }) => {
  const [selectedTravel, setSelectedTravel] = useState<TravelDto | undefined>(undefined);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>("");

  return (
    <>
      {
        travels.map((travel, index) => (
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }} key={travel.id}>
            <TravelCard travel={travel}
              imageSrc={travelImages[index % travelImages.length]}
              setSelectedTravel={(travel) => {
                setSelectedTravel(travel);
                setSelectedImageSrc(travelImages[index % travelImages.length]);
              }}
            />
          </Grid.Col>
        ))
      }

      <TravelDetailsModal selectedTravel={selectedTravel} setSelectedTravel={setSelectedTravel} selectedImageSrc={selectedImageSrc} />
    </>
  )
}


