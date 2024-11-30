import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql(`
mutation login($input: LoginUserInput!){
  login(loginUserInput: $input) {
    user {
      id
      email
      name
    }
    accessToken {
     value
     validForSeconds
     validUntil
    }
  }
}`);

export const SIGNUP_USER_MUTATION = gql`
  mutation signup($input: SignupUserInput!) {
    signup(signupUserInput: $input) {
      email
      password
    }
  }
`;
