package org.example.pantryplanner.olddto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ImageDTO(@JsonProperty("REGULAR") ImageInfoDTO regular,
                       @JsonProperty("SMALL") ImageInfoDTO small,
                       @JsonProperty("THUMBNAIL") ImageInfoDTO thumbnail) {
}
