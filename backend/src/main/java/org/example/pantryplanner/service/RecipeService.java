package org.example.pantryplanner.service;

import org.example.pantryplanner.dto.ComplexSearchDTO;
import org.example.pantryplanner.dto.RecipePreviewDTO;
import org.example.pantryplanner.dto.SpoonacularResponseDTO;
import org.example.pantryplanner.olddto.EdamamResponseDTO;
import org.example.pantryplanner.olddto.HitDTO;
import org.example.pantryplanner.olddto.RecipeDTO;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class RecipeService {
//    @Value("${edamam.api.id}")
//    private String apiId;

    @Value("${spoonacular.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public RecipeService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ComplexSearchDTO searchRecipes(String query, String calories, String time) {
        String baseUrl = "https://api.spoonacular.com/recipes/complexSearch";

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl)
//                .queryParam("type", "public")
                .queryParam("query", query)
                .queryParam("addRecipeInformation", true)
                .queryParam("number", 5)
                .queryParam("apiKey", apiKey);
//        if (health != null && !health.isEmpty()) {
//            builder.queryParam("health", health);
//        }
//        if (mealType != null && !mealType.isEmpty()) {
//            builder.queryParam("mealType", mealType);
//        }
        if (calories != null && !calories.isEmpty()) {
            builder.queryParam("maxCalories", calories);
        }
        if (time != null && !time.isEmpty()) {
            builder.queryParam("time", time);
        }

        String url = builder.toUriString();

        log.info("Requesting URL: {}", url);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Spoonacular-User", "pantry-planner-user-01"); // Hardcoded user for now
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<ComplexSearchDTO> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    ComplexSearchDTO.class
            );

//            log.info("API Response: {}", response.getBody());
            return response.getBody();

        } catch (Exception e) {
            log.error("Error calling Spoonacular API: {}", e.getMessage());
            return null;
        }
    }

//
//    public RecipeDTO getRecipeById(Long id) {
//
//    }
}
