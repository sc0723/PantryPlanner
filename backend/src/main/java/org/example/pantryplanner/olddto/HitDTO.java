package org.example.pantryplanner.olddto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record HitDTO(RecipeDTO recipe) {
}
