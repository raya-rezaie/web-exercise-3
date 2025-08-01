package com.example.paintapp.controller;

import com.example.paintapp.model.Painting;
import com.example.paintapp.model.User;
import com.example.paintapp.repository.PaintingRepository;
import com.example.paintapp.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/paintings")
@CrossOrigin
public class PaintingController {
    private final PaintingRepository paintingRepo;
    private final UserRepository userRepo;

    public PaintingController(PaintingRepository paintingRepo, UserRepository userRepo) {
        this.paintingRepo = paintingRepo;
        this.userRepo = userRepo;
    }

    @PostMapping
    public Painting savePainting(@RequestBody PaintingRequest request) {
        User user = userRepo.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Remove old painting if it exists
        paintingRepo.findByUser(user).ifPresent(paintingRepo::delete);

        Painting painting = new Painting();
        painting.setTitle(request.title());
        painting.setShapesData(request.shapesData());
        painting.setUser(user);
        painting.setCreatedAt(LocalDateTime.now());

        return paintingRepo.save(painting);
    }

    @GetMapping("/{userId}")
    public List<Painting> getPaintingsByUser(@PathVariable Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return paintingRepo.findByUser(user)
                .map(List::of)
                .orElse(List.of());
    }

    @GetMapping("/by-id/{paintingId}")
    public Painting getPaintingById(@PathVariable Long paintingId) {
        return paintingRepo.findById(paintingId)
                .orElseThrow(() -> new RuntimeException("Painting not found"));
    }

    public record PaintingRequest(Long userId, String title, String shapesData) {}
}
