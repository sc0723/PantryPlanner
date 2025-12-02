package org.example.pantryplanner.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@JsonIgnoreProperties(ignoreUnknown = true)
public record RecipeDetailDTO(int id,
                              String title,
                              String image,
                              int readyInMinutes,
                              int servings,
                              int preparationMinutes,
                              int cookingMinutes,

                              String summary,
                              String sourceUrl,


                              List<IngredientDTO> extendedIngredients,
                              List<AnalyzedInstructionDTO> analyzedInstructions,

                              NutritionWrapperDTO nutrition) {
    public List<InstructionStepDTO> getInstructionSteps() {
        return Optional.ofNullable(analyzedInstructions)
                .orElse(Collections.emptyList())
                .stream()
                .flatMap(a -> a.steps().stream())
                .collect(Collectors.toList());
    }

    public List<NutrientDTO> getNutrients() {
        return Optional.ofNullable(nutrition)
                .map(NutritionWrapperDTO::nutrients)
                .orElse(Collections.emptyList());
    }
}


