package org.example.pantryplanner.dto;

public record MealPlanRequestDTO(int recipeId,
                                 String plannedDate,
                                 String mealType) {
}
