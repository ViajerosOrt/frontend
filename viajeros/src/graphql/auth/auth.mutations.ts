import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql(`
mutation login($input: LoginUserInput!){
  login(loginUserInput: $input) {
    user {
      id
      email
    }
    accessToken {
     value
     validForSeconds
     validUntil
    }
  }
}`);
