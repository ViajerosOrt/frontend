import { SEMI_BOLD, VIAJERO_GREEN } from "@/consts";
import { Review } from "@/graphql/__generated__/gql";
import { useAuth } from "@/hooks/useAth";
import { travelImages } from "@/utils";
import { Box, Card, Container, Group, Image, Stack, Text, Button, Modal } from "@mantine/core";
import { FaPlane } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

export const ReviewReceivedCard = ({ review, setSelectedUserId, index, openUserModal, showCreatedBy, showViewProfile = true }: {
  review: Review,
  setSelectedUserId: any,
  index?: number,
  showCreatedBy?: boolean,
  showViewProfile?: boolean,
  openUserModal?: () => void
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Text size="lg" style={{ lineHeight: 1.4 }}>
          {review.content}
        </Text>

        <Group gap="xs">
          {[...Array(5)].map((_, i) => (
            <Text key={i} c={i < Number(review.stars) ? "yellow" : "gray"}>★</Text>
          ))}
        </Group>


        <Card.Section p="md" bg="gray.0">
          <Stack gap={4}>
            <Group mb={10}>
              <CgProfile size={20} color={VIAJERO_GREEN} />
              <Text size="md">{review.createdUserBy?.name}</Text>

            </Group>
            <Box>
              <Text mt={10} size="sm" c="dimmed">{review.createdUserBy?.email}</Text>
            </Box>
            {showViewProfile &&
              <Stack align="center">
                <Button
                  mt="sm"
                  variant="light"
                  w="100%"
                  color={VIAJERO_GREEN}
                  onClick={() => {
                    setSelectedUserId(review.createdUserBy?.id);
                    openUserModal && openUserModal();
                  }}
                >
                  View Profile
                </Button>
              </Stack>
            }

          </Stack>

        </Card.Section>
      </Stack>
    </Card>
  );
}