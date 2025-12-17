package org.example.pantryplanner.service;

import org.example.pantryplanner.dto.GroceryItemDTO;
import org.example.pantryplanner.dto.SpoonacularBulkRecipeDTO;
import org.example.pantryplanner.normalizer.IngredientNormalizer;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.example.pantryplanner.dto.GroceryListResponseDTO;
import org.example.pantryplanner.model.MealPlanEntry;
import org.example.pantryplanner.model.User;
import org.example.pantryplanner.repository.MealPlanEntryRepository;
import org.example.pantryplanner.repository.UserRepository;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class GroceryListService {
    private final UserRepository userRepository;
    private final MealPlanEntryRepository mealPlanEntryRepository;
    private final RecipeIngredientService recipeIngredientService;


    public GroceryListService(UserRepository userRepository,
                              MealPlanEntryRepository mealPlanEntryRepository,
                              RecipeIngredientService recipeIngredientService) {
        this.userRepository = userRepository;
        this.mealPlanEntryRepository = mealPlanEntryRepository;
        this.recipeIngredientService = recipeIngredientService;
    }

    public GroceryListResponseDTO generateGroceryList(String username, String startDate, String endDate) {
        User userRequested = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found: " + username));

        List<MealPlanEntry> plannedMeals = mealPlanEntryRepository.findAllByUserAndPlannedDateBetween(userRequested,
                LocalDate.parse(startDate), LocalDate.parse(endDate));
        // Map planned meals to set of unique recipe id values
        Set<Integer> uniqueRecipeId = plannedMeals.stream()
                .map(m -> m.getSavedRecipe().getRecipeId())
                .collect(Collectors.toSet());
        if (uniqueRecipeId.isEmpty()) {
            return new GroceryListResponseDTO(
                    LocalDate.parse(startDate),
                    LocalDate.parse(endDate),
                    List.of()
            );
        }


        String neededIds = recipeIngredientService.getRequiredIds(uniqueRecipeId);

        if (!neededIds.isEmpty()) {
            recipeIngredientService.fetchAndSaveBulk(neededIds);
        }

        Set<GroceryItemDTO> groceryItems = uniqueRecipeId.stream()
                .flatMap(recipeId -> recipeIngredientService.getByRecipeId(recipeId).stream())
                .map(ri -> new GroceryItemDTO(ri.getName(), ri.getAmount(), ri.getUnit()))
                .collect(Collectors.toMap(
                        item -> item.name().toLowerCase(),
                        item -> item,
                        (a, b) -> new GroceryItemDTO(a.name(), a.amount() + b.amount(), a.unit())
                ))
                .values()
                .stream()
                .collect(Collectors.toSet());

        List<GroceryItemDTO> sortedItems = groceryItems.stream()
                .sorted(Comparator.comparing(GroceryItemDTO::name))
                .toList();

        return new GroceryListResponseDTO(LocalDate.parse(startDate),
                LocalDate.parse(endDate),
                sortedItems);
    }
}
