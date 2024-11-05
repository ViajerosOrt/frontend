import { gql } from "@apollo/client";

export const GET_ALL_ACTIVITIES_QUERY = gql`
  query GetAllActivities {
    activities {
      id
      activityName
    }
  }
`;