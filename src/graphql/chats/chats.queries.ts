import { gql } from "@apollo/client";

export const GET_CHATS_FOR_USER = gql`
query ChatUser {
  chatUser {
    id
    travel {
      id
      travelTitle
      travelDescription
    }
    users {
      id
      email
      description
    }
  }
}
`;


export const GET_CHAT_BY_ID = gql`
query Chat($chatId: String!) {
  chat(id: $chatId) {
    id
    messages {
    id
      user {
      id
        name
        email
      }
      content
      createdAt
      id
    }
    travel {
      id
      travelDescription
      travelTitle
    }
    users {
      name
      id
      email
    }
  }
}
`;