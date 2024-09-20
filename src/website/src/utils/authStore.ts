// authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task } from '@/types/types';
interface AuthState {
    accessToken: string | null;
    tasks: any[];
    setAccessToken: (token: string) => void;
    setTasks: (tasks: any[]) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            tasks: [],
            setAccessToken: (token: string) => set(() => ({ accessToken: token })),
            setTasks: (tasks: any[]) => set(() => ({ tasks })),
            clearAuth: () => set(() => ({ accessToken: null, tasks: [] }))
        }),
        {
            name: 'auth-store',
        }
    )
);
