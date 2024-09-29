import { AccessToken } from '@/graphql/__generated__/gql'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface UserState {
  id: number
  accessToken: AccessToken | undefined | null
  email: string
}

type AuthStoreState = {
  currentUser: UserState | null
  isLoadingUser: boolean;

}

type AuthStoreActions = {
  onLogin: (newUser: UserState) => void
  onLogout: (userId: number) => void
  setLoading: (loading: boolean) => void

}

type AuthStore = AuthStoreState & AuthStoreActions


export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      currentUser: null,
      isLoadingUser: false,
      onLogin: (newUser: UserState) =>
        set((state: AuthStoreState) => {
          return {
            currentUser: newUser
          }
        }),
      onLogout: (userId: number) =>
        set((state: AuthStoreState) => {
          return {
            currentUser: null,
          }
        }),
      setLoading: (loading) => set({ isLoadingUser: loading }),
    }),
    {
      name: 'viajeros-user',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useAuthStore
