import { gql } from "@apollo/client";

export const GET_USER = gql`
  query UserById($userByIdId: String!) {
    userById(id: $userByIdId) {
      birthDate
      password
      description
      email
      name
      whatsapp
      instagram
      country
      reviewsCreated {
        content
        stars
        travel {
          travelTitle
          travelDescription
        }
      }
      userActivities {
        id
        activityName
      }
      travelsCreated {
        travelTitle
        id
        travelDescription
        startDate
        finishDate
        travelActivities {
          activityName
        }
      }
    }
  }
`;
