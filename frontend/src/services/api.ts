import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.warn('Unauthorized request. Token might be expired. Logging out.');
            
            useAuthStore.getState().logout();

        }
        return Promise.reject(error);
    }
);


export default api;