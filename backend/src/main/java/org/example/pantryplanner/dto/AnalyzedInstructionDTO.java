package org.example.pantryplanner.dto;

import java.util.List;

public record AnalyzedInstructionDTO(
        String name,
        List<InstructionStepDTO> steps
) {
}
