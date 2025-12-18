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
import { format, addDays } from 'date-fns';
import api from '../services/api';

/* ---------- types ---------- */

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

/* ---------- helpers ---------- */

const getCurrentWeekMonday = () => {
    const today = new Date();
    const day = today.getDay(); // 0 = Sun
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
};

/* ---------- top nav ---------- */

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
                }}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
}

/* ---------- grocery list ---------- */

function GroceryList() {
    const [groceryList, setGroceryList] = useState<GroceryListResponseDTO | null>(null);
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ⭐ Single source of truth
    const [weekStart, setWeekStart] = useState<Date>(() => getCurrentWeekMonday());

    const navigate = useNavigate();

    const weekEnd = addDays(weekStart, 6);

    const fetchGroceryList = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get<GroceryListResponseDTO>(
                '/api/v1/plan/grocery-list',
                {
                    params: {
                        startDate: format(weekStart, 'yyyy-MM-dd'),
                        endDate: format(weekEnd, 'yyyy-MM-dd')
                    }
                }
            );

            setGroceryList(response.data);
            setCheckedItems(new Set());
        } catch (err) {
            console.error(err);
            setError('Failed to load grocery list');
        } finally {
            setIsLoading(false);
        }
    };

    // 🔁 Refetch whenever week changes
    useEffect(() => {
        fetchGroceryList();
    }, [weekStart]);

    /* ---------- navigation ---------- */

    const goToPrevWeek = () => {
        setWeekStart(prev => addDays(prev, -7));
    };

    const goToNextWeek = () => {
        setWeekStart(prev => addDays(prev, 7));
    };

    const handleToggleItem = (key: string) => {
        setCheckedItems(prev => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    };

    const handlePrint = () => window.print();

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
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `grocery-list-${groceryList.startDate}.txt`;
        a.click();

        URL.revokeObjectURL(url);
    };

    /* ---------- render ---------- */

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <TopNav />
                <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: 400 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <TopNav />

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {groceryList && (
                <>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Box>
                            <Typography variant="h4" fontWeight="bold">
                                Grocery List
                            </Typography>
                            <Typography color="text.secondary">
                                {format(weekStart, 'MMM d')} – {format(weekEnd, 'MMM d, yyyy')}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button onClick={goToPrevWeek}>Previous</Button>
                            <Button onClick={goToNextWeek}>Next</Button>
                            <IconButton onClick={handlePrint}><PrintIcon /></IconButton>
                            <IconButton onClick={handleDownload}><DownloadIcon /></IconButton>
                        </Box>
                    </Box>

                    {/* List */}
                    <Paper sx={{ p: 3 }}>
                        <List disablePadding>
                            {groceryList.items.map((item, index) => {
                                const key = `${item.name}-${item.unit}-${index}`;
                                const checked = checkedItems.has(key);

                                return (
                                    <ListItem
                                        key={key}
                                        sx={{
                                            textDecoration: checked ? 'line-through' : 'none',
                                            opacity: checked ? 0.6 : 1
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Checkbox
                                                checked={checked}
                                                onChange={() => handleToggleItem(key)}
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.name}
                                            secondary={`${item.amount} ${item.unit}`}
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Paper>
                </>
            )}
        </Container>
    );
}

export default GroceryList;
