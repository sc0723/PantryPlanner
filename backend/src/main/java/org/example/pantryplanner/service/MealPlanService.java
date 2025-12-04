package org.example.pantryplanner.service;

import lombok.extern.slf4j.Slf4j;
import org.example.pantryplanner.dto.SaveRecipeRequestDTO;
import org.example.pantryplanner.model.SavedRecipe;
import org.example.pantryplanner.model.User;
import org.example.pantryplanner.repository.SavedRecipeRepository;
import org.example.pantryplanner.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class MealPlanService {
    private final SavedRecipeRepository savedRecipeRepository;
    private final UserRepository userRepository;

    public MealPlanService(SavedRecipeRepository savedRecipeRepository, UserRepository userRepository) {
        this.savedRecipeRepository = savedRecipeRepository;
        this.userRepository = userRepository;
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

}
