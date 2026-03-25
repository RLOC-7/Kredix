package com.Kredix.Kredix.dto.response;

import java.time.LocalDateTime;

public record TransactionResponseDTO(
    Long id,
    String type,
    Double amount,
    String description,
    LocalDateTime createdAt
) {
}
