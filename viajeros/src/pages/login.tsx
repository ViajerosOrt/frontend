'use client'

import { TextInput, PasswordInput, Paper, Title, Container, Button, Stack, Text, BackgroundImage, Center } from '@mantine/core'
import { useRouter } from 'next/router';
import { FaPlane, FaLock, FaEnvelope } from 'react-icons/fa'

export default function LoginPage() {
  const router = useRouter();

  return (
    <BackgroundImage
      src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
      h="100vh"
    >
      <h1>Holaaaaa</h1>
      <Center h="100%">
        <Container size={420} m="auto">
          <Paper withBorder shadow="md" p={30} radius="md" bg="rgba(255, 255, 255, 0.8)">
            <Stack align="center" mb={20}>
              <FaPlane size={48} color="#228be6" />
              <Title order={2} ta="center" fw={600} c="blue">
                Viajeros
              </Title>
              <Text size="sm" c="dimmed">Sign in to your account</Text>
            </Stack>
            <form onSubmit={(e) => {
              router.push("/viajes")
              e.preventDefault()
            }}>
              <Stack>
                <TextInput
                  required
                  label="Email"
                  placeholder="your@email.com"
                  rightSection={<FaEnvelope size="1rem" />}
                  radius="md"
                />

                <PasswordInput
                  required
                  label="Password"
                  placeholder="Your password"
                  rightSection={<FaLock size="1rem" />}
                  radius="md"
                />
              </Stack>

              <Button type="submit" fullWidth mt="xl" color="blue">
                Sign in
              </Button>
            </form>
            <Text ta="center" mt="md" size="sm">
              Don&apos;t have an account?{' '}
              <Text component="a" href="#" c="blue">
                Sign up
              </Text>
            </Text>
          </Paper>
        </Container>
      </Center>
    </BackgroundImage >
  )
}