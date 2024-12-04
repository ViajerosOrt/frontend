import { gql } from "@apollo/client";

export const GET_TRAVELS = gql`
  query travels {
    travels {
      id
      travelTitle
      travelDescription
      startDate
      finishDate
      maxCap
      isJoined
      usersCount
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
  }
`;

export const GET_TRAVELS_BY_USER = gql`
  query FindAllTravelByUser {
    findAllTravelByUser {
      id
      travelTitle
      travelDescription
      maxCap
      usersCount
      finishDate
      startDate
      travelActivities {
        activityName
      }
    }
  }
`;
