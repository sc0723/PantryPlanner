import React, { useState, useEffect, useMemo } from 'react';
import {
    Container, Box, Typography, Button, Alert, AppBar, Toolbar, Card, CardMedia, CardContent, CircularProgress
} from '@mui/material';
import { fetchMealPlan } from '../services/mealPlanService';
import { useNavigate } from 'react-router-dom';
import { format, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { useAuthStore } from '../store/authStore';

interface MealEntry {
    id: number;
    userId: number;
    spoonacularRecipeId: number;
    recipeTitle: string;
    imageUrl: string;
    plannedDate: string;
    mealType: string;
}

const MEAL_SLOTS = ['BREAKFAST', 'LUNCH', 'DINNER'];

const groupEntriesByDay = (entries: MealEntry[]) =>
    entries.reduce((acc, entry) => {
        const dateKey = entry.plannedDate;
        const mealKey = entry.mealType.toUpperCase();
        if (!acc[dateKey]) acc[dateKey] = {};
        if (!acc[dateKey][mealKey]) acc[dateKey][mealKey] = [];
        acc[dateKey][mealKey].push(entry);
        return acc;
    }, {} as Record<string, Record<string, MealEntry[]>>);

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

function MealPlanner() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [entries, setEntries] = useState<MealEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const { weekStart, weekEnd } = useMemo(() => ({
        weekStart: startOfWeek(currentDate, { weekStartsOn: 1 }),
        weekEnd: endOfWeek(currentDate, { weekStartsOn: 1 }),
    }), [currentDate]);

    const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
    const groupedEntries = useMemo(() => groupEntriesByDay(entries), [entries]);

    useEffect(() => {
        let isMounted = true;
        const loadMealPlan = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const startStr = format(weekStart, 'yyyy-MM-dd');
                const endStr = format(weekEnd, 'yyyy-MM-dd');
                const data = await fetchMealPlan(startStr, endStr);
                if (isMounted && data) setEntries(data);
            } catch {
                if (isMounted) setError('Failed to load meal plan for the selected week.');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        loadMealPlan();
        return () => { isMounted = false; };
    }, [weekStart, weekEnd]);

    const handlePrevWeek = () => setCurrentDate(prev => addDays(prev, -7));
    const handleNextWeek = () => setCurrentDate(prev => addDays(prev, 7));
    const handleGoToRecipe = (id: number) => navigate(`/recipe/${id}`);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <TopNav />

            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button variant="outlined" onClick={handlePrevWeek}>← Previous Week</Button>
                <Typography variant="h5" fontWeight="600">
                    {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
                </Typography>
                <Button variant="outlined" onClick={handleNextWeek}>Next Week →</Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ overflowX: 'auto', pb: 2 }}>
                    <Box sx={{ minWidth: '1000px' }}>
                        {/* Days Header */}
                        <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: '120px repeat(7, 1fr)',
                            gap: 2,
                            mb: 2
                        }}>
                            <Box /> {/* Empty corner */}
                            {days.map(day => (
                                <Box 
                                    key={day.toISOString()}
                                    sx={{ 
                                        textAlign: 'center',
                                        py: 1,
                                        backgroundColor: '#f5f5f5',
                                        borderRadius: 1
                                    }}
                                >
                                    <Typography fontWeight="600" variant="body1">
                                        {format(day, 'EEE')}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {format(day, 'M/d')}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* Meal Rows */}
                        {MEAL_SLOTS.map(slot => (
                            <Box 
                                key={slot}
                                sx={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: '120px repeat(7, 1fr)',
                                    gap: 2,
                                    mb: 3
                                }}
                            >
                                {/* Meal Type Label */}
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#e3f2fd',
                                    borderRadius: 1,
                                    py: 2
                                }}>
                                    <Typography fontWeight="600" variant="body1">
                                        {slot}
                                    </Typography>
                                </Box>

                                {/* Day Cells */}
                                {days.map(day => {
                                    const dateKey = format(day, 'yyyy-MM-dd');
                                    const meals = groupedEntries[dateKey]?.[slot] || [];
                                    
                                    return (
                                        <Box 
                                            key={dateKey}
                                            sx={{ 
                                                minHeight: '120px',
                                                backgroundColor: '#fafafa',
                                                borderRadius: 1,
                                                p: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1
                                            }}
                                        >
                                            {meals.map(meal => (
                                                <Card
                                                    key={meal.id}
                                                    onClick={() => handleGoToRecipe(meal.spoonacularRecipeId)}
                                                    sx={{
                                                        cursor: 'pointer',
                                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                                        '&:hover': { 
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: 3
                                                        }
                                                    }}
                                                >
                                                    <CardMedia
                                                        component="img"
                                                        height="80"
                                                        image={meal.imageUrl}
                                                        alt={meal.recipeTitle}
                                                        sx={{ objectFit: 'cover' }}
                                                    />
                                                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                                        <Typography 
                                                            variant="body2" 
                                                            sx={{ 
                                                                fontSize: '0.75rem',
                                                                lineHeight: 1.2,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical'
                                                            }}
                                                        >
                                                            {meal.recipeTitle}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Box>
                                    );
                                })}
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
        </Container>
    );
}

export default MealPlanner;

// import React, { useState, useEffect, useMemo } from 'react';
// import {
//     Container, Box, Typography, Button, Alert, AppBar, Toolbar, Card, CardMedia, CardContent, CircularProgress,
//     Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import CloseIcon from '@mui/icons-material/Close';
// import { fetchMealPlan, scheduleMeal } from '../services/mealPlanService';
// import { useNavigate } from 'react-router-dom';
// import { format, startOfWeek, endOfWeek, addDays } from 'date-fns';
// import { useAuthStore } from '../store/authStore';

// interface MealEntry {
//     id: number;
//     userId: number;
//     savedRecipeId: number;
//     recipeTitle: string;
//     imageUrl: string;
//     plannedDate: string;
//     mealType: string;
// }

// const MEAL_SLOTS = ['BREAKFAST', 'LUNCH', 'DINNER'];

// const groupEntriesByDay = (entries: MealEntry[]) =>
//     entries.reduce((acc, entry) => {
//         const dateKey = entry.plannedDate;
//         const mealKey = entry.mealType.toUpperCase();
//         if (!acc[dateKey]) acc[dateKey] = {};
//         if (!acc[dateKey][mealKey]) acc[dateKey][mealKey] = [];
//         acc[dateKey][mealKey].push(entry);
//         return acc;
//     }, {} as Record<string, Record<string, MealEntry[]>>);

// function TopNav() {
//     const navigate = useNavigate();

//     return (
//         <AppBar position="static" sx={{ mb: 4 }}>
//             <Toolbar>
//                 <Typography variant="h6" sx={{ flexGrow: 1 }}>Pantry Planner</Typography>
//                 <Button color="inherit" onClick={() => navigate("/planner")}>Planner</Button>
//                 <Button color="inherit" onClick={() => navigate("/search")}>Search</Button>
//                 <Button color="inherit" onClick={() => {
//                     useAuthStore.getState().logout();
//                     navigate("/auth", { replace: true });
//                 }}>Logout</Button>
//             </Toolbar>
//         </AppBar>
//     );
// }

// function MealPlanner() {
//     const [currentDate, setCurrentDate] = useState(new Date());
//     const [entries, setEntries] = useState<MealEntry[]>([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
//     const [selectedSlot, setSelectedSlot] = useState<{ date: string; mealType: string } | null>(null);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [searchResults, setSearchResults] = useState<any[]>([]);
//     const [isSearching, setIsSearching] = useState(false);
//     const [scheduleSuccess, setScheduleSuccess] = useState<string | null>(null);
//     const navigate = useNavigate();

//     const { weekStart, weekEnd } = useMemo(() => ({
//         weekStart: startOfWeek(currentDate, { weekStartsOn: 1 }),
//         weekEnd: endOfWeek(currentDate, { weekStartsOn: 1 }),
//     }), [currentDate]);

//     const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
//     const groupedEntries = useMemo(() => groupEntriesByDay(entries), [entries]);

//     useEffect(() => {
//         let isMounted = true;
//         const loadMealPlan = async () => {
//             setIsLoading(true);
//             setError(null);
//             try {
//                 const startStr = format(weekStart, 'yyyy-MM-dd');
//                 const endStr = format(weekEnd, 'yyyy-MM-dd');
//                 const data = await fetchMealPlan(startStr, endStr);
//                 if (isMounted && data) setEntries(data);
//             } catch {
//                 if (isMounted) setError('Failed to load meal plan for the selected week.');
//             } finally {
//                 if (isMounted) setIsLoading(false);
//             }
//         };
//         loadMealPlan();
//         return () => { isMounted = false; };
//     }, [weekStart, weekEnd]);

//     const handlePrevWeek = () => setCurrentDate(prev => addDays(prev, -7));
//     const handleNextWeek = () => setCurrentDate(prev => addDays(prev, 7));
//     const handleGoToRecipe = (id: number) => navigate(`/recipe/${id}`);

//     const handleOpenScheduleDialog = (date: string, mealType: string) => {
//         setSelectedSlot({ date, mealType });
//         setScheduleDialogOpen(true);
//         setSearchQuery('');
//         setSearchResults([]);
//     };

//     const handleCloseScheduleDialog = () => {
//         setScheduleDialogOpen(false);
//         setSelectedSlot(null);
//         setSearchQuery('');
//         setSearchResults([]);
//     };

//     const handleSearch = async () => {
//         if (!searchQuery.trim()) return;
        
//         setIsSearching(true);
//         try {
//             // You'll need to import your recipe search function
//             // For now, using a placeholder - replace with your actual search API
//             const response = await fetch(
//                 `https://api.spoonacular.com/recipes/complexSearch?query=${searchQuery}&number=10&apiKey=YOUR_API_KEY`
//             );
//             const data = await response.json();
//             setSearchResults(data.results || []);
//         } catch (err) {
//             console.error('Search failed:', err);
//             setError('Failed to search recipes');
//         } finally {
//             setIsSearching(false);
//         }
//     };

//     const handleScheduleRecipe = async (recipeId: number) => {
//         if (!selectedSlot) return;

//         try {
//             await scheduleMeal(recipeId, selectedSlot.date, selectedSlot.mealType);
            
//             // Refresh meal plan
//             const startStr = format(weekStart, 'yyyy-MM-dd');
//             const endStr = format(weekEnd, 'yyyy-MM-dd');
//             const data = await fetchMealPlan(startStr, endStr);
//             if (data) setEntries(data);
            
//             setScheduleSuccess('Meal scheduled successfully!');
//             setTimeout(() => setScheduleSuccess(null), 3000);
//             handleCloseScheduleDialog();
//         } catch (err) {
//             console.error('Failed to schedule meal:', err);
//             setError('Failed to schedule meal');
//         }
//     };

//     return (
//         <Container maxWidth="xl" sx={{ py: 4 }}>
//             <TopNav />

//             <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Button variant="outlined" onClick={handlePrevWeek}>← Previous Week</Button>
//                 <Typography variant="h5" fontWeight="600">
//                     {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
//                 </Typography>
//                 <Button variant="outlined" onClick={handleNextWeek}>Next Week →</Button>
//             </Box>

//             {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
//             {scheduleSuccess && <Alert severity="success" sx={{ mb: 3 }}>{scheduleSuccess}</Alert>}

//             {isLoading ? (
//                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
//                     <CircularProgress />
//                 </Box>
//             ) : (
//                 <Box sx={{ overflowX: 'auto', pb: 2 }}>
//                     <Box sx={{ minWidth: '1000px' }}>
//                         {/* Days Header */}
//                         <Box sx={{ 
//                             display: 'grid', 
//                             gridTemplateColumns: '120px repeat(7, 1fr)',
//                             gap: 2,
//                             mb: 2
//                         }}>
//                             <Box /> {/* Empty corner */}
//                             {days.map(day => (
//                                 <Box 
//                                     key={day.toISOString()}
//                                     sx={{ 
//                                         textAlign: 'center',
//                                         py: 1,
//                                         backgroundColor: '#f5f5f5',
//                                         borderRadius: 1
//                                     }}
//                                 >
//                                     <Typography fontWeight="600" variant="body1">
//                                         {format(day, 'EEE')}
//                                     </Typography>
//                                     <Typography variant="caption" color="text.secondary">
//                                         {format(day, 'M/d')}
//                                     </Typography>
//                                 </Box>
//                             ))}
//                         </Box>

//                         {/* Meal Rows */}
//                         {MEAL_SLOTS.map(slot => (
//                             <Box 
//                                 key={slot}
//                                 sx={{ 
//                                     display: 'grid', 
//                                     gridTemplateColumns: '120px repeat(7, 1fr)',
//                                     gap: 2,
//                                     mb: 3
//                                 }}
//                             >
//                                 {/* Meal Type Label */}
//                                 <Box sx={{ 
//                                     display: 'flex', 
//                                     alignItems: 'center',
//                                     justifyContent: 'center',
//                                     backgroundColor: '#e3f2fd',
//                                     borderRadius: 1,
//                                     py: 2
//                                 }}>
//                                     <Typography fontWeight="600" variant="body1">
//                                         {slot}
//                                     </Typography>
//                                 </Box>

//                                 {/* Day Cells */}
//                                 {days.map(day => {
//                                     const dateKey = format(day, 'yyyy-MM-dd');
//                                     const meals = groupedEntries[dateKey]?.[slot] || [];
                                    
//                                     return (
//                                         <Box 
//                                             key={dateKey}
//                                             sx={{ 
//                                                 minHeight: '120px',
//                                                 backgroundColor: '#fafafa',
//                                                 borderRadius: 1,
//                                                 p: 1,
//                                                 display: 'flex',
//                                                 flexDirection: 'column',
//                                                 gap: 1,
//                                                 position: 'relative'
//                                             }}
//                                         >
//                                             {meals.length === 0 ? (
//                                                 <Button
//                                                     onClick={() => handleOpenScheduleDialog(dateKey, slot)}
//                                                     sx={{
//                                                         width: '100%',
//                                                         height: '100%',
//                                                         minHeight: '100px',
//                                                         border: '2px dashed #ccc',
//                                                         borderRadius: 1,
//                                                         backgroundColor: 'transparent',
//                                                         '&:hover': {
//                                                             backgroundColor: '#f0f0f0',
//                                                             borderColor: '#999'
//                                                         }
//                                                     }}
//                                                 >
//                                                     <AddIcon sx={{ fontSize: 40, color: '#999' }} />
//                                                 </Button>
//                                             ) : (
//                                                 <>
//                                                     {meals.map(meal => (
//                                                         <Card
//                                                             key={meal.id}
//                                                             onClick={() => handleGoToRecipe(meal.savedRecipeId)}
//                                                             sx={{
//                                                                 cursor: 'pointer',
//                                                                 transition: 'transform 0.2s, box-shadow 0.2s',
//                                                                 '&:hover': { 
//                                                                     transform: 'translateY(-2px)',
//                                                                     boxShadow: 3
//                                                                 }
//                                                             }}
//                                                         >
//                                                             <CardMedia
//                                                                 component="img"
//                                                                 height="80"
//                                                                 image={meal.imageUrl}
//                                                                 alt={meal.recipeTitle}
//                                                                 sx={{ objectFit: 'cover' }}
//                                                             />
//                                                             <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
//                                                                 <Typography 
//                                                                     variant="body2" 
//                                                                     sx={{ 
//                                                                         fontSize: '0.75rem',
//                                                                         lineHeight: 1.2,
//                                                                         overflow: 'hidden',
//                                                                         textOverflow: 'ellipsis',
//                                                                         display: '-webkit-box',
//                                                                         WebkitLineClamp: 2,
//                                                                         WebkitBoxOrient: 'vertical'
//                                                                     }}
//                                                                 >
//                                                                     {meal.recipeTitle}
//                                                                 </Typography>
//                                                             </CardContent>
//                                                         </Card>
//                                                     ))}
//                                                 </>
//                                             )}
//                                         </Box>
//                                     );
//                                 })}
//                             </Box>
//                         ))}
//                     </Box>
//                 </Box>
//             )}

//             {/* Schedule Meal Dialog */}
//             <Dialog 
//                 open={scheduleDialogOpen} 
//                 onClose={handleCloseScheduleDialog}
//                 maxWidth="md"
//                 fullWidth
//             >
//                 <DialogTitle>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                         <Typography variant="h6">
//                             Schedule {selectedSlot?.mealType} for {selectedSlot?.date && format(new Date(selectedSlot.date), 'MMM d, yyyy')}
//                         </Typography>
//                         <IconButton onClick={handleCloseScheduleDialog}>
//                             <CloseIcon />
//                         </IconButton>
//                     </Box>
//                 </DialogTitle>
//                 <DialogContent>
//                     <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
//                         <TextField
//                             fullWidth
//                             placeholder="Search for recipes..."
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//                         />
//                         <Button 
//                             variant="contained" 
//                             onClick={handleSearch}
//                             disabled={isSearching || !searchQuery.trim()}
//                         >
//                             Search
//                         </Button>
//                     </Box>

//                     {isSearching && (
//                         <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//                             <CircularProgress />
//                         </Box>
//                     )}

//                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                         {searchResults.map((recipe) => (
//                             <Card 
//                                 key={recipe.id}
//                                 sx={{ 
//                                     display: 'flex',
//                                     cursor: 'pointer',
//                                     '&:hover': { backgroundColor: '#f5f5f5' }
//                                 }}
//                                 onClick={() => handleScheduleRecipe(recipe.id)}
//                             >
//                                 <CardMedia
//                                     component="img"
//                                     sx={{ width: 120, height: 120, objectFit: 'cover' }}
//                                     image={recipe.image}
//                                     alt={recipe.title}
//                                 />
//                                 <CardContent sx={{ flex: 1 }}>
//                                     <Typography variant="h6" gutterBottom>
//                                         {recipe.title}
//                                     </Typography>
//                                     <Button 
//                                         variant="contained" 
//                                         size="small"
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             handleScheduleRecipe(recipe.id);
//                                         }}
//                                     >
//                                         Add to Plan
//                                     </Button>
//                                 </CardContent>
//                             </Card>
//                         ))}
//                     </Box>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleCloseScheduleDialog}>Cancel</Button>
//                 </DialogActions>
//             </Dialog>
//         </Container>
//     );
// }

// export default MealPlanner;




