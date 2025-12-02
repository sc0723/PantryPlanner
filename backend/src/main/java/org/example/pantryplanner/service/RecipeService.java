package org.example.pantryplanner.service;

import org.example.pantryplanner.dto.ComplexSearchDTO;
import org.example.pantryplanner.dto.RecipeDetailDTO;
import org.example.pantryplanner.olddto.RecipeDTO;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@Slf4j
public class RecipeService {
    @Value("${spoonacular.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public RecipeService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ComplexSearchDTO searchRecipes(String query, String[] health, String mealType, String calories, String time) {
        String baseUrl = "https://api.spoonacular.com/recipes/complexSearch";

        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(baseUrl)
                .queryParam("query", query)
                .queryParam("addRecipeInformation", true)
                .queryParam("number", 5)
                .queryParam("apiKey", apiKey);
        if (health != null && health.length != 0) {
            String formattedHealth = String.join(",", health);
            builder.queryParam("diet", formattedHealth);
        }
        if (mealType != null && !mealType.isEmpty()) {
            builder.queryParam("type", mealType);
        }
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

            return response.getBody();

        } catch (Exception e) {
            log.error("Error calling Spoonacular API: {}", e.getMessage());
            return null;
        }
    }

    public RecipeDetailDTO getRecipeById(Integer id) {
        String baseUrl = "https://api.spoonacular.com/recipes/" + id + "/information";
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(baseUrl)
                .queryParam("id", id)
                .queryParam("includeNutrition", true)
                .queryParam("apiKey", apiKey);

        String url = builder.toUriString();

        log.info("Requesting URL: {}", url);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Spoonacular-User", "pantry-planner-user-01"); // Hardcoded user for now
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<RecipeDetailDTO> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    RecipeDetailDTO.class
            );

            return response.getBody();
        } catch (Exception e) {
            log.error("Error calling Spoonacular API: {}", e.getMessage());
            return null;
        }
    }
}
