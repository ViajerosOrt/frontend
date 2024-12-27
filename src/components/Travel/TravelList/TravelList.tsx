import { TravelDto } from "../../../graphql/__generated__/gql";
import { TravelCard } from "../TravelCard/TravelCard";
import { useState } from "react";
import { travelImages } from "@/utils";
import React from "react";
import { TravelDetailsModal } from "@/components/TravelDetailsModal/TravelDetailsModal";


export const TravelList = ({ travels }: { travels: TravelDto[] }) => {
  const [selectedTravel, setSelectedTravel] = useState<TravelDto | undefined>(undefined);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>("");

  return (
    <>
      {
        travels.map((travel, index) => (
          <TravelCard travel={travel}
            key={travel.id}
            imageSrc={travelImages[index % travelImages.length]}
            setSelectedTravel={(travel) => {
              setSelectedTravel(travel);
              setSelectedImageSrc(travelImages[index % travelImages.length]);
            }}
          />
        ))
      }

      <TravelDetailsModal selectedTravel={selectedTravel} setSelectedTravel={setSelectedTravel} selectedImageSrc={selectedImageSrc} />
    </>
  )
}


