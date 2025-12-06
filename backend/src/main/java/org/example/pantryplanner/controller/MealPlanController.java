package org.example.pantryplanner.controller;

import org.example.pantryplanner.dto.SaveRecipeRequestDTO;
import org.example.pantryplanner.model.SavedRecipe;
import org.example.pantryplanner.service.MealPlanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/plan")
@CrossOrigin(origins = "http://localhost:5173")
public class MealPlanController {

    private final MealPlanService mealPlanService;

    public MealPlanController(MealPlanService mealPlanService) { this.mealPlanService = mealPlanService; }

    @PostMapping("/recipes/save")
    public ResponseEntity<SavedRecipe> saveRecipe(@RequestBody SaveRecipeRequestDTO request,
                                                           @AuthenticationPrincipal UserDetails userDetails) {

        System.out.println("Principal: " + userDetails);
        SavedRecipe response = mealPlanService.saveRecipe(request, userDetails.getUsername());

        if (response != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }
}
