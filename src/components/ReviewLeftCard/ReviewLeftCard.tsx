import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { BOLD, SEMI_BOLD, VIAJERO_GREEN } from "@/consts";
import { Review, TravelDto, useRemoveReviewMutation, useUserByIdQuery } from "@/graphql/__generated__/gql";
import { useAuth } from "@/hooks/useAth";
import { travelImages } from "@/utils";
import { Box, Card, Container, Group, Image, Stack, Text, Title, Button, Modal, ActionIcon, Menu } from "@mantine/core";
import { FaPlane, FaSlidersH, FaTrash } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { showNotification } from "@mantine/notifications";
import Link from "next/link";
import { IoBook } from "react-icons/io5";

export const ReviewLeftCard = ({ review, setSelectedTravel, setSelectedImageSrc, setSelectedUserId, index, openUserModal, showViewProfile }: {
  review: Review,
  setSelectedTravel: any,
  setSelectedImageSrc: any,
  setSelectedUserId: any,
  index?: number,
  showViewProfile?: boolean,
  openUserModal?: () => void
}) => {
  const [removeReview] = useRemoveReviewMutation({
    refetchQueries: ["UserById"]
  });

  const handleRemoveSubmit = async () => {
    try {
      await removeReview({ variables: { removeReviewId: review.id } });
      showNotification({
        message: 'Review removed successfully',
        color: 'green',
      });
    } catch (error) {
      console.error(error);
      showNotification({
        message: 'Error removing review',
        color: 'red',
      });
    }
  }

  return (
    <Card shadow="sm" radius="md" withBorder>
      <Stack gap="md" >
        <Group justify="space-between" align="center">
          <Text size="lg" style={{ lineHeight: 1.4, flex: 1 }}>
            {review.content}
          </Text>
          <Menu>
            <Menu.Target>
              <ActionIcon variant="subtle">
                <FaSlidersH size={25} color={VIAJERO_GREEN} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                component={Link}
                href={`/reviews/update/${review.id}`}
                leftSection={<IoBook size={16} />}
              >
                Edit Review
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<FaTrash size={16} />}
                onClick={handleRemoveSubmit}
              >
                Delete Review
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

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
                    setSelectedImageSrc(review.travel?.imageUrl);
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
                <Text size="md" fw={SEMI_BOLD}>Review Received By</Text>
              </Group>
              <Box>
                <Group>
                  <Stack gap={0}>
                    <Text size="md" fw={500}>{review.receivedUserBy?.name}</Text>
                    <Text size="sm" c="dimmed">{review.receivedUserBy?.email}</Text>
                  </Stack>
                </Group>
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
    </Card >
  );
}