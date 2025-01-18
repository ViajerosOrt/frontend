import { gql } from "@apollo/client";
import { TRAVEL_FIELDS } from "./travel.fragments";

export const GET_TRAVELS = gql`
  query Travels(
    $transportId: String
    $activityIds: [String!]
    $travelName: String
    $endDate: DateTime
    $startDate: DateTime
    $countryName: String
    $creatorId: String
  ) {
    travels(
      transportId: $transportId
      activityIds: $activityIds
      travelName: $travelName
      endDate: $endDate
      startDate: $startDate
      countryName: $countryName
      creatorId: $creatorId
    ) {
      ...TravelFields
    }
  }
  ${TRAVEL_FIELDS}
`;

export const GET_TRAVEL_BY_ID = gql`
  query Travel($id: String!) {
    travel(id: $id) {
      ...TravelFields
    }
  }
  ${TRAVEL_FIELDS}
`;


export const GET_CHAT_FOR_TRAVEL = gql`
query ChatTravel($travelId: String!) {
  chatTravel(travelId: $travelId) {
    id
  }
}
`;