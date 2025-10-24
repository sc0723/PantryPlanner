// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import type { Recipe } from './types/recipe';
// import { TextField, Button, Box, Typography, Select, FormControl, FormGroup, Checkbox, InputLabel, MenuItem, FormControlLabel } from '@mui/material';

// import './App.css'

// function App() {
//     const [recipes, setRecipes] = useState<Recipe[]>([]);
//     const [error, setError] = useState<string | null>(null);
//     const [searchTerm, setSearchTerm] = useState<string>("");
//     const [mealType, setMealType] = useState<string>("");
//     const [health, setHealth] = useState<string[]>([]);
//     const [calories, setCalories] = useState<string>("");
//     const [time, setTime] = useState<string>("");

//     async function performSearch() {
//         if (searchTerm.trim() === "") {
//             setError("Please enter a search query.");
//             return;
//         }
//         try {
//             const response = await axios.get<Recipe[]>('http://localhost:8080/api/v1/recipes/search', { 
//                 params: {
//                     q: searchTerm,
//                     health: health,
//                     mealType: mealType,
//                     calories: calories,
//                     time: time
//                 }
//         });
//             setRecipes(response.data);
//             console.log(response.data);
//         } catch (err) {
//             if (searchTerm.length === 0) {
//                 setError('Please enter a search query.');
//                 return;
//             }
//             setError('Failed to fetch recipes. Please try again later.');
//         }
//     }

//     const handleHealthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const value = event.target.value;
//         const isChecked = event.target.checked;

//         setHealth((prevHealth) => {
//             if (isChecked) {
//                 return [...prevHealth, value];
//             } else {
//                 return prevHealth.filter((item) => item !== value);
//             }
//         });
//     };

//     return (
//         <div>
//             <Box sx={{ padding: '20px' }}>
//                 <Typography variant="h4" component="h1" gutterBottom>
//                     Pantry Planner
//                 </Typography>
//                 <Box sx={{ marginBottom: '20px' }}>
//                     <TextField 
//                         label="Search for any ingredient..." 
//                         variant="outlined" 
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                     <Button 
//                         variant="contained" 
//                         sx={{ marginLeft: '10px', height: '56px' }}
//                         onClick={performSearch}
//                     >
//                     Search
//                     </Button>
                    
//                     <FormControl fullWidth sx={{ marginTop: 2 }}> 
//                         <InputLabel id="meal-type-label">Meal Type</InputLabel>
//                         <Select
//                             labelId="meal-type-label"
//                             id="meal-type-select"
//                             value={mealType} 
//                             label="Meal Type"
//                             onChange={(e) => setMealType(e.target.value)}
//                         >

//                             <MenuItem value="">None</MenuItem>
//                             <MenuItem value="Breakfast">Breakfast</MenuItem>
//                             <MenuItem value="Lunch">Lunch</MenuItem>
//                             <MenuItem value="Dinner">Dinner</MenuItem>
//                             <MenuItem value="Snack">Snack</MenuItem>
//                             <MenuItem value="Teatime">Tea time</MenuItem>
//                         </Select>
//                     </FormControl>
//                     <FormControl component="fieldset" variant="standard" sx={{ marginBottom: 2, width: '100%' }}>
//         <Typography component="legend" sx={{ marginBottom: 1 }}>Diet & Health</Typography>
//         <FormGroup sx={{ 
//             display: 'grid', 
//             gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', // Responsive grid
//             gap: '0 10px'
//         }}>
//             {/* These 'value' strings MUST match the Edamam API docs */}
//             <FormControlLabel 
//                 control={
//                     <Checkbox 
//                         value="vegan" 
//                         checked={health.includes("vegan")} 
//                         onChange={handleHealthChange}
//                     />
//                 } 
//                 label="Vegan" 
//             />
//             <FormControlLabel 
//                 control={
//                     <Checkbox 
//                         value="vegetarian" 
//                         checked={health.includes("vegetarian")}
//                         onChange={handleHealthChange}
//                     />
//                 } 
//                 label="Vegetarian" 
//             />
//             <FormControlLabel 
//                 control={
//                     <Checkbox 
//                         value="low-sugar" 
//                         checked={health.includes("low-sugar")}
//                         onChange={handleHealthChange}
//                     />
//                 } 
//                 label="Low Sugar" 
//             />
//             <FormControlLabel 
//                 control={
//                     <Checkbox 
//                         value="keto-friendly" 
//                         checked={health.includes("keto-friendly")}
//                         onChange={handleHealthChange}
//                     />
//                 } 
//                 label="Keto" 
//             />
//             <FormControlLabel 
//                 control={
//                     <Checkbox 
//                         value="gluten-free" 
//                         checked={health.includes("gluten-free")}
//                         onChange={handleHealthChange}
//                     />
//                 } 
//                 label="Gluten-Free" 
//             />
//         </FormGroup>
//     </FormControl>

