package org.example.pantryplanner.controller;

import org.example.pantryplanner.dto.ComplexSearchDTO;
import org.example.pantryplanner.dto.RecipeDetailDTO;
import org.example.pantryplanner.service.RecipeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/recipes")
@CrossOrigin(origins = "http://localhost:5173")
public class RecipeController {
    private final RecipeService recipeService;
    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping("/search")
    public ResponseEntity<ComplexSearchDTO> searchRecipes(@RequestParam String query,
                                                                @RequestParam(required = false) String[] health,
                                                                @RequestParam(required = false) String mealType,
                                                                @RequestParam(required = false) String calories,
                                                                @RequestParam(required = false) String time) {
        ComplexSearchDTO response = recipeService.searchRecipes(query, health, mealType, calories, time);

        if (response != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeDetailDTO> searchRecipeById(@PathVariable Integer id) {
        RecipeDetailDTO response = recipeService.getRecipeById(id);
        if (response != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}


