import { useLoginMutation } from "@/graphql/__generated__/gql";
import { useForm, zodResolver } from "@mantine/form";
import { Button, Checkbox, Group, PasswordInput, Stack, TextInput } from '@mantine/core';
import { z } from 'zod'
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useAuth } from "@/hooks/useAth";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { VIAJERO_GREEN } from "@/consts";
2
const loginFormValidation = z.object({
  email: z.string().min(1).max(40).refine((val) => val.includes('@'), {
    message: 'Invalid Email',
  }),
  password: z.string().min(1).max(40),
})

export const LoginForm = () => {
  const [login] = useLoginMutation()
  const router = useRouter();

  const { currentUser, onLogin } = useAuth()

  const form = useForm<{
    email: string;
    password: string;
  }>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(loginFormValidation)
  });

  const handleLogin = useCallback(
    async function handleLoginCallback({
      email,
      password,
    }: {
      email: string
      password: string
    }) {
      if (email === currentUser?.email) {
        form.setErrors({
          email: ' ',
          password: 'Already logged in',
        })
        return
      }
      try {
        const { data } = await login({ variables: { input: { email, password } } })
        if (!data?.login.user || !data?.login.user?.id) {
          throw new Error('No user returned')
        }

        const { accessToken, user } = data.login

        if (!accessToken) {
          throw new Error('No access token returned')
        }

        if (data?.login.user && data.login.user.id) {
          // If we have an access token, we store the user and JWT info in the store
          onLogin({
            newUser: {
              id: user.id,
              email: user.email,
              accessToken: accessToken
            }
          })
          router.push("/travels");
        } else {
          form.setErrors({
            email: ' ',
            password: 'Invalid email or password',
          })
        }

      } catch (error) {
        if (error instanceof Error) {
          form.setErrors({
            email: ' ',
            password: error.message,
          })
        } else {
          form.setErrors({
            email: ' ',
            password: 'Wrong email or password',
          })
        }
      }
    }, [form, login, router])

  return (
    <form onSubmit={form.onSubmit((values) => handleLogin(values))}>
      <Stack gap={12}>
        <TextInput
          required
          label="Enter your email"
          placeholder="your@email.com"
          rightSection={<FaEnvelope size="1rem" />}
          radius="md"
          {...form.getInputProps('email')}
          styles={{
            input: {
              backgroundColor: '#edf6ee',
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

        <Button id="submit" type="submit" fullWidth mt="md" color={VIAJERO_GREEN}>
          Login
        </Button>
      </Stack>
    </form>
  );
};
