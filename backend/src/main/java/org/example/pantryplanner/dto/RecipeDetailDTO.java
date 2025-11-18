package org.example.pantryplanner.dto;

import java.util.List;

public record RecipeDetailDTO(int id,
                              String title,
                              String image,
                              int readyInMinutes,
                              int servings,
                              String instructions,
                              List<IngredientDTO> extendedIngredients,
                              List<NutrientDTO> nutrition,
                              List<InstructionStepDTO> instructionSteps) {
}
