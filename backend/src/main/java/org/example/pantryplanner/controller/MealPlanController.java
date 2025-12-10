package org.example.pantryplanner.controller;

import org.example.pantryplanner.dto.MealPlanEntryResponseDTO;
import org.example.pantryplanner.dto.MealPlanRequestDTO;
import org.example.pantryplanner.dto.SaveRecipeRequestDTO;
import org.example.pantryplanner.model.MealPlanEntry;
import org.example.pantryplanner.model.SavedRecipe;
import org.example.pantryplanner.service.MealPlanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/plan")
@CrossOrigin(origins = "http://localhost:5173")
public class MealPlanController {

    private final MealPlanService mealPlanService;

    public MealPlanController(MealPlanService mealPlanService) { this.mealPlanService = mealPlanService; }

    @PostMapping("/recipes/save")
    public ResponseEntity<SavedRecipe> saveRecipe(@RequestBody SaveRecipeRequestDTO request,
                                                           @AuthenticationPrincipal UserDetails userDetails) {

        SavedRecipe response = mealPlanService.saveRecipe(request, userDetails.getUsername());

        if (response != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }
    @PostMapping("/meals/schedule")
    public ResponseEntity<MealPlanEntry> scheduleMeal(@RequestBody MealPlanRequestDTO request,
                                                      @AuthenticationPrincipal UserDetails userDetails) {
        MealPlanEntry response = mealPlanService.scheduleMeal(request, userDetails.getUsername());

        if (response != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/meals")
    public ResponseEntity<List<MealPlanEntryResponseDTO>> getMealPlanByDateRange(@RequestParam String startDate,
                                                                      @RequestParam String endDate,
                                                                      @AuthenticationPrincipal UserDetails userDetails) {
        List<MealPlanEntryResponseDTO> response = mealPlanService.getMealPlanByDateRange(userDetails.getUsername(), startDate, endDate);
        if (response != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
