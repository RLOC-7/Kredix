package com.Kredix.Kredix.dto.response;

import java.time.LocalDate;

public record UserResponseDTO(
    Long id,
    String name,
    String lastname,
    String email,
    LocalDate createdAt) {
}