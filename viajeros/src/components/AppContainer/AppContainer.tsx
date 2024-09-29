import { AppShell, Box, Burger, Button, Center, Group, Modal, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ViajerosNavbar } from "./ViajerosNavbar";
import { useCallback } from "react";
import { useAuth } from "@/hooks/useAth";
import { useRouter } from "next/router";
import { LogoutModal } from "./LogoutModal";

export const AppContainer = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle, close }] = useDisclosure();
  const { currentUser, onLogout } = useAuth()
  const router = useRouter();

  const closeSidebar = useCallback(() => {
    close();
  }, [close]);

  const handleLogout = () => {
    onLogout(currentUser?.id)
    router.push("/");
  }

  const [logoutModalOpened, { close: closeLogoutModal, open: openLogoutModal }] = useDisclosure(false);


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
          <Stack gap={0}>
            <Group justify="space-between" px="md" py={8}>
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="md"
                size="md"
                color={"white"}
              />
              <Box visibleFrom="md">Viajero logo!</Box>
            </Group>
          </Stack>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <ViajerosNavbar closeSidebar={closeSidebar} />
          <Button
            fullWidth
            color="red"
            variant="outline"
            onClick={() => openLogoutModal()}
            mt="auto"
            mb={30}
          >
            Logout
          </Button>
        </AppShell.Navbar>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>

      <LogoutModal handleLogout={handleLogout}
        logoutModalOpened={logoutModalOpened}
        closeLogoutModal={closeLogoutModal}
        openLogoutModal={openLogoutModal}
      />
    </>

  );
};
