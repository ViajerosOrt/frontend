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
import { SignupForm } from "@/components/Auth/signupForm";

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
            <FaPlane size={48} color="#228be6" />
            <Title order={2} ta="center" fw={600} c="blue">
              Viajeros
            </Title>
            {showSignUp ? (
              <SignupForm switchToLogin={switchToLogin} />
            ) : (
              <>
                <Text size="sm" c="dimmed">
                  Sign in to your account
                </Text>
                <LoginForm />
                <Text ta="center" mt="md" size="sm" c="dimmed">
                  Dont have an account?{" "}
                </Text>
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <Button
                      onClick={() => setShowSignUp(true)}
                      style={{
                        backgroundColor: '#76aaa4',
                        color: 'black',
                        borderColor: '#17a2b8',
                      }}
                    >
                      Register!
                    </Button>
                  </div>
              </>
            )}
          </Stack>
        </Paper>
      </Center>
    </Container>
  );
}
