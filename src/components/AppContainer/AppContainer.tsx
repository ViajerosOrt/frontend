import { AppShell, Avatar, Box, Burger, Button, Center, Group, Image, Modal, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ViajerosNavbar } from "./ViajerosNavbar";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAth";
import { useRouter } from "next/router";
import { IoMdExit } from "react-icons/io";
import { showNotification } from '@mantine/notifications';
import { CgProfile } from "react-icons/cg";
import { ViajeroLogo } from "../ViajeroLogo/viajeroLogo";
import { VIAJERO_GREEN, ANIMATIONS, VIAJERO_GREEN_DARK } from "../../consts/consts";
import React from "react";
import PlaneAnimation from "../Animations/PlaneAnimation";

export const AppContainer = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle, close }] = useDisclosure();
  const { currentUser, onLogout } = useAuth()
  const router = useRouter();

  const closeSidebar = useCallback(() => {
    close();
  }, [close]);

  const handleLogout = () => {
    onLogout(currentUser?.id)
    showNotification({
      title: 'Signed out',
      message: 'Your user was signed out',
      color: "green",
      zindex: 2077
    })
    router.push("/");
  }

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 225,
          breakpoint: "md",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group justify="space-between" px="md" py={8} align="center" h="100%">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="md"
              size="md"
            />
            <ViajeroLogo />

            <Group align="center" justify="center" >
              <PlaneAnimation />
              <Avatar
                size={80}
                src={`https://robohash.org/${currentUser?.name}`}
                radius="xl"
                style={{ animation: ANIMATIONS.moving, verticalAlign: "middle", marginTop: -35, marginRight: 40 }}
              />
              <Text size="xl" fw={900} style={{ marginLeft: -60, marginTop: 25, animation: ANIMATIONS.breathing, }} >
                {currentUser?.name}
              </Text>
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md" bg={VIAJERO_GREEN}>
          <ViajerosNavbar closeSidebar={closeSidebar} />
          <Box mt="auto" mr="auto">
            <Button
              fullWidth
              color={VIAJERO_GREEN_DARK}
              variant="filled"
              onClick={handleLogout}
              mt="auto"
              mb={30}
              leftSection={
                <IoMdExit size="" />
              }
              style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 8,
                border: '3px solid #4e8e5a',
              }}
            >
              Logout
            </Button>
          </Box>
        </AppShell.Navbar>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell >
    </>
  );
};
