package org.example.pantryplanner.olddto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record RecipeDTO(String label,
                        double calories,
                        double totalTime,
                        double yield,
                        List<String> ingredientLines,
                        List<String> dietLabels,
                        List<String> healthLabels,
                        List<String> cuisineType,
                        ImageDTO images,
                        TotalNutrientsDTO totalNutrients
                        ) {
}
