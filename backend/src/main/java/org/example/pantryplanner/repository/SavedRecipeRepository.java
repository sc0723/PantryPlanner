package org.example.pantryplanner.repository;

import org.example.pantryplanner.model.SavedRecipe;
import org.example.pantryplanner.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedRecipeRepository extends JpaRepository<SavedRecipe, Long> {
    Optional<SavedRecipe> findByRecipeIdAndUser(int recipeId, User user);
    List<SavedRecipe> findAllByUser(User user);
}
