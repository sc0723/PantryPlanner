package org.example.pantryplanner.repository;

import org.example.pantryplanner.model.RecipeIngredient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredient, Long> {
    List<RecipeIngredient> findByRecipeId(Integer recipeId);
    List<RecipeIngredient> findByRecipeIdIn(Set<Integer> recipeIds);
}
