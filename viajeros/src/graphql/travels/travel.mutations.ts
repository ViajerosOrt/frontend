import { gql } from "@apollo/client";

export const CREATE_TRAVEL_MUTATION = gql(`
mutation createTravel(
    $createTravelInput: CreateTravelInput!,
    $createUserId: String!,
    $activitiesId: [String!]!,
    $createLocationInput: CreateLocationInput!
  ) {
    createTravel(
      createTravelInput: $createTravelInput,
      createUserId: $createUserId,
      activitiesId: $activitiesId,
      createLocationInput: $createLocationInput
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
