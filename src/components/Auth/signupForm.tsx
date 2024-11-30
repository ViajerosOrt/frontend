import { hasLength, isEmail, isInRange, isNotEmpty, useForm } from '@mantine/form';
import { TextInput, PasswordInput, Paper, Title, Container, Button, Stack, Text, Center, Loader } from '@mantine/core';
import { FaPlane, FaLock, FaEnvelope, FaUser, FaEyeSlash, FaEye } from 'react-icons/fa';
import { ApolloError, gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import router from 'next/router';
import { useSignupMutation } from '../../graphql/__generated__/gql';
import { ViajeroLoader } from '../ViajeroLoader/ViajeroLoader';
import { Calendar } from '@mantine/dates';
import { VIAJERO_GREEN } from '../../consts/consts';
import React from 'react';
interface SignupFormProps {
  switchToLogin: () => void;
}

export const SignupForm = ({ switchToLogin }: SignupFormProps) => {
  const [signup, { loading, error }] = useSignupMutation()

  const form = useForm({
    initialValues: {
      userName: '',
      email: '',
      password: '',
      birthDate: '',
    },
    validate: { //isNotEmpty, isEmail, hasLength, todas funciones de mantine 
      userName: isNotEmpty('Name is required'),
      email: isEmail('Invalid email'),
      password: hasLength({ min: 8 }, 'Password must be at least 8 characters long'),
      birthDate: (value) => {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();

        return age < 18 ? 'You must be at least 18 yers old to register' : null;
      },
    },
  });

  const handleRegisterSubmit = async (values: typeof form.values) => {
    const { userName, email, password, birthDate } = values;

    try {
      const formattedDate = new Date(birthDate).toISOString().split('T')[0];
      await signup({
        variables: {
          input: {
            name: userName,
            email,
            password,
            birthDate: formattedDate,
          },
        },
      });

      form.reset();
      switchToLogin();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <Stack px={30} bg="rgba(255, 255, 255, 0.8)" style={{ backgroundColor: '#e1e7f9' }} align="center" mb={20}>
      <form onSubmit={form.onSubmit(handleRegisterSubmit)}>
        <Stack>
          <TextInput
            required
            label="Name"
            placeholder="Name"
            rightSection={<FaUser size="1rem" />}
            {...form.getInputProps('userName')} //vincula campo con el estado 
            radius="md"
            style={{ color: 'black', borderColor: '#17a2b8' }}
            styles={{
              input: {
                backgroundColor: '#edf6ee',
                borderColor: '#17a2b8'
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
            style={{ color: 'black', borderColor: '#17a2b8' }}
            styles={{
              input: {
                backgroundColor: '#edf6ee',
                borderColor: '#17a2b8'
              },
            }}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Enter password"
            radius="md"
            styles={{
              input: {
                backgroundColor: '#edf6ee',
              },
            }}
            visibilityToggleIcon={({ reveal }) =>
              reveal ? (
                <FaEyeSlash className="h-4 w-4" />
              ) : (
                <FaEye className="h-4 w-4" />
              )
            }
            {...form.getInputProps('password')}

          />

          <TextInput
            required
            label="Date of Birth"
            type="date"
            {...form.getInputProps('birthDate')}
            radius="md"
            style={{ color: 'black', borderColor: '#17a2b8' }}
            styles={{
              input: {
                backgroundColor: '#edf6ee',
                borderColor: '#17a2b8'
              },
            }}
          />

        </Stack>

        <Center mt={20}>
          <Button type="submit" disabled={loading} color={VIAJERO_GREEN}>
            {loading ? <ViajeroLoader /> : 'Register'}
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
            backgroundColor: VIAJERO_GREEN,
          }}
        >Back to Login
        </Button>
      </Stack>
    </Stack>
  );
};
