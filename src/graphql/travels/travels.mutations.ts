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
        imageUrl
      }
    }
  `);

export const LEAVE_TRAVEL = gql`
  mutation LeaveTravel($travelId: String!) {
    leaveTravel(travelId: $travelId) {
      id
    }
  }
`;

export const UPDATE_TRAVEL_MUTATION = gql`
  mutation UpdateTravel(
    $updateTravelInput: UpdateTravelInput!
    $activityId: [String!]!
    $transportId: String
    $items: [String!]!
    $updateLocationInput: CreateLocationInput!
  ) {
    updateTravel(
      updateTravelInput: $updateTravelInput
      activityId: $activityId
      transportId: $transportId
      items: $items
      updateLocationInput: $updateLocationInput
    ) {
      id
    }
  }
`;

export const REMOVE_TRAVEL = gql`
mutation RemoveTravel($removeTravelId: String!) {
  removeTravel(id: $removeTravelId)
}
`;

export const EXPEL_USER_FROM_TRAVEL = gql`
  mutation ExpelFromTravel($bannedUserId: String!, $travelId: String!) {
    expelFromTravel(bannedUserId: $bannedUserId, travelId: $travelId) {
      id
    }
  }
`;
