import { ViajeroLogo } from "../components/ViajeroLogo/viajeroLogo";
import { Button, Container, Stack, Text, Title, BackgroundImage, Center, Group, Box, Image } from "@mantine/core";
import { VIAJERO_GREEN } from "../consts/consts";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { BOLD } from "@/consts";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Home() {
  const router = useRouter();

  const { isMobile, isLoading } = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      router.replace({
        pathname: `/login`,
      });
    }
  }, [isMobile]);

  if (isLoading) {
    return <ViajeroLogo />
  }

  return (
    <Stack h="100vh" w="100%">
      <Group justify="space-between" p="md" bg={VIAJERO_GREEN} style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
        <Box ml={100}>
          <ViajeroLogo height={50} width={50} />
        </Box>
        <Button
          mr={100}
          miw={150}
          variant="white"
          color={VIAJERO_GREEN}
          onClick={() => router.push('/login')}
        >
          Get Started
        </Button>
      </Group>
      <Stack mx={200} mt={100}>
        <Group align="center" gap={80} justify="space-between">
          <Stack maw={600} >
            <Title
              order={1}
              size={64}
              fw={BOLD}
              c="black"
              ta="left"
              mb="md"
            >
              Welcome to Viajeros
            </Title>

            <Text
              size="xl"
              c="dimmed"
              ta="left"
              mb="xl"
            >
              Connect with fellow travelers, share experiences, and explore the world together!
            </Text>

            <Button
              size="xl"
              radius="md"
              maw="40%"
              color={VIAJERO_GREEN}
              onClick={() => router.push('/login')}
            >
              Get Started
            </Button>
          </Stack>

          <Box>
            <ViajeroLogo height={300} width={300} />
          </Box>
        </Group>

        <Stack mt={200} gap="xl">
          <Group align="center" justify="space-between" px={100}>
            <Stack maw={500} align="start">
              <Title order={2} size={32} fw={BOLD}>
                Create your next adventure
              </Title>
              <Text size="xl" c="dimmed">
                Plan and organize your travels easily, and invite fellow travelers to join your journey. Set a destination, dates, activities, transports, and more!
              </Text>
            </Stack>
            <Image
              src={"/travel_created.png"}
              alt="Example travel"
              radius="md"
              h={400}
              w={600}
            />
          </Group>

          <Group align="center" wrap="nowrap" justify="space-between" mt={100}>
            <Stack align="start">
              <Title order={2} size={32} fw={BOLD}>
                Manage your travels
              </Title>
              <Text size="xl" c="dimmed">
                Take control of your travel plans. Filter and search through your trips, coordinate with fellow travelers opening the chats and manage everything in one place.
              </Text>
            </Stack>
            <Image
              src="/my_travels.png"
              alt="Example travel"
              radius="md"
              h={500}
              w={10000}
            />
          </Group>

          <Group align="center" wrap="nowrap" justify="space-between" mt={100}>
            <Stack maw={500}>
              <Title order={2} size={32} fw={BOLD}>
                Rate and Review
              </Title>
              <Text size="xl" c="dimmed">
                Share your experiences by rating and reviewing your travels and companions. Help build trust in the community by providing honest feedback!
              </Text>
            </Stack>
            <Image
              src={"/reviews.png"}
              alt="Reviews section"
              radius="md"
              h={700}
              w={1400}
            />
          </Group>

          <Group align="center" wrap="nowrap" justify="space-between" mt={100} >
            <Stack maw={500} align="start">
              <Title order={2} size={32} fw={BOLD}>
                Explore profiles and customize yours.
              </Title>
              <Text size="xl" c="dimmed">
                Make your profile with your own style. Add a description, social networks and showcase your travel preferences.
                You can also explore other traveler's profiles!
              </Text>
            </Stack>
            <Image
              src={"/profile.png"}
              alt="Profile customization"
              radius="md"
              h={1000}
              w={900}
            />
          </Group>
        </Stack>


      </Stack>

    </Stack >
  );
}
