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

export const USER_CHAT_UPDATED_WITH_MESSAGE = gql`
subscription ChatUpdated($userId: String!) {
  chatUpdated(userId: $userId) {
    id
    content
    user {
      name
      userImage
    }
    chat {
      id
      travel {
        travelTitle
        imageUrl
      }
    }
  }
}
`;