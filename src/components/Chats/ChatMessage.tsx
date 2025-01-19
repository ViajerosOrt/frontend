import { SEMI_BOLD } from "@/consts";
import { Message } from "@/graphql/__generated__/gql";
import { Box, Paper, Text } from "@mantine/core";

export default function ChatMessage({ message, isCurrentUser }: { message: Message, isCurrentUser: boolean }) {
  return (
    <Box
      my="md"
      key={message.id}
      style={{
        display: 'flex',
        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
        width: '100%',
      }}
    >
      <Box
        style={{
          maxWidth: '70%',
          padding: '8px',
          borderRadius: '8px',
          backgroundColor: isCurrentUser ? '#dcf8c6' : 'white',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            [isCurrentUser ? 'right' : 'left']: '-8px',
            width: '0',
            height: '0',
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderRight: isCurrentUser ? 'none' : '8px solid white',
            borderLeft: isCurrentUser ? '8px solid #dcf8c6' : 'none',
          }
        }}
      >
        {!isCurrentUser && (
          <Text size="sm" fw={600} color="dimmed">
            {message.user.name}
          </Text>
        )}
        <Text lineClamp={30}>{message.content}</Text>
        <Text mt={2} size="xs" c="dimmed">{new Date(message.createdAt).toLocaleString()}</Text>
      </Box>
    </Box>
  );
}