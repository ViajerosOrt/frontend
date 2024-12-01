import { gql } from "@apollo/client";

export const JOIN_TRAVEL = gql`
  mutation JoinToTravel($travelId: String!) {
    joinToTravel(travelId: $travelId) {
      id
    }
  }
`;

export const CREATE_TRAVEL_MUTATION = gql(`
  mutation CreateTravel(
      $createTravelInput: CreateTravelInput!,
      $activityId: [String!]!,
      $createLocationInput: CreateLocationInput!,
      $items: [String!]!,
      $transportId: String
    ) {
      createTravel(
        createTravelInput: $createTravelInput,
        activityId: $activityId,
        createLocationInput: $createLocationInput,
        items: $items,
        transportId: $transportId
      ) {
        id
        travelTitle
        travelDescription
        startDate
        finishDate
        maxCap
        isEndable
      }
    }
  `);
