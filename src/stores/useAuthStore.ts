import { AccessToken } from '@/graphql/__generated__/gql'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface UserState {
  id: string
  accessToken: AccessToken | undefined | null
  email: string
}

type AuthStoreState = {
  currentUser: UserState | null

}

type AuthStoreActions = {
  onLogin: (newUser: UserState) => void
  onLogout: (userId: string) => void

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
      onLogout: (userId: string) =>
        set((state: AuthStoreState) => {
          return {
            currentUser: null,
          }
        })
    }),
    {
      name: 'viajeros-user',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useAuthStore