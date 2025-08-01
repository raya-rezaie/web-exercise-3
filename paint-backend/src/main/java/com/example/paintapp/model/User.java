package com.example.paintapp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "app_user")  // rename the table here
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private Long id;

    @Column(unique = true)
    private String username;

    private String displayName;
}

