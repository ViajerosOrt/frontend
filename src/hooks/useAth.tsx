import useAuthStore, { UserState } from "@/stores/useAuthStore"
import { useCallback, useMemo } from "react"
import { notifications } from '@mantine/notifications';
import { useShallow } from 'zustand/shallow';

export const useAuth = () => {
  const { currentUser, onLogin, onLogout } = useAuthStore(
    useShallow(
      (state) => ({
        currentUser: state.currentUser,
        onLogin: state.onLogin,
        onLogout: state.onLogout,
      }))

  )

  const handleLogin = useCallback(
    ({ newUser }: { newUser: UserState }) => {
      onLogin(newUser)
      notifications.show({
        message: `Signed as as ${newUser.email}`,
        color: "green",
        autoClose: 2000,
      })
    },
    [onLogin]
  )

  const handleLogout = useCallback(
    (userId: string | undefined) => {

      if (!!userId) {
        onLogout(userId)
      }
    },
    [onLogout]
  )

  return {
    currentUser,
    onLogin: handleLogin,
    onLogout: handleLogout,
  }
}