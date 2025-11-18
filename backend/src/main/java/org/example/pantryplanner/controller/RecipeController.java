package org.example.pantryplanner.controller;

import org.example.pantryplanner.olddto.RecipeDTO;
import org.example.pantryplanner.service.RecipeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/recipes")
@CrossOrigin(origins = "http://localhost:5173")
public class RecipeController {
    private final RecipeService recipeService;
    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<RecipeDTO>> searchRecipes(@RequestParam String q,
                                                         @RequestParam(required=false) List<String> health,
                                                         @RequestParam(required = false) String mealType,
                                                         @RequestParam(required = false) String calories,
                                                         @RequestParam(required = false) String time) {
        List<RecipeDTO> response = recipeService.searchRecipes(q, health, mealType, calories, time);

        if (response != null) {
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/search/{jd}")
    public ResponseEntity<RecipeDTO> searchRecipeById(@PathVariable Long id) {
        RecipeDTO response = recipeService.getRecipeById(id);
    }
}


