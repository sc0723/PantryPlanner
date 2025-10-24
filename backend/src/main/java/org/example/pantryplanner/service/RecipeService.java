package org.example.pantryplanner.service;

import org.example.pantryplanner.dto.EdamamResponseDTO;
import org.example.pantryplanner.dto.HitDTO;
import org.example.pantryplanner.dto.RecipeDTO;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@Slf4j
public class RecipeService {
    @Value("${edamam.api.id}")
    private String apiId;

    @Value("${edamam.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public RecipeService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<RecipeDTO> searchRecipes(String query, List<String> health, String mealType, String calories, String time) {
        String baseUrl = "https://api.edamam.com/api/recipes/v2";

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .queryParam("type", "public")
                .queryParam("q", query)
                .queryParam("app_id", apiId)
                .queryParam("app_key", apiKey);

        if (health != null && !health.isEmpty()) {
            builder.queryParam("health", health);
        }
        if (mealType != null && !mealType.isEmpty()) {
            builder.queryParam("mealType", mealType);
        }
        if (calories != null && !calories.isEmpty()) {
            builder.queryParam("calories", calories);
        }
        if (time != null && !time.isEmpty()) {
            builder.queryParam("time", time);
        }

        String url = builder.toUriString();

        log.info("Requesting URL: {}", url);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Edamam-Account-User", "pantry-planner-user-01"); // Hardcoded user for now
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<EdamamResponseDTO> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    EdamamResponseDTO.class
            );

//            log.info("API Response: {}", response.getBody());
            return response.getBody().hits().stream().map(HitDTO::recipe).collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error calling Edamam API: {}", e.getMessage());
            return null;
        }
    }






}
