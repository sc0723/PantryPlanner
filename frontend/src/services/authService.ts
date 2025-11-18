import axios from "axios";
import api from "./api"

export async function registerUser(username: string, password: string) {
    const body = {
        "username": username,
        "password": password
    };

    try {
        const response = await api.post('/api/auth/register', body);
        const token = response.data;
        return token;
    } catch (error) {
        console.error("Registration failed: ", error)
        if (axios.isAxiosError(error) && error.response?.status === 400) {
            throw new Error("Username is already taken");
        }
        
        throw new Error("Registration failed. Please try again later.");
    }

}

export async function loginUser(username: string, password: string) {
    const body = {
        "username": username,
        "password": password
    };

    try {
        const response = await api.post('/api/auth/login', body);
        const token = response.data;
        return token;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
             throw new Error("Invalid username or password");
        }
        throw new Error("Login failed. Please try again later.");
    }
}