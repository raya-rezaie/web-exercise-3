package com.example.paintapp.config;

import com.example.paintapp.model.User;
import com.example.paintapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
    @Bean
    public CommandLineRunner initUsers(UserRepository userRepo) {
        return args -> {
            if (userRepo.count() == 0) {
                userRepo.save(new User(1L, "default1", "Artist 1"));
                userRepo.save(new User(2L, "default2", "Artist 2"));
                userRepo.save(new User(3L, "default3", "Artist 3"));
            }
        };
    }
}
