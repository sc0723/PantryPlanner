package org.example.pantryplanner.controller;

import org.example.pantryplanner.dto.LoginRequestDTO;
import org.example.pantryplanner.model.User;
import org.example.pantryplanner.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        String token = authService.register(user);
        return token;
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequestDTO request) {
        String token = authService.login(request);
        return token;
    }
}
