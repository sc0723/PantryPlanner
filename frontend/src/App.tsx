import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { Recipe } from './types/recipe';
import { TextField, Button, Box, Typography } from '@mui/material';

import './App.css'

function App() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const []

    async function performSearch() {
        if (searchTerm.trim() === "") {
            setError("Please enter a search query.");
            return;
        }
        try {
            const response = await axios.get<Recipe[]>(`http://localhost:8080/api/v1/recipes/search?q=${searchTerm}`);
            setRecipes(response.data);
            console.log(response.data);
        } catch (err) {
            if (searchTerm.length === 0) {
                setError('Please enter a search query.');
                return;
            }
            setError('Failed to fetch recipes. Please try again later.');
        }
    }

    return (
        <div>
            <Box sx={{ padding: '20px' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Pantry Planner
                </Typography>
                <Box sx={{ marginBottom: '20px' }}>
                    <TextField 
                        label="Search for any ingredient..." 
                        variant="outlined" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button 
                        variant="contained" 
                        sx={{ marginLeft: '10px', height: '56px' }}
                        onClick={performSearch}
                    >
                    Search
                    </Button>
                </Box>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <ul>
                    {recipes.map((recipe, index) => (
                        <li key={index}>
                            <img
                                src={recipe.images?.SMALL?.url}
                                alt={recipe.label}
                                width={recipe.images?.SMALL?.width}
                            />    
                            {recipe.label} ({Math.round(recipe.calories)} cals)
                        </li>
                    ))}
                </ul>
            </Box>
        </div>
    );
}

export default App
