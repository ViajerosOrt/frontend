import { gql } from "@apollo/client";

export const CREATE_REVIEW = gql`
  mutation CreateReview($createReviewInput: CreateReviewInput!, $userReceiverId: String!, $travelId: String!) {
  createReview(createReviewInput: $createReviewInput, userReceiverId: $userReceiverId, travelId: $travelId) {
    id
  }
}
`;
