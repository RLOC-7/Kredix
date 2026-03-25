package com.Kredix.Kredix.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record TransferRequestDTO(
    @NotNull(message = "A conta de destino não pode ser nula")
    Integer targetAccount,
    
    @NotNull(message = "O valor não pode ser nulo")
    @Positive(message = "O valor deve ser maior que zero")
    Double amount
) {
}
