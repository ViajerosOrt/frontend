import { hasLength, isEmail, isInRange, isNotEmpty, useForm } from '@mantine/form';
import { TextInput, PasswordInput, Paper, Title, Container, Button, Stack, Text, Center, Loader } from '@mantine/core';
import { FaPlane, FaLock, FaEnvelope, FaUser } from 'react-icons/fa';
import { ApolloError, gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import router from 'next/router';

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

interface SignupFormProps {
  switchToLogin: () => void;
}

export const SignupForm = ({ switchToLogin }: SignupFormProps) => {
  const [createUser, { loading, error }] = useMutation(CREATE_USER_MUTATION);

  const form = useForm({
    initialValues: {
      userName: '',
      email: '',
      password: '',
      birthDate: '',
    },
    validate: { //isNotEmpty, isEmail, hasLength, isInRange, todas funciones de mantine 
      userName: isNotEmpty('Name is required'),
      email: isEmail('Invalid email'),
      password: hasLength({ min: 8 }, 'Password must be at least 8 characters long'),
      birthDate: isInRange(
        { min: new Date().getFullYear() - 100, max: new Date().getFullYear() - 18 },
        'You must be at least 18 to register'
      ),
    },
  });

  const handleRegisterSubmit = async (values: typeof form.values) => {
    const { userName, email, password, birthDate } = values;

    try {
      const formattedDate = new Date(birthDate).toISOString().split('T')[0];
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

      form.reset();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <Paper withBorder shadow="md" p={30} radius="md" bg="rgba(255, 255, 255, 0.8)" style={{ backgroundColor: '#e1e7f9' }}>
      <Stack align="center" mb={20}>
        <form onSubmit={form.onSubmit(handleRegisterSubmit)}>
          <Stack>
            <TextInput
              required
              label="Name"
              placeholder="Name"
              rightSection={<FaUser size="1rem" />}
              {...form.getInputProps('userName')} //vincula campo con el estado 
              radius="md"
              style={{ color: 'black', borderColor: 'var(--color-lightblue)' }}
              styles={{
                input: {
                  backgroundColor: 'var(--color-lightgreen)',
                  borderColor: 'var(--color-lightblue)'
                },
              }}
            />

            <TextInput
              required
              label="Email"
              placeholder="your@email.com"
              rightSection={<FaEnvelope size="1rem" />}
              {...form.getInputProps('email')}
              radius="md"
              style={{ color: 'black', borderColor: 'var(--color-lightblue)' }}
                        styles={{
                          input: {
                            backgroundColor: 'var(--color-lightgreen)',
                            borderColor: 'var(--color-lightblue)'
                          },
                        }}
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Password"
              rightSection={<FaLock size="1rem" />}
              {...form.getInputProps('password')}
              radius="md"
              style={{ color: 'black', borderColor: 'var(--color-lightblue)' }}
              styles={{
                input: {
                  backgroundColor: 'var(--color-lightgreen)',
                  borderColor: 'var(--color-lightblue)'
                },
              }}
            />

            <TextInput
              required
              label="Date of Birth"
              type="date"
              {...form.getInputProps('birthDate')}
              radius="md"
              style={{ color: 'black', borderColor: 'var(--color-lightblue)' }}
              styles={{
                input: {
                  backgroundColor: 'var(--color-lightgreen)',
                  borderColor: 'var(--color-lightblue)'
                },
              }}
            />

          </Stack>

          <Center mt="md">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader size="sm" /> : 'Register'}
            </Button>
          </Center>

          {error && <Text color="red">{error.message}</Text>}
        </form>
        <Stack align="center" mt="md">
          <Text size="sm" c="dimmed">
            Already have an account?
          </Text>
          <Button
            onClick={switchToLogin}
            style={{
              backgroundColor: 'var(--color-aqua)',
              color: 'black',
              borderColor: 'var(--color-lightblue)',
            }}
          >Back to Login
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};
