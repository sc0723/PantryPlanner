import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';


const decodeToken = (token: string): { sub?: string; [key: string]: any } | null => {
    try {
        // Split the token into parts (header, payload, signature)
        const base64Url = token.split('.')[1];
        // Replace Base64Url characters with Base64 characters
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        // Decode the Base64 string and parse it as JSON
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Failed to decode JWT token:", error);
        return null; // Return null if decoding fails
    }
};


interface AuthState {
    token: string | null; // Stores the JWT token
    user: string | null;  // Stores the username extracted from the token
}


interface AuthActions {
    login: (token: string) => void; // Function to set the token and user
    logout: () => void;            // Function to clear the token and user
}


export const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            
            login: (token) => {
                const decoded = decodeToken(token);
                const username = decoded?.sub || null; 

                set({ token: token, user: username });
                console.log("User logged in:", username); // For debugging
            },

            logout: () => {
                set({ token: null, user: null });
                console.log("User logged out"); 
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({ token: state.token }),
        }
    )
);