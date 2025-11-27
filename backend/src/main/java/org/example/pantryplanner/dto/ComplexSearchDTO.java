package org.example.pantryplanner.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;
@JsonIgnoreProperties(ignoreUnknown = true)
public record ComplexSearchDTO(int offset,
                               int number,
                               List<RecipePreviewDTO> results,
                               int totalResults) {
}
