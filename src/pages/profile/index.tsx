import { ViajeroEmptyMessage } from "@/components/ViajeroEmptyMessage/viajeroEmptyMessage";
import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { Travel, useUserByIdQuery } from "@/graphql/__generated__/gql";
import { BOLD, VIAJERO_GREEN } from "@/consts";
import { useAuth } from "@/hooks/useAth";
import {
  Avatar,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Text
} from "@mantine/core";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import { getActivityAvatar, travelImages } from "@/utils";
import { useHover } from "@mantine/hooks";
import { useRouter } from "next/router";
import { ActivitiesAvatarGroup } from "@/components/Activity/ActivitiesAvatarGroup";


export default function Profile() {
  const { currentUser } = useAuth()
  const router = useRouter();
  const { data, loading } = useUserByIdQuery({
    variables: { userByIdId: currentUser?.id || '' },
    skip: !!!currentUser?.id
  })

  const user = data?.userById

  if (loading) {
    return <ViajeroLoader />
  }

  if (!user) {
    return <ViajeroEmptyMessage message="There was a problem retrieving your user data" />
  }

  return (
    <Container mt="xl" ta="left" w="100%" >
      <Button
        component={Link}
        href="/profile/editProfile"
        my="md"
        size="md"
        radius="md"
        color={VIAJERO_GREEN}
        rightSection={<CgProfile />}
      >
        Edit Profile
      </Button>
      <Paper p="md" withBorder shadow="md" w="100%">
        <Stack gap="xl">
          <Center>
            <Avatar size={120} radius="xl" color="green">
              <CgProfile size={80} />
            </Avatar>
          </Center>

          <Box>
            <SimpleGrid cols={3} spacing="lg">
              <Group align="end">
                <Text fw={BOLD}>Name:</Text>
                <Text>{user.name}</Text>
              </Group>
              <Group mt="xs">
                <Text fw={BOLD}>Email:</Text>
                <Text>{user.email}</Text>
              </Group>
              <Group mt="xs">
                <Text fw={BOLD}>Birth Date:</Text>
                <Text>{new Date(user.birthDate).toLocaleDateString()}</Text>
              </Group>
            </SimpleGrid>
          </Box>

          <Box>
            <Text fw={BOLD} mb="xs">Description:</Text>
            <Text>{user.description || 'No description provided.'}</Text>
          </Box>

          <Divider />

          <Box>
            <Text fw={700} mb="xs">Activities:</Text>
            {user.userActivities && user.userActivities.length > 0 ? (
              <SimpleGrid cols={3} spacing="lg">
                {user.userActivities.map((activity) => (
                  <Group key={activity.activityName}>
                    {getActivityAvatar(activity.activityName, 'lg')}
                    <Text>{activity.activityName}</Text>
                  </Group>
                ))}
              </SimpleGrid>
            ) : (
              <Text c="dimmed">No activities selected yet.</Text>
            )}
          </Box>
          <Divider />

          <Box>
            <Text fw={BOLD} ta="center" mb="xs">Travels Created</Text>
            {user?.travelsCreated && user?.travelsCreated.length > 0 ? (
              <SimpleGrid cols={3} spacing="md">
                {user.travelsCreated.map((travel, index) => {
                  return (
                    <Box style={{ cursor: 'pointer' }} onClick={() => router.push("/myTravels")}>
                      <TravelCreatedCard travel={travel as Travel} index={index} />
                    </Box>
                  )
                })}
              </SimpleGrid>
            ) : (
              <Text>No travels created yet.</Text>
            )}
          </Box>

        </Stack>
      </Paper>
    </Container >
  )
}

const TravelCreatedCard = ({ travel, index }: { travel: Travel, index: number }) => {
  const { hovered, ref } = useHover();

  const formattedStartDate = new Date(travel.startDate).toLocaleDateString('es-ES');
  const formattedEndDate = new Date(travel.finishDate).toLocaleDateString('es-ES');

  return (
    <Card
      ref={ref}
      shadow="md"
      radius="md"
      withBorder
      style={{
        transition: 'transform 0.2s ease',
        transform: hovered ? 'scale(1.020)' : 'scale(1)',
      }}
    >
      <Card.Section>
        <Image
          src={travelImages[index % travelImages.length] || "/default-travel.jpg"}
          alt={travel.travelTitle}
          height={120}
        />
      </Card.Section>
      <Stack m={8} gap={4}>
        <Text fw={BOLD} size="sm">{travel.travelTitle}</Text>
        <Text size="xs">{formattedStartDate} - {formattedEndDate}</Text>
      </Stack>
      <Text m={8} size="xs" truncate lineClamp={2} mih={10}>
        {travel.travelDescription || "No description available."}
      </Text>
      <ActivitiesAvatarGroup activities={travel.travelActivities || []} />
    </Card>
  );
}
