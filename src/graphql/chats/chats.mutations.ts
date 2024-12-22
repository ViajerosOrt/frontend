import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
mutation SendMessage($createMessageInput: CreateMessageInput!, $chatId: String!) {
  sendMessage(createMessageInput: $createMessageInput, chatId: $chatId) {
    content
    id
  }
}
`;