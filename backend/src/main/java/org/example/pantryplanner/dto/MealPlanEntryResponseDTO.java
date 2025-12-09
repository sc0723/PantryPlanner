package org.example.pantryplanner.dto;

import java.time.LocalDate;

public record MealPlanEntryResponseDTO(Long id,
                                       Long userId,
                                       Long savedRecipeId,
                                       String recipeTitle,
                                       String imageUrl,
                                       LocalDate plannedDate,
                                       String mealType) {
}
