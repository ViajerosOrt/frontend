import { gql } from "@apollo/client";

export const REVIEWS_BY_ID = gql`
  query Review($reviewId: String!) {
    review(id: $reviewId) {
      content
      createdUserBy {
        id
        email
      }
      id
      stars
      receivedUserBy {
        id
      }
      travel {
        id
        travelTitle
        imageUrl
        usersTravelers {
          id
          email
          name
        }
      }
      type
    }
  }
`;
