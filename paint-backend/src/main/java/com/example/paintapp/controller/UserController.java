package com.example.paintapp.controller;

import com.example.paintapp.model.User;
import com.example.paintapp.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {
    private final UserRepository userRepo;

    public UserController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @GetMapping
    public List<User> getUsers() {
        return userRepo.findAll();
    }
}
