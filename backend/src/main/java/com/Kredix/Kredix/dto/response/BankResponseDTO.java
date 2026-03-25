package com.Kredix.Kredix.dto.response;

public record BankResponseDTO(
    String agency,
    String account,
    Double cashBalance,
    Double bankBalance,
    Double investmentBalance,
    Boolean cadStatus) {

}
