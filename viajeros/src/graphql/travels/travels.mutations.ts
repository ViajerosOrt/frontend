import { gql } from "@apollo/client";

export const JOIN_TRAVEL = gql`
  mutation JoinToTravel($travelId: String!) {
    joinToTravel(travelId: $travelId) {
      id
    }
  }
`;
