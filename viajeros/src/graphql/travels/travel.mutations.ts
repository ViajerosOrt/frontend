import { gql } from "@apollo/client";

export const CREATE_TRAVEL_MUTATION = gql(`
mutation CreateTravel(
    $activityId: [String!]!,
    $createLocationInput: CreateLocationInput!,
    $createTravelInput: CreateTravelInput!,
    $items: [String!]!,
    $userId: String!
) {
  createTravel(
    activityId: $activityId,
    createLocationInput: $createLocationInput,
    createTravelInput: $createTravelInput,
    items: $items,
    userId: $userId
  ) {
    creatorUser {
      id
    }
    finishDate
    id
    isEndable
    isJoined
    maxCap
    startDate
    travelActivities {
      id
    }
    travelDescription
    travelLocation {
      id
    }
    travelTitle
  }
}
`);
