package org.example.pantryplanner.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ImageInfoDTO(String url,
                           int width,
                           int height) {
}
