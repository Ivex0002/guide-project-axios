import { create } from 'zustand'

interface StoreAccessToken {
  accessToken: string | null
  tokenLoading: boolean
  setAccessToken: (token: string) => void
  clearAccessToken: () => void
  setTokenLoading: (loading: boolean) => void
}
export const storeAccessToken = create<StoreAccessToken>((set) => ({
  accessToken: null,
  tokenLoading: true,
  setAccessToken: (token) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: null }),
  setTokenLoading: (loading) => set({ tokenLoading: loading }),
}))
