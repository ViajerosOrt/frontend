import useAuthStore, { UserState } from "@/stores/useAuthStore"
import { useCallback, useMemo } from "react"
import { notifications } from '@mantine/notifications';
import { useShallow } from 'zustand/shallow';

export const useAuth = () => {
  const { currentUser, onLogin, onLogout, setLoading, isLoadingUser } = useAuthStore(
    useShallow(
      (state) => ({
        currentUser: state.currentUser,
        onLogin: state.onLogin,
        onLogout: state.onLogout,
        setLoading: state.setLoading,
        isLoadingUser: state.isLoadingUser
      }))

  )

  const handleLogin = useCallback(
    ({ newUser }: { newUser: UserState }) => {
      onLogin(newUser)
      notifications.show({
        message: `Signed in with ${newUser.email}`,
        autoClose: 2000,
      })
    },
    [onLogin]
  )

  const handleLogout = useCallback(
    (userId: number | undefined) => {

      if (!!userId) {
        onLogout(userId)
        notifications.show({
          message: `Signed out`,
          autoClose: 2000,
        })
      }
    },
    [onLogout]
  )

  return {
    currentUser,
    onLogin: handleLogin,
    onLogout: handleLogout,
    setLoading,
    isLoadingUser
  }
}