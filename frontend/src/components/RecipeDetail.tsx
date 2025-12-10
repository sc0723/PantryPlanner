import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button,
    CircularProgress, Grid, Paper, List, ListItem, ListItemText,
    Alert
} from '@mui/material';
import api from '../services/api';
import type { RecipeDetail, Ingredient, InstructionStep, Nutrient } from '../types/recipe';
import { saveRecipe } from '../services/mealPlanService';

const renderSummary = (htmlString: string) => {
    return (
        <Typography
            variant="body1"
            component="div"
            sx={{
                '& b': { fontWeight: 'bold' },
                '& a': { color: 'primary.main', textDecoration: 'underline' }
            }}
            dangerouslySetInnerHTML={{ __html: htmlString }}
        />
    );
};

const InstructionsDisplay = ({ instructions }: { instructions: any[] }) => {
    if (!instructions || instructions.length === 0) {
        return (
            <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic', mt: 2 }}>
                Instructions not analyzed by Spoonacular. Please check the source link.
            </Typography>
        );
    }

    const steps: InstructionStep[] = instructions.flatMap((instr: any) => instr.steps || []);

    if (steps.length === 0) {
        return (
            <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic', mt: 2 }}>
                Instructions not analyzed by Spoonacular. Please check the source link.
            </Typography>
        );
    }

    return (
        <List disablePadding>
            {steps.map((step) => (
                <ListItem
                    key={step.number}
                    sx={{ alignItems: 'flex-start', paddingX: 0, paddingY: 1 }}
                >
                    <ListItemText
                        primary={<Typography variant="subtitle2">Step {step.number}</Typography>}
                        secondary={step.step}
                    />
                </ListItem>
            ))}
        </List>
    );
};

function RecipeDetail() {
    const { id } = useParams<{ id: string }>();
    const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSaveRecipe = async () => {
        if (!recipe) return; // Prevent action if recipe data is missing

        setIsSaving(true);
        setSaveError(null);
        try {
            // Call the service function, passing the full recipe object
            const savedItem = await saveRecipe(recipe);

            // Check if the returned object has an ID (meaning it was saved or already existed)
            if (savedItem && savedItem.id) {
                setIsSaved(true);
            }
        } catch (error) {
            setSaveError(error instanceof Error ? error.message : "An unexpected error occurred during save.");
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        if (!id) {
            setError("Recipe ID is missing.");
            setIsLoading(false);
            return;
        }

        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await api.get<RecipeDetail>(`/api/v1/recipes/${id}`);
                setRecipe(response.data);
            } catch (err) {
                console.error("Error fetching recipe details:", err);
                setError("Could not load recipe details. It may be a private or restricted recipe.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading Recipe Details...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Alert severity="error">{error}</Alert>
                <Button sx={{ mt: 2 }} onClick={() => navigate(-1)}>Go Back</Button>
            </Container>
        );
    }

    if (!recipe) {
        return (
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Alert severity="warning">Recipe details could not be found.</Alert>
                <Button sx={{ mt: 2 }} onClick={() => navigate(-1)}>Go Back</Button>
            </Container>
        );
    }

    const totalTime = (recipe.preparationMinutes || 0) + (recipe.cookingMinutes || 0);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button onClick={() => navigate(-1)} variant="outlined" sx={{ mb: 3 }}>
                ← Back to Planner
            </Button>

            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                {recipe.title}
            </Typography>

            {/* ---------- MAIN GRID (MUI v7 syntax) ---------- */}
            <Grid container spacing={4} columns={12}>

                {/* LEFT COLUMN */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2 }}>
                        <img
                            src={recipe.image}
                            alt={recipe.title}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Summary</Typography>
                            {renderSummary(recipe.summary)}
                        </Box>
                    </Paper>

                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            href={recipe.sourceUrl}
                            target="_blank"
                            rel="noopener"
                        >
                            View Original Instructions
                        </Button>
                        <Button
                            variant="outlined"
                            color={isSaved ? "success" : "secondary"} // Green if saved
                            onClick={handleSaveRecipe}
                            disabled={isSaving || isSaved}
                        >
                            {isSaving ? <CircularProgress size={24} /> : (isSaved ? 'Recipe Saved!' : 'Save to Planner')}
                        </Button>
                    </Box>
                </Grid>

                {/* RIGHT COLUMN */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                        <Typography variant="h5" gutterBottom>Details</Typography>

                        <Grid container spacing={1} columns={12}>
                            <Grid size={{ xs: 6 }}><Typography variant="subtitle1">Time:</Typography></Grid>
                            <Grid size={{ xs: 6 }}><Typography>{totalTime > 0 ? `${totalTime} minutes` : 'Quick'}</Typography></Grid>

                            <Grid size={{ xs: 6 }}><Typography variant="subtitle1">Prep Time:</Typography></Grid>
                            <Grid size={{ xs: 6 }}><Typography>{recipe.preparationMinutes} min</Typography></Grid>

                            <Grid size={{ xs: 6 }}><Typography variant="subtitle1">Cook Time:</Typography></Grid>
                            <Grid size={{ xs: 6 }}><Typography>{recipe.cookingMinutes} min</Typography></Grid>

                            <Grid size={{ xs: 6 }}><Typography variant="subtitle1">Servings:</Typography></Grid>
                            <Grid size={{ xs: 6 }}><Typography>{recipe.servings}</Typography></Grid>

                            <Grid size={{ xs: 6 }}><Typography variant="subtitle1">Health Score:</Typography></Grid>
                            <Grid size={{ xs: 6 }}><Typography>{Math.round(recipe.healthScore || 0)}</Typography></Grid>
                        </Grid>
                    </Paper>

                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Ingredients ({recipe.extendedIngredients.length})
                        </Typography>
                        <List dense disablePadding>
                            {recipe.extendedIngredients.map((ing: Ingredient) => (
                                <ListItem key={ing.id} sx={{ px: 0 }}>
                                    <ListItemText primary={ing.original || ing.name} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* INSTRUCTIONS */}
                <Grid size={{ xs: 12 }}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h4" gutterBottom>Preparation Steps</Typography>
                        <InstructionsDisplay instructions={recipe.analyzedInstructions} />
                    </Paper>
                </Grid>
            </Grid>

            {/* NUTRITION FACTS */}
            <Grid container spacing={2} sx={{ mt: 4 }} columns={12}>
                {recipe.nutrients && recipe.nutrients.slice(0, 8).map((nutrient: Nutrient) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={nutrient.name}>
                        <Paper
                            variant="outlined"
                            sx={{ p: 2, textAlign: 'center', height: '100%', backgroundColor: '#f5f5f5' }}
                        >
                            <Typography variant="h6" color="primary.main">
                                {Math.round(nutrient.amount)} {nutrient.unit}
                            </Typography>
                            <Typography variant="body2">{nutrient.name}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default RecipeDetail;
