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
  Box,
} from "@mantine/core";
import { FaPlane, FaLock, FaEnvelope, FaUser } from "react-icons/fa";
import { LoginForm } from "@/components/Auth/loginForm";
import { SignupForm } from "@/components/Auth/signupForm";
import { ViajeroLogo } from "@/components/ViajeroLogo/viajeroLogo";
import { VIAJERO_GREEN } from "@/consts";

export default function LoginPage() {
  const [showSignUp, setShowSignUp] = useState(false);

  const switchToLogin = () => {
    setShowSignUp(false);
  };

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
            <Title order={2} ta="center" fw={600} c={VIAJERO_GREEN}>
              Viajeros
            </Title>
            <ViajeroLogo height={100} width={100} />

            {showSignUp ? (
              <SignupForm switchToLogin={switchToLogin} />
            ) : (
              <>
                <LoginForm />
                <Text ta="center" mt="md" size="sm" c="dimmed">
                  Dont have an account?{" "}
                </Text>
                <Box>
                  <Button
                    onClick={() => setShowSignUp(true)}
                    style={{
                      backgroundColor: VIAJERO_GREEN,
                    }}
                  >
                    Register!
                  </Button>
                </Box>
              </>
            )}
          </Stack>
        </Paper>
      </Center>
    </Container>
  );
}
