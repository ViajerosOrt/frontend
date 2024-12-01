import { useForm, zodResolver } from "@mantine/form";
import { BackButton } from "@/components/BackButton/BackButton";
import { BOLD, VIAJERO_GREEN } from "@/consts";
import { useGetAllActivitiesQuery, User, useUpdateMutation } from "@/graphql/__generated__/gql";
import {
  Box,
  Button,
  Center,
  Container,
  Group,
  MultiSelect,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { CgProfile } from "react-icons/cg";
import { z } from "zod";
import { DatePickerInput } from "@mantine/dates";
import { showNotification } from '@mantine/notifications';
import { useRouter } from "next/router";
import { USER_MAX_DESCRIPTION_LENGHT, USER_MAX_NAME_LENGHT } from "@/consts/validators";
import { useState } from "react";

type UserEditFormProps = {
  user: User
}

const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  description: z.string().min(1, 'Description is required').max(200),
  birthDate: z.date().refine(
    (date) => {
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      const isOld =
        today.getMonth() > date.getMonth() ||
        (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());
      return age > 18 || (age === 18 && isOld);
    },
    {
      message: 'You must be at least 18 years old.',
    }
  ),
});

export const UserEditForm = ({ user }: UserEditFormProps) => {
  const router = useRouter()
  const activitiesIds = user?.userActivities?.map(({ id }) => id) || [];
  const [selectedActivitiesIds, setSelectedActivitiesIds] = useState<string[]>(activitiesIds);

  const { data } = useGetAllActivitiesQuery();
  const activities = data?.activities || [];

  const form = useForm({
    initialValues: {
      name: user.name,
      email: user.email,
      password: user.password,
      description: user.description || '',
      birthDate: new Date(user.birthDate),
      activitiesIds: activitiesIds || []
    },
    validate: zodResolver(userSchema),
  });

  const [updateUser] = useUpdateMutation({ refetchQueries: ["User"] })

  const handleUpdateUser = async () => {
    const values = { ...form.values, activitiesIds: selectedActivitiesIds };

    try {
      await updateUser({
        variables: {
          updateUserInput: values
        }
      });
      showNotification({ message: 'Profile updated successfully', color: 'green' });
      setSelectedActivitiesIds([])
      form.reset();
      router.back()
    } catch (error: any) {
      showNotification({ message: error.message ? error.message : 'Error updating your profile', color: 'red' });
    }

  }

  return (
    <Container mt="xl" ta="left" w="100%" >
      <Group align="center" w="100%">
        <BackButton />
        <Box style={{ flex: 1, textAlign: 'center' }}>
          <Title mb="lg">Your Profile</Title>
        </Box>
      </Group>
      <Paper p="md" withBorder shadow="md">
        <form onSubmit={form.onSubmit(handleUpdateUser)}>
          <Stack gap="lg" w="100%">
            <Center >
              <CgProfile size={80} />
            </Center>
            <Box>
              <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}> Name </Text>
              <Text size="sm" c="gray">Your user name.</Text>
              <TextInput mt={10} {...form.getInputProps('name')} required />
              <Group justify="space-between" mt={10} ml={6}>
                <Text
                  size="xs"
                  c={
                    (form.values.name?.length || 0) >
                      USER_MAX_NAME_LENGHT
                      ? 'red'
                      : 'gray'
                  }
                  ta="start"
                  w="100%"
                >
                  {form.values.name?.length || 0} /{' '}
                  {USER_MAX_NAME_LENGHT}
                </Text>
              </Group>
            </Box>
            <Box>
              <Tooltip.Floating label="You can't update your email right now." disabled={false} color="red">
                <Box>
                  <Text fw={BOLD} style={{ fontSize: '1.5rem' }}> Email </Text>
                  <Text size="sm" c="gray">Your email.</Text>
                  <TextInput mt={10} disabled {...form.getInputProps('email')} required />
                </Box>
              </Tooltip.Floating>

            </Box>
            <Box>
              <Text fw={BOLD} style={{ fontSize: '1.5rem' }}> Description </Text>
              <Text size="sm" c="gray">Your description.</Text>
              <TextInput mt={10}{...form.getInputProps('description')} required />
              <Group justify="space-between" mt={10} ml={6}>
                <Text
                  size="xs"
                  c={
                    (form.values.description?.length || 0) >
                      USER_MAX_DESCRIPTION_LENGHT
                      ? 'red'
                      : 'gray'
                  }
                  ta="start"
                  w="100%"
                >
                  {form.values.description?.length || 0} /{' '}
                  {USER_MAX_DESCRIPTION_LENGHT}
                </Text>
              </Group>
            </Box>
            <Box>
              <Text fw={BOLD} style={{ fontSize: '1.5rem' }}> Birth date </Text>
              <Text size="sm" c="gray">Your birthdate.</Text>
              <DatePickerInput mt={10} defaultDate={new Date(user.birthDate)}  {...form.getInputProps('birthDate')} />
            </Box>
            <Box>
              <Text fw={BOLD} style={{ fontSize: '1.5rem' }}>Activities</Text>
              <Text size="sm" c="gray">A selection of your favorite activities.</Text>
              <MultiSelect
                mt={10}
                data={activities.map((
                  activity: { id: any; activityName: any; }) => ({
                    value: activity.id,
                    label: activity.activityName
                  }))}
                value={selectedActivitiesIds}
                placeholder="Select activites your favorite activities"
                onChange={setSelectedActivitiesIds}
                style={{ fontWeight: 700, fontSize: '1.5rem' }}
              />
            </Box>
            <Button variant="filled" type="submit" color={VIAJERO_GREEN} fullWidth mt="md" radius="md">
              Edit Profile
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container >
  )
}