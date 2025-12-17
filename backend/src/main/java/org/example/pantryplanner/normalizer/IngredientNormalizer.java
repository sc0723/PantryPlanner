package org.example.pantryplanner.normalizer;

import org.example.pantryplanner.dto.GroceryItemDTO;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class IngredientNormalizer {
    private static final Map<String, String> NAME_ALIASES = Map.of(
            "scallions", "green onions",
            "spring onions", "green onions"
    );

    private static final Map<String, String> UNIT_ALIASES = Map.of(
            "tablespoons", "tbsp",
            "tablespoon", "tbsp",
            "teaspoons", "tsp",
            "ounces", "oz",
            "pound", "lb"
    );

    public boolean isValid(GroceryItemDTO item) {
        return item.name() != null
                && !item.name().contains("&")
                && item.unit() != null
                && !item.unit().equalsIgnoreCase("servings");
    }

    public String normalizeName(String name) {
        String cleaned = name.toLowerCase().trim();
        return NAME_ALIASES.getOrDefault(cleaned, cleaned);
    }

    public String normalizeUnit(String unit) {
        String cleaned = unit.toLowerCase().trim();
        return UNIT_ALIASES.getOrDefault(cleaned, cleaned);
    }

    public GroceryItemDTO normalize(GroceryItemDTO item) {
        String name = normalizeName(item.name());
        String unit = normalizeUnit(item.unit());

        return new GroceryItemDTO(name, item.amount(), unit);
    }
}