//     {/* 3. CALORIES & TIME TEXTFIELDS */}
//     <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
//         <TextField 
//             label="Calories (e.g., 300-500 or 500+)" 
//             variant="outlined"
//             value={calories}
//             onChange={(e) => setCalories(e.target.value)}
//             sx={{ flex: 1 }} // Make fields share space
//         />
//         <TextField 
//             label="Max Time (e.g., 0-30 or 60+)" 
//             variant="outlined"
//             value={time}
//             onChange={(e) => setTime(e.target.value)}
//             sx={{ flex: 1 }} // Make fields share space
//         />
//     </Box>

//                 </Box>
//                 {error && <p style={{ color: 'red' }}>{error}</p>}
//                 <ul>
//                     {recipes.map((recipe, index) => (
//                         <li key={index}>
//                             <img
//                                 src={recipe.images?.SMALL?.url}
//                                 alt={recipe.label}
//                                 width={recipe.images?.SMALL?.width}
//                             />    
//                             {recipe.label} ({Math.round(recipe.calories)} cals)
//                         </li>
//                     ))}
//                 </ul>
//             </Box>
//         </div>
//     );
// }

// export default App
import React, { useState } from 'react';
import axios from 'axios';
import type { Recipe } from './types/recipe';
import { 
  TextField, Button, Box, Typography, Select, FormControl, 
  FormGroup, Checkbox, InputLabel, MenuItem, FormControlLabel,
  Container // --- 1. Import Container
} from '@mui/material';

// We can remove './App.css' if we're letting MUI handle all styles
// import './App.css' 

function App() {
  // ... (all your state variables are perfect)
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [mealType, setMealType] = useState<string>("");
  const [health, setHealth] = useState<string[]>([]);
  const [calories, setCalories] = useState<string>("");
  const [time, setTime] = useState<string>("");

  // ... (your handleHealthChange function is perfect)
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

  // ... (your performSearch function is perfect)
  async function performSearch() {
    if (searchTerm.trim() === "") {
        setError("Please enter a search query.");
        setRecipes([]); // Clear old results
        return;
    }

    setError(null);
    try {
        const response = await axios.get<Recipe[]>(
            'http://localhost:8080/api/v1/recipes/search',
            {
                params: {
                    q: searchTerm,
                    mealType: mealType || undefined, // Send 'undefined' if empty
                    health: health,
                    calories: calories || undefined, // Send 'undefined' if empty
                    time: time || undefined // Send 'undefined' if empty
                }
            }
        );
        
        setRecipes(response.data);
        console.log(response.data);
    } catch (err) {
        console.error("Error fetching recipes:", err);
        setError('Failed to fetch recipes. Please try again later.');
    }
  }

  return (
    // --- 2. Use Container for a nice centered, max-width layout ---
    <Container maxWidth="md" sx={{ paddingY: 4 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
            Pantry Planner
        </Typography>

        {/* --- 3. Search Bar --- */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
            <TextField 
                label="Search for any ingredient..." 
                variant="outlined" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flexGrow: 1 }} // Make field take up space
            />
            <Button 
                variant="contained" 
                sx={{ marginLeft: '10px', height: '56px' }}
                onClick={performSearch}
            >
            Search
            </Button>
        </Box>

        {/* --- 4. Filter Panel (This is the layout fix) --- */}
        <Box sx={{ border: '1px solid #ddd', borderRadius: '8px', padding: 3, backgroundColor: '#fafafa' }}>
            <Typography variant="h6" gutterBottom>Filters</Typography>

            {/* Meal Type */}
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

            {/* Health Checkboxes */}
            <FormControl component="fieldset" variant="standard" sx={{ marginBottom: 2, width: '100%' }}>
                <Typography component="legend" sx={{ marginBottom: 1, fontWeight: 'bold' }}>Diet & Health</Typography>
                <FormGroup sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '0 10px'
                }}>
                    <FormControlLabel control={<Checkbox value="vegan" checked={health.includes("vegan")} onChange={handleHealthChange}/>} label="Vegan" />
                    <FormControlLabel control={<Checkbox value="vegetarian" checked={health.includes("vegetarian")} onChange={handleHealthChange}/>} label="Vegetarian" />
                    <FormControlLabel control={<Checkbox value="low-sugar" checked={health.includes("low-sugar")} onChange={handleHealthChange}/>} label="Low Sugar" />
                    <FormControlLabel control={<Checkbox value="keto-friendly" checked={health.includes("keto-friendly")} onChange={handleHealthChange}/>} label="Keto" />
                    <FormControlLabel control={<Checkbox value="gluten-free" checked={health.includes("gluten-free")} onChange={handleHealthChange}/>} label="Gluten-Free" />
                </FormGroup>
            </FormControl>

            {/* Calories & Time */}
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

        {/* --- 5. Results List --- */}
        {error && <Typography color="error" align="center" sx={{ marginTop: 2 }}>{error}</Typography>}
        
        <Box component="ul" sx={{ listStyleType: 'none', paddingLeft: 0, marginTop: 3 }}>
            {recipes.map((recipe) => (
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
}

export default App