package org.example.pantryplanner.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "meal_plan_entries")
public class MealPlanEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate plannedDate;

    @Column(nullable = false)
    private String mealType;

    // Foreign Key to saved_recipes table
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "saved_recipe_id", nullable = false)
    private SavedRecipe savedRecipe;
}
