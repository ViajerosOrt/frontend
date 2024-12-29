import { gql } from "@apollo/client";

export const ASSIGN_ITEM_TO_USER = gql`
mutation AssignItemToUser($assignItemToUserId: String!, $itemId: String!) {
  assignItemToUser(id: $assignItemToUserId, itemId: $itemId) {
    id
  }
}
`;

export const REMOVE_ITEM_FROM_USER = gql`
mutation RemoveItemToUser($removeItemToUserId: String!, $itemId: String!) {
  removeItemToUser(id: $removeItemToUserId, itemId: $itemId) {
    id
  }
}
`;