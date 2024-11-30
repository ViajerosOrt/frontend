import { UserEditForm } from "@/components/User/UserEditForm";
import { ViajeroEmptyMessage } from "@/components/ViajeroEmptyMessage/viajeroEmptyMessage";
import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { useUserByIdQuery } from "@/graphql/__generated__/gql";
import { useAuth } from "@/hooks/useAth";

export default function Profile() {
  const { currentUser } = useAuth()

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
    <UserEditForm user={user} />
  );
}
