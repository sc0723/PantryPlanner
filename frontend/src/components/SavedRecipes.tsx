import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Card, CardMedia, CardContent, CardActions,
    Button, Grid, CircularProgress, Alert, AppBar, Toolbar, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useAuthStore } from '../store/authStore';
import { scheduleMeal } from '../services/mealPlanService';
import { format } from 'date-fns';
import api from '../services/api';
import type { SavedRecipe } from '../types/recipe';

// interface SavedRecipe {
//     id: number;
//     spoonacularRecipeId: number;
//     recipeTitle: string;
//     imageUrl: string;
//     savedAt: string;
// }

function TopNav() {
    const navigate = useNavigate();

    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>Pantry Planner</Typography>
                <Button color="inherit" onClick={() => navigate("/planner")}>Planner</Button>
                <Button color="inherit" onClick={() => navigate("/search")}>Search</Button>
                <Button color="inherit" onClick={() => navigate("/saved")}>Saved Recipes</Button>
                <Button color="inherit" onClick={() => {
                    useAuthStore.getState().logout();
                    navigate("/auth", { replace: true });
                }}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
}

function SavedRecipes() {
    const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<SavedRecipe | null>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedMealType, setSelectedMealType] = useState('LUNCH');
    const [isScheduling, setIsScheduling] = useState(false);
    const [scheduleSuccess, setScheduleSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSavedRecipes();
    }, []);

    const fetchSavedRecipes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/v1/plan/recipes/saved');
            setRecipes(response.data);
        } catch (err) {
            console.error('Error fetching saved recipes:', err);
            setError('Failed to load saved recipes');
        } finally {
            setIsLoading(false);
        }
    }

    const handleDeleteRecipe = async (id: number) => {
        try {
            const response = await api.delete(`/api/v1/plan/recipes/${id}`);
            console.log(response.data)
            setRecipes(recipes.filter(r => r.id !== id));
        } catch (err) {
            console.error('Error deleting recipe:', err);
            setError('Failed to delete recipe');
        }
    };

    const handleOpenScheduleDialog = (recipe: SavedRecipe) => {
        setSelectedRecipe(recipe);
        setScheduleDialogOpen(true);
        setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
        setScheduleSuccess(null);
    };

    const handleCloseScheduleDialog = () => {
        setScheduleDialogOpen(false);
        setSelectedRecipe(null);
        setSelectedDate('');
        setSelectedMealType('LUNCH');
    };

    const handleScheduleMeal = async () => {
        if (!selectedRecipe || !selectedDate) return;

        setIsScheduling(true);
        try {
            await scheduleMeal(selectedRecipe.recipeId, selectedDate, selectedMealType);
            setScheduleSuccess('Meal scheduled successfully!');
            setTimeout(() => {
                handleCloseScheduleDialog();
                setScheduleSuccess(null);
            }, 1500);
        } catch (err) {
            console.error('Failed to schedule meal:', err);
            setError('Failed to schedule meal');
        } finally {
            setIsScheduling(false);
        }
    };

    const handleViewRecipe = (recipeId: number) => {
        navigate(`/recipe/${recipeId}`);
    };

    if (isLoading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <TopNav />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <TopNav />

            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                My Saved Recipes
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {scheduleSuccess && <Alert severity="success" sx={{ mb: 3 }}>{scheduleSuccess}</Alert>}

            {recipes.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No saved recipes yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Start exploring recipes and save your favorites!
                    </Typography>
                    <Button variant="contained" onClick={() => navigate('/search')}>
                        Search Recipes
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {recipes.map((recipe) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={recipe.imageUrl}
                                    alt={recipe.recipeTitle}
                                    sx={{ 
                                        objectFit: 'cover',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleViewRecipe(recipe.recipeId)}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography 
                                        variant="h6" 
                                        gutterBottom
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': { color: 'primary.main' },
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical'
                                        }}
                                        onClick={() => handleViewRecipe(recipe.recipeId)}
                                    >
                                        {recipe.recipeTitle}
                                    </Typography>
                                    {/* <Typography variant="caption" color="text.secondary">
                                        Saved {new Date(recipe.savedAt).toLocaleDateString()}
                                    </Typography> */}
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                    <Button 
                                        size="small" 
                                        variant="contained"
                                        onClick={() => handleOpenScheduleDialog(recipe)}
                                    >
                                        Schedule
                                    </Button>
                                    <IconButton 
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteRecipe(recipe.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Schedule Meal Dialog */}
            <Dialog 
                open={scheduleDialogOpen} 
                onClose={handleCloseScheduleDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Schedule Meal</Typography>
                        <IconButton onClick={handleCloseScheduleDialog}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {scheduleSuccess ? (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {scheduleSuccess}
                        </Alert>
                    ) : (
                        <>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Schedule "{selectedRecipe?.recipeTitle}" for a specific date and meal time
                            </Typography>
                            
                            <TextField
                                fullWidth
                                label="Date"
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                sx={{ mb: 2 }}
                                InputLabelProps={{ shrink: true }}
                            />
                            
                            <TextField
                                fullWidth
                                select
                                label="Meal Type"
                                value={selectedMealType}
                                onChange={(e) => setSelectedMealType(e.target.value)}
                            >
                                <MenuItem value="BREAKFAST">Breakfast</MenuItem>
                                <MenuItem value="LUNCH">Lunch</MenuItem>
                                <MenuItem value="DINNER">Dinner</MenuItem>
                            </TextField>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseScheduleDialog}>Cancel</Button>
                    {!scheduleSuccess && (
                        <Button 
                            onClick={handleScheduleMeal}
                            variant="contained"
                            disabled={isScheduling || !selectedDate}
                        >
                            {isScheduling ? <CircularProgress size={24} /> : 'Schedule'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default SavedRecipes;