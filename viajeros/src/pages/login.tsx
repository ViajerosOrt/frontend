"use client";

import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Stack,
  Text,
  BackgroundImage,
  Center,
  Group,
} from "@mantine/core";
import { FaPlane, FaLock, FaEnvelope, FaUser } from "react-icons/fa";
import { LoginForm } from "@/components/Auth/loginForm";

export default function LoginPage() {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <Container size={420} m="auto" h="100vh">
      <Center h="90%">
        <Paper
          withBorder
          shadow="md"
          p={30}
          radius="md"
          bg="rgba(255, 255, 255, 0.8)"
        >
          <Stack align="center" mb={20}>
            <FaPlane size={48} color="#228be6" />
            <Title order={2} ta="center" fw={600} c="blue">
              Viajeros
            </Title>
            {showSignUp ? ( //evalua la condicion para saber si mostrar el registro o login, en caso de showSignUp true, entonces mostramos registro
              <>
                <Text size="sm" c="dimmed">
                  Crea tu cuenta
                </Text>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setShowSignUp(false);
                  }}
                >
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
                    <Button type="submit" color="blue">
                      Register
                    </Button>
                  </Center>
                </form>
                <Text ta="center" mt="md" size="sm">
                  Ya tienes una cuenta?
                  <Text
                    component="a"
                    href="#"
                    c="blue"
                    onClick={() => setShowSignUp(false)}
                  >
                    Login
                  </Text>
                </Text>
              </>
            ) : (
              <>
                <Text size="sm" c="dimmed">
                  Sign in to your account
                </Text>
                <LoginForm />
                <Text ta="center" mt="md" size="sm">
                  No tienes cuenta?{" "}
                  <Text
                    component="a"
                    href="#"
                    c="blue"
                    onClick={() => setShowSignUp(true)}
                  >
                    Registrate!
                  </Text>
                </Text>
              </>
            )}
          </Stack>
        </Paper>
      </Center>
    </Container>
  );
}
