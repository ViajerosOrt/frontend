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
        reviewsCreated {
      content
      type
      travel {
        id
        travelTitle
        travelDescription
        startDate
        finishDate
       transport {
        name
        id
      }
        travelActivities {
        id
        activityName
      }
        country
        travelActivities {
          activityName
          id
        }
        country
        transport {
          name
          id
        }
      }
      stars
      id
      receivedUserBy {
        id
        name
        email
      }
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
