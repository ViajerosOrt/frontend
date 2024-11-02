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
      checklist{
      id
      name
      
      items {
       name
       state
       }
      }
      usersTravelers{
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
