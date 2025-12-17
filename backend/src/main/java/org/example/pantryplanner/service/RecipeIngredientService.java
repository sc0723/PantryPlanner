package org.example.pantryplanner.service;

import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.extern.slf4j.Slf4j;
import org.example.pantryplanner.dto.SpoonacularBulkRecipeDTO;
import org.example.pantryplanner.model.RecipeIngredient;
import org.example.pantryplanner.normalizer.IngredientNormalizer;
import org.example.pantryplanner.repository.RecipeIngredientRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

//@Service
//public class RecipeIngredientService {
//    private final RecipeIngredientRepository repository;
//
//    public RecipeIngredientService(RecipeIngredientRepository repository) {
//        this.repository = repository;
//    }
//
//    @Cacheable(value = "recipeIngredients", key = "#recipeId")
//    public List<RecipeIngredient> getByRecipeId(Integer recipeId) {
//        return repository.findByRecipeId(recipeId);
//    }
//
//    @CachePut(value = "recipeIngredients", key = "#recipeId")
//    public List<RecipeIngredient> saveAndCache(
//            Integer recipeId,
//            List<RecipeIngredient> ingredients
//    ) {
//        ingredients.forEach(i -> i.setRecipe_id(recipeId));
//        return repository.saveAll(ingredients);
//    }
//}

@Service
@Slf4j
public class RecipeIngredientService {
    private final RecipeIngredientRepository repository;
    private final RecipeIngredientService self;
    private final RestTemplate restTemplate;
    private final IngredientNormalizer normalizer;

    @Value("${spoonacular.api.key}")
    private String apiKey;

    public RecipeIngredientService(RecipeIngredientRepository repository,
                                   RestTemplate restTemplate,
                                   IngredientNormalizer normalizer,
                                   @Lazy RecipeIngredientService self) {
        this.repository = repository;
        this.restTemplate = restTemplate;
        this.normalizer = normalizer;
        this.self = self;
    }

    public String getRequiredIds(Set<Integer> uniqueRecipeIds) {
        // Get all existing ingredients
        List<RecipeIngredient> existingIngredients = repository.findByRecipeIdIn(uniqueRecipeIds);

        // Collect the recipe IDs that already exist in DB
        Set<Integer> foundIds = existingIngredients.stream()
                .map(RecipeIngredient::getRecipeId)
                .collect(Collectors.toSet());

        // Compute the missing IDs
        Set<Integer> missingIds = new HashSet<>(uniqueRecipeIds);
        missingIds.removeAll(foundIds);

        // Return as comma-separated string
        return missingIds.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));
    }

    @Cacheable(value = "recipeIngredients", key = "#recipeId")
    public List<RecipeIngredient> getByRecipeId(Integer recipeId) {
        return repository.findByRecipeId(recipeId);
    }

    @CachePut(value = "recipeIngredients", key = "#recipeId")
    public List<RecipeIngredient> saveAndCache(
            Integer recipeId,
            List<RecipeIngredient> ingredients
    ) {
        ingredients.forEach(i -> i.setRecipeId(recipeId));
        return repository.saveAll(ingredients);
    }

    public void fetchAndSaveBulk(String recipeIds) {
        try {
            String url = UriComponentsBuilder.fromUriString("https://api.spoonacular.com/recipes/informationBulk")
                    .queryParam("ids", recipeIds)
                    .queryParam("apiKey", apiKey)
                    .toUriString();

            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/json");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<List<SpoonacularBulkRecipeDTO>> response =
                    restTemplate.exchange(url, HttpMethod.GET, entity,
                            new ParameterizedTypeReference<List<SpoonacularBulkRecipeDTO>>() {});

            List<SpoonacularBulkRecipeDTO> recipes = response.getBody();

            if (recipes == null) return;

            for (SpoonacularBulkRecipeDTO recipe : recipes) {
                List<RecipeIngredient> ingredients = recipe.extendedIngredients().stream()
                        .map(i -> {
                            RecipeIngredient ri = new RecipeIngredient();
                            ri.setRecipeId(recipe.id());
                            ri.setName(normalizer.normalizeName(i.name()));
                            ri.setAmount(i.amount());
                            ri.setUnit(normalizer.normalizeUnit(i.unit()));
                            return ri;
                        })
                        .toList();

                saveAndCache(recipe.id(), ingredients);
            }


        } catch (Exception e) {
            log.error("Error fetching bulk ingredients: " + e);
        }
    }
}

