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