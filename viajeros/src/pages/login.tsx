'use client'

import { useState } from 'react';
import { TextInput, PasswordInput, Paper, Title, Container, Button, Stack, Text, BackgroundImage, Center } from '@mantine/core';
import { useRouter } from 'next/router';
import { FaPlane, FaLock, FaEnvelope, FaUser } from 'react-icons/fa';
import { ApolloError, gql, useMutation } from '@apollo/client';
import { Loader } from '@mantine/core';

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id
      userName
      email
      password
      birth_date
    }
  }
`;

export default function LoginPage() {
  const router = useRouter();
  const [showSignUp, setShowSignUp] = useState(false);
  const [warning, setWarning] = useState('');

  // Guardamos en variables los datos del registro
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const [createUser, { loading, error }] = useMutation(CREATE_USER_MUTATION); // Usamos la mutación de Apollo Client

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWarning('');

    //Validaciones FRONT
    if (password.length < 8) {
      setWarning('Password must contain more than 8 characters.');
      return;
    }

    const birthDateObj = new Date(birthDate);
    const age = new Date().getFullYear() - birthDateObj.getFullYear();
    if (age < 18) {
      setWarning('You must be more than 18 years old to register.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setWarning('Email must be valid (example: you@gmail.com).');
      return;
    }
    // Fin validaciones FRONT, comienza creacion de usuario (paso las validaciones)

    try {
      const formattedDate = new Date(birthDate).toISOString().split('T')[0];
      const userData = {
        userName,
        email,
        password,
        birth_date: formattedDate,
      };

      console.log("Datos:", userData);

      await createUser({
        variables: {
          createUserInput: {
            userName,
            email,
            password,
            birth_date: formattedDate,
          },
        },
      });
      setShowSignUp(false);

      //limpiamos datos despues del registro
      setUserName('');
      setEmail('');
      setPassword('');
      setBirthDate('');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <BackgroundImage
      src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
      h="100vh"
    >
      <Center h="100%">
        <Container size={420} m="auto">
          <Paper withBorder shadow="md" p={30} radius="md" bg="rgba(255, 255, 255, 0.8)" style={{ backgroundColor: '#e1e7f9' }}>
            <Stack align="center" mb={20}>
              <FaPlane size={48} color="#228be6" />
              <Title order={2} ta="center" fw={600} c="blue">
                Viajeros
              </Title>
              {showSignUp ? ( //evalua la condicion para saber si mostrar el registro o login, en caso de showSignUp true, entonces mostramos registro
                <>
                  <Text size="sm" c="dimmed">Create your account!</Text>
                  <form onSubmit={handleRegisterSubmit}> { }
                    <Stack>
                      <TextInput
                        required
                        label="Name"
                        placeholder="Name"
                        rightSection={<FaUser size="1rem" />}
                        style={{
                          color: 'black', borderColor: 'var(--color-lightblue)'
                        }}
                        styles={{
                          input: {
                            backgroundColor: 'var(--color-lightgreen)',
                            borderColor: 'var(--color-lightblue)'
                          },
                        }}
                        radius="md"
                        value={userName} // Vinculamos el estado con el input
                        onChange={(e) => setUserName(e.target.value)} // Actualizamos el estado al escribir
                      />

                      <TextInput
                        required
                        label="Email"
                        placeholder="your@email.com"
                        rightSection={<FaEnvelope size="1rem" />}
                        style={{ color: 'black', borderColor: 'var(--color-lightblue)' }}
                        styles={{
                          input: {
                            backgroundColor: 'var(--color-lightgreen)',
                            borderColor: 'var(--color-lightblue)'
                          },
                        }}
                        radius="md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />

                      <PasswordInput
                        required
                        label="Password"
                        placeholder="Password"
                        rightSection={<FaLock size="1rem" />}
                        style={{ color: 'black', borderColor: 'var(--color-lightblue)' }}
                        styles={{
                          input: {
                            backgroundColor: 'var(--color-lightgreen)',
                            borderColor: 'var(--color-lightblue)'
                          },
                        }}
                        radius="md"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />

                      <TextInput
                        required
                        label="Date of Birth"
                        placeholder="YYYY-MM-DD"
                        style={{ color: 'black', borderColor: 'var(--color-lightblue)' }}
                        styles={{
                          input: {
                            backgroundColor: 'var(--color-lightgreen)',
                            borderColor: 'var(--color-lightblue)'
                          },
                        }}
                        type="date"
                        radius="md"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                      />
                      {warning && <Text color="red">{warning}</Text>} { }
                    </Stack>

                    <Center mt="md">
                      <Button type="submit"
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-green)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-blue)'}
                        disabled={loading}> { }
                        {loading ? <Loader size="sm" /> : 'Register'}
                      </Button>
                    </Center>

                    {error && <Text color="red">{error.message}</Text>} { }
                  </form>
                  <Stack align="center" mt="md">
                    <Text size="sm" c="dimmed">
                      Already have an account?
                    </Text>
                    <Button
                      variant="outline"
                      onClick={() => setShowSignUp(false)}
                      style={{
                        backgroundColor: 'var(--color-aqua)',
                        color: 'black',
                        borderColor: 'var(--color-lightblue)',
                      }}
                    >
                      Login
                    </Button>
                  </Stack>
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
                        style={{ color: 'black', borderColor: 'var(--color-lightblue)' }}
                        styles={{
                          input: {
                            backgroundColor: 'var(--color-lightgreen)',
                            borderColor: 'var(--color-lightblue)'
                          },
                        }}
                        placeholder="your@email.com"
                        rightSection={<FaEnvelope size="1rem" />}
                        radius="md"
                      />

                      <PasswordInput
                        required
                        label="Password"
                        placeholder="Your password"
                        style={{ color: 'black', borderColor: 'var(--color-lightblue)' }}
                        styles={{
                          input: {
                            backgroundColor: 'var(--color-lightgreen)',
                            borderColor: 'var(--color-lightblue)'
                          },
                        }}
                        rightSection={<FaLock size="1rem" />}
                        radius="md"
                      />
                    </Stack>

                    <Button type="submit" fullWidth mt="xl"
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-green)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-blue)'}>
                      Sign in
                    </Button>
                  </form>
                  <Stack align="center" mt="md">
                    <Text size="sm" c="dimmed">
                      Don't have an account?
                    </Text>
                    <Button
                      variant="outline"
                      onClick={() => setShowSignUp(true)}
                      style={{
                        backgroundColor: 'var(--color-aqua)',
                        color: 'black',
                        borderColor: 'var(--color-lightblue)'
                      }}
                    >
                      Register!
                    </Button>
                  </Stack>
                </>
              )}
            </Stack>
          </Paper>
        </Container>
      </Center>
    </BackgroundImage>
  );
}
