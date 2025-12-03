import React, { useState, useEffect, useLayoutEffect } from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Box, Typography, CircularProgress } from '@mui/material';

import RecipeSearch from './components/RecipeSearch';
import AuthForm from './components/AuthForm';
import RecipeDetail from './components/RecipeDetail';

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RecipeSearch />} />
      <Route path="/recipe/:id" element={<RecipeDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
// function App() {
//   const token = useAuthStore((state) => state.token);
//   // const hasHydrated = useAuthStore((state) => state.hasHydrated);
//   return (
//       <div>
//         {token ? (
//           <RecipeSearch /> 
//         ) : (
//           <AuthForm />
//         )}
//       </div>
//     );
// }

function App() {
    // Get state directly from the store
    const token = useAuthStore((state) => state.token);
    
    // FIX 1: Add a local state variable to track hydration
    const [isHydrated, setIsHydrated] = useState(false);

    // FIX 2: Use useLayoutEffect for immediate subscription before browser paint
    useLayoutEffect(() => {
        // Subscribe to the store's status event
        const unsub = useAuthStore.persist.onFinishHydration(() => {
            // When hydration is finished, set the local state to true
            setIsHydrated(true); 
        });

        // FIX 3: Check if hydration has already finished (in case of fast initial load)
        if (useAuthStore.persist.hasHydrated()) {
             setIsHydrated(true);
        }

        // Cleanup the subscription when the component unmounts
        return () => {
            // Unsubscribe to prevent memory leaks
            if (unsub) unsub();
        };
    }, []); // Run only once on mount

    // 1. Loading Check: Check the local state variable
    if (!isHydrated) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ marginLeft: 2 }}>Loading Session...</Typography>
            </Box>
        );
    }

    // 2. Main Render Logic: Checks authentication and renders the appropriate view
    return (
        // BrowserRouter wraps the entire application
        <BrowserRouter>
            {/* Conditional Rendering: If token exists, render the secure router. 
               Otherwise, show the AuthForm. */}
            {token ? <AuthenticatedRoutes /> : <AuthForm />}
        </BrowserRouter>
    );
}

export default App;