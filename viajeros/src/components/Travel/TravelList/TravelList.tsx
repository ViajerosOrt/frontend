import { Travel } from "@/graphql/__generated__/gql";
import { TravelCard } from "../TravelCard/TravelCard";

const travelImages = ["/travel_1.jpg", "/travel_2.jpg", "/travel_3.jpg"]

export const TravelList = ({ travels }: { travels: Partial<Travel>[] }) => {
  return (
    <>
      {
        travels.map((travel, index) => (
          <TravelCard key={travel.id || index} travel={travel} imageSrc={travelImages[index % travelImages.length]} />
        ))
      }
    </>
  )
}