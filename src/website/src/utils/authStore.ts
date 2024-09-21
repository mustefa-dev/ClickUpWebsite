// authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
            accessToken: localStorage.getItem('accessToken'),
            tasks: [],
            setAccessToken: (token: string) => {
                localStorage.setItem('accessToken', token);
                set(() => ({ accessToken: token }));
            },
            setTasks: (tasks: any[]) => set(() => ({ tasks })),
            clearAuth: () => {
                localStorage.removeItem('accessToken');
                set(() => ({ accessToken: null, tasks: [] }));
            }
        }),
        {
            name: 'auth-store',
        }
    )
);