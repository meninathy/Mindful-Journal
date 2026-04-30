import { create } from 'zustand'
import type { LocalUser } from '../lib/localData'

interface AuthState {
  user: LocalUser | null
  loading: boolean
  setUser: (user: LocalUser | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}))
