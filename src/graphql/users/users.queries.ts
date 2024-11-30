import { gql } from "@apollo/client";

export const GET_USER = gql`
query UserById($userByIdId: String!) {
  userById(id: $userByIdId) {
    birthDate
    description
    email
    name
    reviewsCreated {
      content
      stars
      travel {
        travelTitle
        travelDescription
      }
    }
    userActivities {
      activityName
    }
    travelsCreated {
      travelTitle
      id
      travelDescription
      startDate
      finishDate
    }
  }
}
`

