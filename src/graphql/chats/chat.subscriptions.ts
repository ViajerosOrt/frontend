import { gql } from "@apollo/client";

export const CHAT_MESSAGE_RECEIVED = gql`
subscription ChatMessageAdded($chatId: String!) {
  chatMessageAdded(chatId: $chatId) {
    content
    id
    createdAt
    user {
      id
      name
      email
    }
  }
}
`;