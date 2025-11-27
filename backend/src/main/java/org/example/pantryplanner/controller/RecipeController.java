package org.example.pantryplanner.controller;

import org.example.pantryplanner.dto.ComplexSearchDTO;
import org.example.pantryplanner.dto.RecipePreviewDTO;
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
    public ResponseEntity<ComplexSearchDTO> searchRecipes(@RequestParam String query,
                                                                @RequestParam(required=false) List<String> health,
                                                                @RequestParam(required = false) String mealType,
                                                                @RequestParam(required = false) String calories,
                                                                @RequestParam(required = false) String time) {
        ComplexSearchDTO response = recipeService.searchRecipes(query, calories, time);

        if (response != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

//    @GetMapping("/search/{jd}")
//    public ResponseEntity<RecipeDTO> searchRecipeById(@PathVariable Long id) {
////        RecipeDTO response = recipeService.getRecipeById(id);
//    }
}


