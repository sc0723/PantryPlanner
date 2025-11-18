package org.example.pantryplanner.olddto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record TotalNutrientsDTO(@JsonProperty("ENERC_KCAL") NutrientInfoDTO calories,
                                @JsonProperty("PROCNT") NutrientInfoDTO protein,
                                @JsonProperty("FAT") NutrientInfoDTO fat,
                                @JsonProperty("CHOCDF") NutrientInfoDTO carbs,
                                @JsonProperty("SUGAR") NutrientInfoDTO sugar
                                ) {
}
