import { gql } from "@apollo/client";

export const CREATE_REVIEW = gql`
  mutation CreateReview($createReviewInput: CreateReviewInput!, $userReceiverId: String!, $travelId: String!) {
  createReview(createReviewInput: $createReviewInput, userReceiverId: $userReceiverId, travelId: $travelId) {
    id
  }
}
`;

export const REMOVE_REVIEW = gql`
 mutation RemoveReview($removeReviewId: String!) {
  removeReview(id: $removeReviewId) {
    id
  }
}
`;

export const UPDATE_REVIEW = gql`
 mutation UpdateReview($id: String!, $updateReviewInput: UpdateReviewInput!) {
  updateReview(id: $id, updateReviewInput: $updateReviewInput) {
    id
    content
    stars
  }
 }
`;