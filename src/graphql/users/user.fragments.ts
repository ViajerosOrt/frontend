import { gql } from "@apollo/client";

export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    birthDate
    password
    description
    email
    name
    whatsapp
    instagram
    country
    userImage
    userActivities {
      id
      activityName
    }
    reviewsReceived {
      id
      content
      stars
      type
      travel {
        travelTitle
        travelDescription
      }
      createdUserBy {
        email
        id
        name
      }
    }
    reviewsCreated {
      id
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
      }
      stars
      receivedUserBy {
        id
        name
        email
      }
    }
    joinsTravels {
      country
      finishDate
      id
      imageUrl
      maxCap
      startDate
      transport {
        name
        id
      }
      travelTitle
      travelDescription
      usersTravelers {
        id
        email
        name
        userImage
      }
      travelActivities {
        id
        activityName
      }
    }
    travelsCreated {
      travelTitle
      id
      imageUrl
      travelDescription
      startDate
      finishDate
      travelActivities {
        activityName
      }
    }
  }
`;
