import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { BOLD, SEMI_BOLD, VIAJERO_GREEN } from "@/consts";
import { Review, TravelDto, useUserByIdQuery } from "@/graphql/__generated__/gql";
import { useAuth } from "@/hooks/useAth";
import { travelImages } from "@/utils";
import { Box, Card, Container, Group, Image, Stack, Text, Title, Button, Modal } from "@mantine/core";
import { FaBook, FaPlane } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

export const ReviewLeftCard = ({ review, setSelectedTravel, setSelectedImageSrc, setSelectedUserId, index, openUserModal, showViewProfile }: {
  review: Review,
  setSelectedTravel: any,
  setSelectedImageSrc: any,
  setSelectedUserId: any,
  index?: number,
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

        {review.type === "TRAVEL" ? (
          <Card.Section p="md" bg="gray.0">
            <Stack gap={4}>
              <Group mb={10}>
                <FaPlane size={20} color={VIAJERO_GREEN} />
                <Text size="md" fw={SEMI_BOLD}>Travel Review</Text>
              </Group>
              <Group>
                <Box>
                  <Text size="md">{review.travel?.travelTitle}</Text>
                  <Text mt={20} size="sm" c="dimmed" lineClamp={2}>{review.travel?.travelDescription}</Text>
                </Box>
              </Group>
              <Stack align="center">
                <Button
                  mt="sm"
                  variant="light"
                  w="100%"
                  color={VIAJERO_GREEN}
                  onClick={() => {
                    setSelectedTravel(review.travel);
                    setSelectedImageSrc(travelImages[index || 0 % travelImages.length]);
                  }}
                >
                  View Travel Details
                </Button>
              </Stack>
            </Stack>
          </Card.Section>
        ) : (
          <Card.Section p="md" bg="gray.0">
            <Stack gap={4}>
              <Group mb={10}>
                <CgProfile size={20} color={VIAJERO_GREEN} />
                <Text size="md" fw={SEMI_BOLD}>Participant Review</Text>
              </Group>
              <Box>
                <Text size="md">{review.receivedUserBy?.name}</Text>
                <Text mt={10} size="sm" c="dimmed">{review.receivedUserBy?.email}</Text>
              </Box>
              {showViewProfile &&
                <Stack align="center">
                  <Button
                    mt="sm"
                    variant="light"
                    w="100%"
                    color={VIAJERO_GREEN}
                    onClick={() => {
                      setSelectedUserId(review.receivedUserBy?.id);
                      openUserModal && openUserModal();
                    }}
                  >
                    View Profile
                  </Button>
                </Stack>
              }
            </Stack>

          </Card.Section>
        )
        }
      </Stack>
    </Card>
  );
}