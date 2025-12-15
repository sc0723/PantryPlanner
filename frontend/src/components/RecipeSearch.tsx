import React, { useState } from 'react';
import api from "../services/api";
import type { ComplexSearchResponse, Recipe } from '../types/recipe';
import {
    TextField, Button, Box, Typography, Select, FormControl,
    FormGroup, Checkbox, InputLabel, MenuItem, FormControlLabel,
    Container, CircularProgress, AppBar, Toolbar
} from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

function TopNav() {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    return (
        <AppBar position="static" sx={{ mb: 3 }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>Pantry Planner</Typography>
                <Button color="inherit" onClick={() => navigate("/planner")}>Planner</Button>
                <Button color="inherit" onClick={() => navigate("/search")}>Search</Button>
                <Button color="inherit" onClick={() => navigate("/saved")}>Saved Recipes</Button>
                <Button color="inherit" onClick={() => { logout(); navigate("/auth", { replace: true }); }}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
}

function RecipeSearch() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [mealType, setMealType] = useState<string>("");
    const [health, setHealth] = useState<string[]>([]);
    const [calories, setCalories] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    const handleHealthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const isChecked = event.target.checked;
        setHealth(prev => isChecked ? [...prev, value] : prev.filter(item => item !== value));
    };

    async function performSearch() {
        if (searchTerm.trim() === "") {
            setError("Please enter a search query.");
            setRecipes([]);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get<ComplexSearchResponse>('/api/v1/recipes/search', {
                params: {
                    query: searchTerm,
                    health: health.length > 0 ? health : undefined,
                    mealType: mealType || undefined,
                    calories: calories || undefined,
                    time: time || undefined
                }
            });
            setRecipes(response.data.results);
            if (response.data.results.length === 0) setError("No recipes found. Try different filters!");
        } catch (err) {
            console.error(err);
            setError("Failed to fetch recipes. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <TopNav />

            <Typography variant="h5" gutterBottom>Welcome, {user || "User"}!</Typography>

            {/* Search Input */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    label="Search for ingredients..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1 }}
                />
                <Button
                    variant="contained"
                    onClick={performSearch}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress size={24} /> : "Search"}
                </Button>
            </Box>

            {/* Filters */}
            <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 3, backgroundColor: '#fafafa', mb: 3 }}>
                <Typography variant="h6" gutterBottom>Filters</Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="meal-type-label">Meal Type</InputLabel>
                    <Select
                        labelId="meal-type-label"
                        value={mealType}
                        label="Meal Type"
                        onChange={(e) => setMealType(e.target.value)}
                    >
                        <MenuItem value="">Any</MenuItem>
                        <MenuItem value="breakfast">Breakfast</MenuItem>
                        <MenuItem value="main course">Lunch/Dinner</MenuItem>
                        <MenuItem value="appetizer">Appetizer</MenuItem>
                        <MenuItem value="dessert">Dessert</MenuItem>
                        <MenuItem value="drink">Drink</MenuItem>
                        <MenuItem value="salad">Salad</MenuItem>
                    </Select>
                </FormControl>

                <FormControl component="fieldset" variant="standard" sx={{ mb: 2, width: '100%' }}>
                    <Typography component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>Diet</Typography>
                    <FormGroup sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0 10px' }}>
                        <FormControlLabel control={<Checkbox value="vegan" checked={health.includes("vegan")} onChange={handleHealthChange} />} label="Vegan" />
                        <FormControlLabel control={<Checkbox value="vegetarian" checked={health.includes("vegetarian")} onChange={handleHealthChange} />} label="Vegetarian" />
                        <FormControlLabel control={<Checkbox value="ketogenic" checked={health.includes("ketogenic")} onChange={handleHealthChange} />} label="Keto" />
                        <FormControlLabel control={<Checkbox value="gluten-free" checked={health.includes("gluten-free")} onChange={handleHealthChange} />} label="Gluten Free" />
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

            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

            {/* Recipes List */}
            <Box component="ul" sx={{ listStyleType: 'none', p: 0, mt: 3 }}>
                {!isLoading && recipes.map(recipe => (
                    <Box
                        component="li"
                        key={recipe.id}
                        onClick={() => navigate(`/recipe/${recipe.id}`)}
                        sx={{ display: 'flex', alignItems: 'center', mb: 2, borderBottom: '1px solid #eee', pb: 2, cursor: 'pointer' }}
                    >
                        <img src={recipe.image} alt={recipe.title} width={100} height={100} style={{ borderRadius: 8, marginRight: 15 }} />
                        <Box>
                            <Typography variant="h6">{recipe.title}</Typography>
                            <Typography variant="body2" color="textSecondary">{recipe.readyInMinutes} mins | Servings: {recipe.servings} | Score: {Math.round(recipe.healthScore)}</Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Container>
    );
}

export default RecipeSearch;

