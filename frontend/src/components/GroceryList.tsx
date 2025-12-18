import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button, AppBar, Toolbar,
    CircularProgress, Alert, Paper, List, ListItem, ListItemText,
    ListItemIcon, Checkbox, IconButton, Divider
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';
import api from '../services/api';

interface GroceryItemDTO {
    name: string;
    amount: number;
    unit: string;
}

interface GroceryListResponseDTO {
    startDate: string;
    endDate: string;
    items: GroceryItemDTO[];
}

function TopNav() {
    const navigate = useNavigate();

    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>Pantry Planner</Typography>
                <Button color="inherit" onClick={() => navigate("/planner")}>Planner</Button>
                <Button color="inherit" onClick={() => navigate("/search")}>Search</Button>
                <Button color="inherit" onClick={() => navigate("/saved")}>Saved Recipes</Button>
                <Button color="inherit" onClick={() => navigate("/grocery-list")}>Grocery List</Button>
                <Button color="inherit" onClick={() => {
                    useAuthStore.getState().logout();
                    navigate("/auth", { replace: true });
                }}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
}

function GroceryList() {
    const [groceryList, setGroceryList] = useState<GroceryListResponseDTO | null>(null);
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [weekStart, setWeekStart] = useState<Date | null>(null);

    const navigate = useNavigate();

    const fetchGroceryList = async (startDate: string, endDate: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get<GroceryListResponseDTO>('/api/v1/plan/grocery-list', {
                params: { startDate, endDate }
            });
            console.log(response.data)
            setGroceryList(response.data);
            setCheckedItems(new Set()); // Reset checked items when new list loads
        } catch (err) {
            console.error('Error fetching grocery list:', err);
            setError('Failed to load grocery list');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // // Load current week's grocery list by default
        // const today = new Date();
        // const startOfWeek = new Date(today);
        // startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
        // const endOfWeek = new Date(startOfWeek);
        // endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

        // const startStr = format(startOfWeek, 'yyyy-MM-dd');
        // const endStr = format(endOfWeek, 'yyyy-MM-dd');
        // fetchGroceryList(startStr, endStr);
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(today.getDate() - today.getDate() + 1);
        setWeekStart(monday);
    }, []);

    useEffect(() => {
        if (!weekStart) return;
        const start = new Date(weekStart)
        const end = new Date(weekStart)

        end.setDate(start.getDate() + 6)

        fetchGroceryList(
            format(start, 'yyyy-MM-dd'),
            format(end, 'yyyy-MM-dd')
        );
    }, [weekStart]);

    const goToPreviousWeek = () => {
        if (!weekStart) return;
        const prev = new Date(weekStart);
        prev.setDate(prev.getDate() - 7);
        setWeekStart(prev);
    };

    const goToNextWeek = () => {
        if (!weekStart) return;
        const next = new Date(weekStart);
        next.setDate(next.getDate() + 7);
        setWeekStart(next);
    };

    const handleToggleItem = (ingredient: string) => {
        const newChecked = new Set(checkedItems);
        if (newChecked.has(ingredient)) {
            newChecked.delete(ingredient);
        } else {
            newChecked.add(ingredient);
        }
        setCheckedItems(newChecked);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        if (!groceryList) return;

        const content = [
            `Grocery List`,
            `${format(new Date(groceryList.startDate), 'MMM d')} - ${format(new Date(groceryList.endDate), 'MMM d, yyyy')}`,
            '',
            ...groceryList.items.map(item =>
                `☐ ${item.name} - ${item.amount} ${item.unit}`
            )
        ].join('\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `grocery-list-${groceryList.startDate}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <TopNav />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <TopNav />

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {groceryList ? (
                <>
                    {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                Grocery List
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                {format(new Date(groceryList.startDate), 'MMM d')} - {format(new Date(groceryList.endDate), 'MMM d, yyyy')}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                                onClick={handlePrint}
                                sx={{ 
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    '@media print': { display: 'none' }
                                }}
                            >
                                <PrintIcon />
                            </IconButton>
                            <IconButton 
                                onClick={handleDownload}
                                sx={{ 
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    '@media print': { display: 'none' }
                                }}
                            >
                                <DownloadIcon />
                            </IconButton>
                        </Box>
                    </Box> */}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                Grocery List
                            </Typography>
                            {weekStart && (
                                <Typography variant="subtitle1" color="text.secondary">
                                    {format(weekStart, 'MMM d')} – {format(new Date(weekStart.getTime() + 6 * 86400000), 'MMM d, yyyy')}
                                </Typography>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Button variant="outlined" onClick={goToPreviousWeek}>
                                Previous
                            </Button>
                            <Button variant="outlined" onClick={goToNextWeek}>
                                Next
                            </Button>

                            <IconButton
                                onClick={handlePrint}
                                sx={{ border: '1px solid', borderColor: 'divider', '@media print': { display: 'none' } }}
                            >
                                <PrintIcon />
                            </IconButton>
                            <IconButton
                                onClick={handleDownload}
                                sx={{ border: '1px solid', borderColor: 'divider', '@media print': { display: 'none' } }}
                            >
                                <DownloadIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    <Paper elevation={2} sx={{ p: 3 }}>
                        {groceryList.items.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="h6" color="text.secondary">
                                    No ingredients needed
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Schedule some meals to generate your grocery list
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{ mt: 2 }}
                                    onClick={() => navigate('/planner')}
                                >
                                    Go to Planner
                                </Button>
                            </Box>
                        ) : (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    Items ({groceryList.items.length})
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        mb: 2,
                                        display: 'block',
                                        '@media print': { display: 'none' }
                                    }}
                                >
                                    {checkedItems.size} of {groceryList.items.length} items checked
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <List disablePadding>
                                    {groceryList.items.map((item, index) => {
                                        const itemKey = `${item.name}-${index}`;
                                        const isChecked = checkedItems.has(itemKey);

                                        return (
                                            <ListItem
                                                key={itemKey}
                                                disablePadding
                                                sx={{
                                                    py: 1,
                                                    borderBottom: index < groceryList.items.length - 1 ? '1px solid' : 'none',
                                                    borderColor: 'divider',
                                                    textDecoration: isChecked ? 'line-through' : 'none',
                                                    opacity: isChecked ? 0.6 : 1,
                                                    '@media print': {
                                                        textDecoration: 'none',
                                                        opacity: 1
                                                    }
                                                }}
                                            >
                                                <ListItemIcon sx={{ minWidth: 40, '@media print': { display: 'none' } }}>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={isChecked}
                                                        onChange={() => handleToggleItem(itemKey)}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="body1">
                                                            {item.name}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography variant="body2" color="text.secondary">
                                                            {item.amount} {item.unit}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </>
                        )}
                    </Paper>
                </>
            ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No grocery list available
                    </Typography>
                </Box>
            )}
        </Container>
    );
}

export default GroceryList;