package org.example.pantryplanner.dto;

import org.example.pantryplanner.model.User;

public record SaveRecipeRequestDTO(int recipeId,
                                   String recipeTitle,
                                   String imageUrl) {
}

