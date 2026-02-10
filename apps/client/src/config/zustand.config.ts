import type { UserResponseDTO } from '@fokus/shared';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  user: Omit<UserResponseDTO, 'id'> | null;
  setUser: (user: Omit<UserResponseDTO, 'id'>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
