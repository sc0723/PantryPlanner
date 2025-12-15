import axios from "axios";
import api from "./api";
import type { RecipeDetail } from "../types/recipe";

export async function saveRecipe(recipeDetails: RecipeDetail) {
     const payload = {
        recipeId: recipeDetails.id,
        recipeTitle: recipeDetails.title,
        imageUrl: recipeDetails.image
     };

     try {
        const response = await api.post('/api/v1/plan/recipes/save', payload);
        return response.data;
     } catch (error) {
        console.error("Error saving recipe:", error);
        throw new Error("Failed to save recipe. Please check if you are logged in."); 
     }
}

export async function fetchMealPlan(startDate: string, endDate: string) {
    try {
        const response = await api.get('/api/v1/plan/meals',
            {
                params: {
                    startDate: startDate || "",
                    endDate: endDate || ""
                }
            }
        );
        return response.data;
    } catch (error) {
        console.log("Error fetching recipes")
        throw new Error("Error saving recipes")
    }
}

export async function scheduleMeal(recipeId: number, plannedDate: string, mealType: string) {
    const payload = {
        recipeId,
        plannedDate,
        mealType
    }

    try {
        const response = await api.post('/api/v1/plan/meals/schedule', payload)
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Error scheduling meal: ", error)
        throw new Error("Failed to schedule meal.")
    }
}

