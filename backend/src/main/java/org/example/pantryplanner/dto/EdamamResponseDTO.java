package org.example.pantryplanner.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record EdamamResponseDTO(List<HitDTO> hits) {
}
