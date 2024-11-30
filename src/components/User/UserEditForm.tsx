import { useForm, zodResolver } from "@mantine/form";
import { BackButton } from "@/components/BackButton/BackButton";
import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { VIAJERO_GREEN } from "@/consts";
import { User, useUserByIdQuery } from "@/graphql/__generated__/gql";
import { useAuth } from "@/hooks/useAth";
import {
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import { CgProfile } from "react-icons/cg";
import { z } from "zod";
import { useState } from "react";
import { DatePicker } from "@mantine/dates";

type UserEditFormProps = {
  user: Partial<User>
}

const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
});

export const UserEditForm = ({ user }: UserEditFormProps) => {
  const form = useForm({
    initialValues: {
      name: user.name,
      email: user.email,
      description: user.description || '',
      birthDate: new Date(user.birthDate),
    },
    validate: zodResolver(userSchema),
  });

  console.log(user)
  return (
    <Container mt="xl" ta="left" w="100%" >
      <Group align="center" w="100%">
        <BackButton />
        <Box style={{ flex: 1, textAlign: 'center' }}>
          <Title mb="lg">Your Profile</Title>
        </Box>
      </Group>
      <Paper p="md" withBorder shadow="md">
        <Stack gap="lg" w="100%">
          <Center >
            <CgProfile size={80} />
          </Center>
          <Box>
            <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}> Name  </Text>
            <Text size="sm" c="gray">Your user name.</Text>
            <TextInput {...form.getInputProps('name')} required />
          </Box>
          <Box>
            <Tooltip.Floating label="You can't update your email right now." disabled={false} color="red">
              <Box>
                <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}> Email  </Text>
                <Text size="sm" c="gray">Your email.</Text>
                <TextInput disabled {...form.getInputProps('email')} required />
              </Box>
            </Tooltip.Floating>

          </Box>
          <Box>
            <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}> Description </Text>
            <Text size="sm" c="gray">Your description.</Text>
            <TextInput {...form.getInputProps('description')} required />
          </Box>
          <Box>
            <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}> Birth date </Text>
            <Text size="sm" c="gray">Your birthdate.</Text>
            <DatePicker defaultDate={new Date(user.birthDate)}  {...form.getInputProps('birthDate')} />
          </Box>
          <Group>
            <Text fw={500}>
              {user?.reviewsCreated ? `${user?.reviewsCreated} Reviews` : 'No reviews yet'}
            </Text>
          </Group>
          <Button variant="filled" color={VIAJERO_GREEN} fullWidth mt="md" radius="md" onClick={() => null}>
            Edit Profile
          </Button>
        </Stack>
      </Paper>
    </Container >
  )
}