package com.Kredix.Kredix.dto.response;

import com.Kredix.Kredix.model.User;

public class LoginResponseDTO {
  private User user;
  private String token;

  public LoginResponseDTO(User user, String token) {
    this.user = user;
    this.token = token;
  }

  public User getUser() {
    return user;
  }

  public String getToken() {
    return token;
  }
}