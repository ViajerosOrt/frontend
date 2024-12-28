import { gql } from "@apollo/client";
import { USER_FRAGMENT } from "./user.fragments";


export const GET_USER = gql`
  query UserById($userByIdId: String!) {
    userById(id: $userByIdId) {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;
