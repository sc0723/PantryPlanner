package org.example.pantryplanner.controller;

import org.example.pantryplanner.dto.GroceryListResponseDTO;
import org.example.pantryplanner.service.GroceryListService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/plan")
@CrossOrigin(origins = "http://localhost:5173")
public class GroceryListController {
    private final GroceryListService groceryListService;

    public GroceryListController(GroceryListService groceryListService) { this.groceryListService = groceryListService; }

    @GetMapping("/grocery-list")
    public ResponseEntity<GroceryListResponseDTO> getGroceryList(@RequestParam String startDate,
                                                                 @RequestParam String endDate,
                                                                 @AuthenticationPrincipal UserDetails userDetails) {
        GroceryListResponseDTO response = groceryListService.generateGroceryList(
                userDetails.getUsername(),
                startDate,
                endDate
        );

        if (response != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
