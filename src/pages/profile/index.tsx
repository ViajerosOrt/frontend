import { VIAJERO_GREEN } from "@/consts";
import { useAuth } from "@/hooks/useAth";
import {
  Button,
  Container,
} from "@mantine/core";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import { ProfileDetails } from "@/components/ProfileDetails/ProfileDetails";
import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { useUserByIdQuery } from "@/graphql/__generated__/gql";
import { useRouter } from "next/router";
import { ViajeroEmptyMessage } from "@/components/ViajeroEmptyMessage/viajeroEmptyMessage";

export default function Profile() {
  const { currentUser } = useAuth()

  const router = useRouter();
  const { data, loading } = useUserByIdQuery({
    variables: { userByIdId: currentUser?.id || '' },
    skip: !!!currentUser?.id
  })

  const user = data?.userById

  if (loading) {
    return <ViajeroLoader />
  }

  if (!user) {
    return <ViajeroEmptyMessage message="There was a problem retrieving your user data" />
  }

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


