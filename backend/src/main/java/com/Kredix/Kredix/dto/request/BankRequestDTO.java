package com.Kredix.Kredix.dto.request;

public record BankRequestDTO(
    String agencia,
    String account,
    Double cashBalance,
    Double bankBalance,
    Boolean cadStatus
) {
}