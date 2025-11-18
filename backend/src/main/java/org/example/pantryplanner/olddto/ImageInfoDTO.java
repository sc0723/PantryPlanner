package org.example.pantryplanner.olddto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ImageInfoDTO(String url,
                           int width,
                           int height) {
}
