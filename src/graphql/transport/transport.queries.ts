import { gql } from "@apollo/client";

export const GET_TRANSPORTS = gql`
query Transports {
  transports {
    name
    id
  }
}
`

