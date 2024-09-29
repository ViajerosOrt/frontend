import { AppShell, Box, Burger, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ViajerosNavbar } from "./ViajerosNavbar";
import { useCallback } from "react";

export const AppContainer = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle, close }] = useDisclosure();

  const closeSidebar = useCallback(() => {
    close();
  }, [close]);

  return (
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
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
