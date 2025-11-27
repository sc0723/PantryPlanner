package org.example.pantryplanner.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;
@JsonIgnoreProperties(ignoreUnknown = true)
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
