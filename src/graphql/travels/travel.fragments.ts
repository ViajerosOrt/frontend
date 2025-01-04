import { gql } from "@apollo/client";

export const TRAVEL_FIELDS = gql`
  fragment TravelFields on TravelDto {
    id
    travelTitle
    travelDescription
    startDate
    finishDate
    maxCap
    isJoined
    usersCount
    imageUrl
    transport {
      name
      id
    }
    checklist {
      id
      name
      items {
        name
        state
      }
    }
    usersTravelers {
      name
      email
    }
    creatorUser {
      name
      email
    }
    travelActivities {
      id
      activityName
    }
  }
`;
