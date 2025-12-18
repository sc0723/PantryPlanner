import React, { useState, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useAuthStore } from './store/authStore';

import AuthForm from './components/AuthForm';
import MealPlanner from './components/MealPlanner';
import RecipeDetail from './components/RecipeDetail';
import RecipeSearch from './components/RecipeSearch';
import SavedRecipes from './components/SavedRecipes';
import GroceryList from './components/GroceryList';

function App() {
    const token = useAuthStore((state) => state.token);
    const [isHydrated, setIsHydrated] = useState(false);

    useLayoutEffect(() => {
        const unsub = useAuthStore.persist.onFinishHydration(() => setIsHydrated(true));
        if (useAuthStore.persist.hasHydrated()) setIsHydrated(true);
        return () => unsub && unsub();
    }, []);

    if (!isHydrated) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading Session...</Typography>
        </Box>
    );

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth" element={<AuthForm />} />
                <Route
                    path="/planner"
                    element={token ? <MealPlanner key={token} /> : <Navigate to="/auth" replace />}
                />
                <Route
                    path="/recipe/:id"
                    element={token ? <RecipeDetail key={token} /> : <Navigate to="/auth" replace />}
                />
                <Route path="*" element={<Navigate to={token ? "/planner" : "/auth"} replace />} />

                 <Route
                    path="/search"
                    element={token ? <RecipeSearch key={token} /> : <Navigate to="/auth" replace />}
                />
                <Route
                    path="/search"
                    element={token ? <RecipeSearch key={token} /> : <Navigate to="/auth" replace />}
                />
                <Route
                    path="/saved"
                    element={token ? <SavedRecipes key={token} /> : <Navigate to="/auth" replace />}
                />
                <Route
                    path="/grocery-list"
                    element={token ? <GroceryList key={token} /> : <Navigate to="/auth" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

