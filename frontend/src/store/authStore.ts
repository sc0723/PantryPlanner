import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Decode JWT token safely
const decodeToken = (token: string): { sub?: string; [key: string]: any } | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

interface AuthState {
    token: string | null;
    user: string | null;
    login: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,

            login: (token: string) => {
                const decoded = decodeToken(token);
                const username = decoded?.sub ?? null;
                set({ token, user: username });
            },

            logout: () => set({ token: null, user: null }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => sessionStorage),

            // Ensure `user` is correctly derived from token during hydration
            onRehydrateStorage: () => (state) => {
                if (state?.token) {
                    const decoded = decodeToken(state.token);
                    state.user = decoded?.sub ?? null;
                } else {
                    state.user = null;
                }
                return state;
            },
        }
    )
);

