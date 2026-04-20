import { create } from 'zustand';
interface UserState { userId: string | null; role: string | null; setUser: (id: string, role: string) => void; clearUser: () => void; }
export const useUserStore = create<UserState>((set) => ({
  userId: null, role: null,
  setUser: (userId, role) => set({ userId, role }),
  clearUser: () => set({ userId: null, role: null }),
}));
