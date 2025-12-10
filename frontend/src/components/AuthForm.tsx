import React, { useState } from 'react';
import {
    TextField, Button, Box, Typography, Alert
} from '@mui/material';
import { loginUser, registerUser } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

function AuthForm() {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    async function handleLogin() {
        setError(null);
        try {
            const token: string = await loginUser(username, password);
            
            useAuthStore.getState().login(token);
            console.log("Store after login:", useAuthStore.getState());
            navigate('/planner', { replace: true });
        } catch (error) {
            setError("Login failed. Please check your credentials.")
        };
    };

    async function handleRegister() {
        setError(null);
        try {
            const token: string = await registerUser(username, password);
            
            useAuthStore.getState().login(token);
            navigate('/planner', { replace: true })
        } catch (error) {
            setError("Registration failed. Username might be taken.")
        };
    };

    return (
        <Box 
            sx={{ 
                maxWidth: '400px', // Limit width for a nice form look
                margin: 'auto',    // Center the box horizontally
                padding: 4,        // Add padding
                display: 'flex',   // Use flexbox...
                flexDirection: 'column', // ...to stack items vertically
                alignItems: 'center', // Center items horizontally within the box
                gap: 2 // Add spacing between direct children (Title, Fields, Alert, Button Box)
            }}
        >
            <Typography variant='h4' component="h1" gutterBottom> 
                Login or Register
            </Typography>
            
            <TextField
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth // Make field take full width of container
                required  // Good practice: mark required fields
            />
            <TextField
                label="Password"
                type="password" // Hide password input
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth // Make field take full width
                required
            />
            
            {error && (
                <Alert severity="error" sx={{ width: '100%' }}> 
                    {error}
                </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, width: '100%' }}>
                <Button
                    variant="contained"
                    onClick={handleLogin}
                    sx={{ flexGrow: 1 }} // Make buttons share space
                >
                    Login
                </Button>
                <Button
                    variant="outlined" // Use outlined for secondary action
                    onClick={handleRegister}
                    sx={{ flexGrow: 1 }} // Make buttons share space
                >
                    Register
                </Button>
            </Box>
        </Box>
    );
};

export default AuthForm;