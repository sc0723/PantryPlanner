package org.example.pantryplanner.dto;

import java.time.LocalDate;

public record MealPlanEntryResponseDTO(Long id,
                                       Long userId,
                                       int spoonacularRecipeId,
                                       String recipeTitle,
                                       String imageUrl,
                                       LocalDate plannedDate,
                                       String mealType) {
}
