package org.example.pantryplanner.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "saved_recipes")
public class SavedRecipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "recipe_id", nullable = false)
    private int recipeId;

    private String recipeTitle;
    private String imageUrl;

    public SavedRecipe(User user, int recipeId, String recipeTitle, String imageUrl) {
        this.user = user;
        this.recipeId = recipeId;
        this.recipeTitle = recipeTitle;
        this.imageUrl = imageUrl;
    }
}
