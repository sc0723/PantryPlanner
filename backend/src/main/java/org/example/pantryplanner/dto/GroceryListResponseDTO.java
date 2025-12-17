package org.example.pantryplanner.dto;

import java.time.LocalDate;
import java.util.List;

public record GroceryListResponseDTO(LocalDate startDate,
                                     LocalDate endDate,
                                     List<GroceryItemDTO> items) {
}
