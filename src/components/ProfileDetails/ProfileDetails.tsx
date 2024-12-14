import { ViajeroEmptyMessage } from "@/components/ViajeroEmptyMessage/viajeroEmptyMessage";
import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { Travel, useUserByIdQuery } from "@/graphql/__generated__/gql";
import { BOLD } from "@/consts";
import {
  Avatar,
  Box,
  Center,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text
} from "@mantine/core";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import { getActivityAvatar } from "@/utils";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { SmallTravelDetails } from "../Travel/SmallTravelDetails/SmallTravelDetails";
import { useRouter } from "next/router";

export const ProfileDetails = ({ userId }: { userId: string }) => {
  const router = useRouter();

  const { data, loading } = useUserByIdQuery({
    variables: { userByIdId: userId || '' },
    skip: !!!userId
  })

  const user = data?.userById

  if (loading || !user) {
    return <ViajeroLoader />
  }


  return (
    <Stack gap="xl" p={20}>
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

      <Group align="start">
        <Text fw={BOLD} mb="xs" >Social Networks:</Text>
        {(user.whatsapp || user.instagram) ? (
          <>
            <Group mr={30}>
              <FaWhatsapp color="#25D366" className="h-6 w-6" />
              <Text>{user.whatsapp}</Text>
            </Group>
            <Group>
              <FaInstagram color="#E1306C" className="h-6 w-6" />
              <Text >{user.instagram}</Text>
            </Group>
          </>
        ) : "You don't have social networks yet, add some in the edit page!"}

      </Group>

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
                <Box key={travel.id} style={{ cursor: 'pointer' }} onClick={() => router.push("/myTravels")}>
                  <SmallTravelDetails travel={travel as Travel} index={index} />
                </Box>
              )
            })}
          </SimpleGrid>
        ) : (
          <Text>No travels created yet.</Text>
        )}
      </Box>

    </Stack>
  )
}