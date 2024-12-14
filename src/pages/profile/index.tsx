import { VIAJERO_GREEN } from "@/consts";
import { useAuth } from "@/hooks/useAth";
import {
  Button,
  Container,
} from "@mantine/core";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import { ProfileDetails } from "@/components/ProfileDetails/ProfileDetails";

export default function Profile() {
  const { currentUser } = useAuth()
  return (
    <Container mt="xl" ta="left" w="100%" >
      <Button
        component={Link}
        href="/profile/editProfile"
        my="md"
        size="md"
        radius="md"
        color={VIAJERO_GREEN}
        rightSection={<CgProfile />}
      >
        Edit Profile
      </Button>
      <ProfileDetails userId={currentUser?.id || ''} />
    </Container >
  )
}


