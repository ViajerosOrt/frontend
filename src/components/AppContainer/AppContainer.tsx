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
import { useIsMobile } from "@/hooks/useIsMobile";

export const AppContainer = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle, close }] = useDisclosure();
  const { currentUser, onLogout } = useAuth()
  const router = useRouter();
  const { isMobile } = useIsMobile();

  const closeSidebar = useCallback(() => {
    close();
  }, [close]);

  const navigateToProfile = () => {
    router.push("/profile");
  };

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

  const UserProfile = () => (
    <Group align="center" gap="xs" onClick={isMobile ? navigateToProfile : undefined} style={isMobile ? { cursor: 'pointer' } : undefined}>
      <Avatar
        size={isMobile ? 40 : 50}
        src={currentUser?.userImage}
        radius="xl"
      />
      <Text
        size={isMobile ? "md" : "xl"}
        fw={900}
        style={{
          animation: ANIMATIONS.breathing,
        }}
      >
        {currentUser?.name}
      </Text>
    </Group>
  );

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
            <Group>
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="md"
                size="md"
              />
              {!isMobile && <ViajeroLogo />}
            </Group>

            <Group>
              <PlaneAnimation />
              {isMobile ? (
                <UserProfile />
              ) : (
                <Group align="center" justify="center">
                  <UserProfile />
                </Group>
              )}
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
              leftSection={<IoMdExit />}
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

        <AppShell.Main px={isMobile ? 0 : undefined} >{children}</AppShell.Main>
      </AppShell>
    </>
  );
};