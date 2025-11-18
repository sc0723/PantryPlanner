import React, { useState } from 'react';
import api from "../services/api"
import type { Recipe } from '../types/recipe';
import {
    TextField, Button, Box, Typography, Select, FormControl,
    FormGroup, Checkbox, InputLabel, MenuItem, FormControlLabel,
    Container, CircularProgress
} from '@mui/material';
import { useAuthStore } from '../store/authStore';

function RecipeSearch() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [mealType, setMealType] = useState<string>("");
    const [health, setHealth] = useState<string[]>([]);
    const [calories, setCalories] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);

    const handleHealthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        setHealth((prevHealth) => {
            if (isChecked) {
                return [...prevHealth, value];
            } else {
                return prevHealth.filter((item) => item !== value);
            }
        });
    };

    async function performSearch() {
        if (searchTerm.trim() === "") {
            setError("Please enter a search query.");
            setRecipes([]);
            return;
        }

        setError(null);
        try {
            const response = await api.get<Recipe[]>(
                '/api/v1/recipes/search',
                {
                    params: {
                        q: searchTerm,
                        mealType: mealType || undefined,
                        health: health,
                        calories: calories || undefined,
                        time: time || undefined
                    }
                }
            );

            setRecipes(response.data);
            if (response.data.length === 0) {
                setError("No recipes found. Try different filters!");
            }
            console.log(response.data);
        } catch (err) {
            console.error("Error fetching recipes:", err);
            setError('Failed to fetch recipes. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Container maxWidth="md" sx={{ paddingY: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="h6">
                    Welcome, {user || 'User'}!
                </Typography>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={logout} // Call the logout action from the store
                >
                    Logout
                </Button>
            </Box>
            <Typography variant="h3" component="h1" align="center" gutterBottom>
                Pantry Planner
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                <TextField
                    label="Search for any ingredient..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1 }}
                />
                <Button
                    variant="contained"
                    sx={{ marginLeft: '10px', height: '56px' }}
                    onClick={performSearch}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Search'}
                </Button>
            </Box>

            <Box sx={{ border: '1px solid #ddd', borderRadius: '8px', padding: 3, backgroundColor: '#fafafa' }}>
                <Typography variant="h6" gutterBottom>Filters</Typography>

                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel id="meal-type-label">Meal Type</InputLabel>
                    <Select
                        labelId="meal-type-label"
                        value={mealType}
                        label="Meal Type"
                        onChange={(e) => setMealType(e.target.value)}
                    >
                        <MenuItem value="">Any</MenuItem>
                        <MenuItem value="Breakfast">Breakfast</MenuItem>
                        <MenuItem value="Lunch">Lunch</MenuItem>
                        <MenuItem value="Dinner">Dinner</MenuItem>
                        <MenuItem value="Snack">Snack</MenuItem>
                        <MenuItem value="Teatime">Tea time</MenuItem>
                    </Select>
                </FormControl>

                <FormControl component="fieldset" variant="standard" sx={{ marginBottom: 2, width: '100%' }}>
                    <Typography component="legend" sx={{ marginBottom: 1, fontWeight: 'bold' }}>Diet & Health</Typography>
                    <FormGroup sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                        gap: '0 10px'
                    }}>
                        <FormControlLabel control={<Checkbox value="vegan" checked={health.includes("vegan")} onChange={handleHealthChange} />} label="Vegan" />
                        <FormControlLabel control={<Checkbox value="vegetarian" checked={health.includes("vegetarian")} onChange={handleHealthChange} />} label="Vegetarian" />
                        <FormControlLabel control={<Checkbox value="low-sugar" checked={health.includes("low-sugar")} onChange={handleHealthChange} />} label="Low Sugar" />
                        <FormControlLabel control={<Checkbox value="keto-friendly" checked={health.includes("keto-friendly")} onChange={handleHealthChange} />} label="Keto" />
                        <FormControlLabel control={<Checkbox value="gluten-free" checked={health.includes("gluten-free")} onChange={handleHealthChange} />} label="Gluten-Free" />
                    </FormGroup>
                </FormControl>

                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                    <TextField
                        label="Calories (e.g., 300-500)"
                        variant="outlined"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        label="Max Time (e.g., 0-30)"
                        variant="outlined"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        sx={{ flex: 1 }}
                    />
                </Box>
            </Box>

            {error && <Typography color="error" align="center" sx={{ marginTop: 2 }}>{error}</Typography>}
            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginY: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            <Box component="ul" sx={{ listStyleType: 'none', paddingLeft: 0, marginTop: 3 }}>
                {!isLoading && recipes.map((recipe) => (
                    <Box component="li" key={recipe.label} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, borderBottom: '1px solid #eee', paddingBottom: 2 }}>
                        <img
                            src={recipe.images?.SMALL?.url}
                            alt={recipe.label}
                            width={100}
                            height={100}
                            style={{ borderRadius: '8px', marginRight: '15px' }}
                        />
                        <Box>
                            <Typography variant="h6">{recipe.label}</Typography>
                            <Typography variant="body2" color="textSecondary">{Math.round(recipe.calories)} cals | {recipe.totalTime > 0 ? `${recipe.totalTime} min` : 'Quick'}</Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Container>
    );
};


export default RecipeSearch;