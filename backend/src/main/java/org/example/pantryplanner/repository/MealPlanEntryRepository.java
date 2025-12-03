package org.example.pantryplanner.repository;

import org.example.pantryplanner.model.MealPlanEntry;
import org.example.pantryplanner.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MealPlanEntryRepository extends JpaRepository<MealPlanEntry, Long> {
    List<MealPlanEntry> findAllByUser(User user);

    List<MealPlanEntry> findAllByUserAndPlannedDateBetween(User user, LocalDate startDate, LocalDate endDate);
}
