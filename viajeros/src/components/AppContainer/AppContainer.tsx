import { AppShell, Box, Burger, Button, Center, Group, Image, Modal, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ViajerosNavbar } from "./ViajerosNavbar";
import { useCallback } from "react";
import { useAuth } from "@/hooks/useAth";
import { useRouter } from "next/router";
import { IoMdExit } from "react-icons/io";
import { showNotification } from '@mantine/notifications';
import { CgProfile } from "react-icons/cg";
import { ViajeroLogo } from "../ViajeroLogo/viajeroLogo";

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
      zIndex: 2077
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
            <Group align="center" justify="center">
              <CgProfile />
              <Text> {currentUser?.email}</Text>
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md" bg="#65a773">
          <ViajerosNavbar closeSidebar={closeSidebar} />
          <Box mt="auto" mr="auto">
            <Button
              fullWidth
              color="black"
              variant="transparent"
              onClick={handleLogout}
              mt="auto"
              mb={30}
              leftSection={
                <IoMdExit size="" />
              }
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
