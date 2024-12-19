import { gql } from "@apollo/client";

export const UPDATE_USER = gql`
  mutation Update($updateUserInput: UpdateUserInput!) {
    update(updateUserInput: $updateUserInput) {
      birthDate
      description
      name
      country
      userActivities {
        activityName
      }
    }
  }
`;
