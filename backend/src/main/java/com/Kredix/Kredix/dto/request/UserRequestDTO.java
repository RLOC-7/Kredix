package com.Kredix.Kredix.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserRequestDTO(

    @NotBlank String name,
    @NotBlank String lastname,
    LocalDate birth,
    @NotBlank @Email String email,
    String password,
    Boolean cadStatus
) {
}
