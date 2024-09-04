'use client'

import { useState } from 'react';
import { TextInput, PasswordInput, Paper, Title, Container, Button, Stack, Text, BackgroundImage, Center, Group } from '@mantine/core';
import { useRouter } from 'next/router';
import { FaPlane, FaLock, FaEnvelope, FaUser } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <BackgroundImage
      src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
      h="100vh"
    >
      <Center h="100%">
        <Container size={420} m="auto">
          <Paper withBorder shadow="md" p={30} radius="md" bg="rgba(255, 255, 255, 0.8)">
            <Stack align="center" mb={20}>
              <FaPlane size={48} color="#228be6" />
              <Title order={2} ta="center" fw={600} c="blue">
                Viajeros
              </Title>
              {showSignUp ? ( //evalua la condicion para saber si mostrar el registro o login, en caso de showSignUp true, entonces mostramos registro
                <>
                  <Text size="sm" c="dimmed">Crea tu cuenta</Text>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    setShowSignUp(false);
                  }}>
                    <Stack>
                      <TextInput
                        required
                        label="Nombre"
                        placeholder="Nombre"
                        rightSection={<FaUser size="1rem" />}
                        radius="md"
                      />

                      <TextInput
                        required
                        label="Email"
                        placeholder="tu@email.com"
                        rightSection={<FaEnvelope size="1rem" />}
                        radius="md"
                      />

                      <PasswordInput
                        required
                        label="Contraseña"
                        placeholder="Contraseña"
                        rightSection={<FaLock size="1rem" />}
                        radius="md"
                      />

                      <TextInput
                        required
                        label="Fecha de Nacimiento"
                        placeholder="YYYY-MM-DD"
                        type="date"
                        radius="md"
                      />
                    </Stack>

                    <Center mt="md"> 
                      <Button type="submit" color="blue">Register</Button>
                    </Center>
                  </form>
                  <Text ta="center" mt="md" size="sm">
                    Ya tienes una cuenta? 
                    <Text component="a" href="#" c="blue" onClick={() => setShowSignUp(false)}> 
                      Login
                    </Text>
                  </Text>
                </>
              ) : (
                <>
                  <Text size="sm" c="dimmed">Sign in to your account</Text>
                  <form onSubmit={(e) => {
                    router.push("/viajes"); // Cuando el formulario se envia (le damos en login, vamos a la pagina de viajes)
                    e.preventDefault();
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
                    No tienes cuenta?{' '}
                    <Text component="a" href="#" c="blue" onClick={() => setShowSignUp(true)}>
                      Registrate!
                    </Text>
                  </Text>
                </>
              )}
            </Stack>
          </Paper>
        </Container>
      </Center>
    </BackgroundImage>
  );
}
