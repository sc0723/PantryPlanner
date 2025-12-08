package org.example.pantryplanner.service;

import lombok.extern.slf4j.Slf4j;
import org.example.pantryplanner.dto.MealPlanRequestDTO;
import org.example.pantryplanner.dto.SaveRecipeRequestDTO;
import org.example.pantryplanner.model.MealPlanEntry;
import org.example.pantryplanner.model.SavedRecipe;
import org.example.pantryplanner.model.User;
import org.example.pantryplanner.repository.MealPlanEntryRepository;
import org.example.pantryplanner.repository.SavedRecipeRepository;
import org.example.pantryplanner.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@Slf4j
public class MealPlanService {
    private final SavedRecipeRepository savedRecipeRepository;
    private final UserRepository userRepository;
    private final MealPlanEntryRepository mealPlanEntryRepository;

    public MealPlanService(SavedRecipeRepository savedRecipeRepository, UserRepository userRepository
            , MealPlanEntryRepository mealPlanEntryRepository) {
        this.savedRecipeRepository = savedRecipeRepository;
        this.userRepository = userRepository;
        this.mealPlanEntryRepository = mealPlanEntryRepository;
    }

    public SavedRecipe saveRecipe(SaveRecipeRequestDTO request, String username) {
        User userRequested = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Optional<SavedRecipe> savedRecipe = savedRecipeRepository.findByRecipeIdAndUser(request.recipeId(), userRequested);

        if (savedRecipe.isEmpty()) {
            SavedRecipe newSavedRecipe = new SavedRecipe(userRequested, request.recipeId()
                    , request.recipeTitle(), request.imageUrl());
            savedRecipeRepository.save(newSavedRecipe);
            return newSavedRecipe;
        }

        return savedRecipe.get();

    }

    public MealPlanEntry scheduleMeal(MealPlanRequestDTO request, String username) {
        User userRequested = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        SavedRecipe savedRecipe = savedRecipeRepository.findByRecipeIdAndUser(
                request.recipeId(),
                userRequested
        ).orElseThrow(() -> new IllegalArgumentException("Recipe not found in user's saved recipes. You must save the recipes first!"));

        LocalDate date = LocalDate.parse(request.plannedDate());

        MealPlanEntry newEntry = new MealPlanEntry(
                null,
                userRequested,
                date,
                request.mealType(),
                savedRecipe
        );

        MealPlanEntry savedEntry = mealPlanEntryRepository.save(newEntry);

        return savedEntry;
    }

}
