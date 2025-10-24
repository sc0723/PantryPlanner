package org.example.pantryplanner.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ImageDTO(@JsonProperty("REGULAR") ImageInfoDTO regular,
                       @JsonProperty("SMALL") ImageInfoDTO small,
                       @JsonProperty("THUMBNAIL") ImageInfoDTO thumbnail) {
}
