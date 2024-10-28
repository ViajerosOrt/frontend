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
      travelActivities {
        id
        activityName
      }
    }
  }
`;
