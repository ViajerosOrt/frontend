import { Button, Center, Group, Modal, Stack, Text, Title } from "@mantine/core";

type LogoutModalProps = {
  handleLogout: () => void,
  logoutModalOpened: boolean,
  closeLogoutModal: () => void,
  openLogoutModal: () => void
}

export const LogoutModal = ({ handleLogout, logoutModalOpened, closeLogoutModal, openLogoutModal }: LogoutModalProps) => {
  return (
    <Modal opened={logoutModalOpened} onClose={closeLogoutModal} size="md" withCloseButton={false}>
      <Center>
        <Stack gap="md" align="center">
          <Title size="md" >
            Are you sure you want to log out?
          </Title>

          <Group mt="lg">
            <Button
              variant="default"
              onClick={closeLogoutModal}
              size="md"
            >
              Cancel
            </Button>
            <Button
              color="red"
              variant="outline"
              onClick={handleLogout}
              size="md"
            >
              Log out
            </Button>
          </Group>
        </Stack>
      </Center>
    </Modal>
  )
}