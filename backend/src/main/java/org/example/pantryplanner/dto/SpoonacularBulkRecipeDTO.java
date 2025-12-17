package org.example.pantryplanner.dto;

import java.util.List;

public record SpoonacularBulkRecipeDTO(int id,
                                       List<GroceryItemDTO> extendedIngredients) {
}
