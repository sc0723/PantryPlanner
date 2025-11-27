package org.example.pantryplanner.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record RecipePreviewDTO(int id,
                               String title,
                               String image,
                               String imageType,
                               int healthScore,
                               int readyInMinutes,
                               int servings) {
}
