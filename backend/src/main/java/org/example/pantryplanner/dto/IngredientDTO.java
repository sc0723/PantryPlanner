package org.example.pantryplanner.dto;

public record IngredientDTO(int id,
                            String name,
                            double amount,
                            String unit) {
}
