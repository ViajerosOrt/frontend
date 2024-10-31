import { gql } from "@apollo/client";

export const GET_ALL_ACTIVITIES = gql`
  query GetAllActivities {
    activities {
      id
      activityName
    }
  }
`;


