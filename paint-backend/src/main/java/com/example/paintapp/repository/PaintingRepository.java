package com.example.paintapp.repository;

import com.example.paintapp.model.Painting;
import com.example.paintapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaintingRepository extends JpaRepository<Painting, Long> {
    Optional<Painting> findByUser(User user);
    void deleteByUser(User user);
}
