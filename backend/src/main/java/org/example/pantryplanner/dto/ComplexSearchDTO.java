package org.example.pantryplanner.dto;

import java.util.List;

public record ComplexSearchDTO(int offset,
                               int number,
                               List<RecipePreviewDTO> results,
                               int totalResults) {
}
