package com.Kredix.Kredix.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import java.util.Date;

@Component
public class JwtUtil {

  @Value("${jwt.secret}")
  private String secret;

  private static final long EXPIRATION_MS = 86400000L; // 24 horas

  private SecretKey getKey() {
    return Keys.hmacShaKeyFor(secret.getBytes());
  }

  /** Gera um token JWT com o email do usuário como subject */
  public String gerarToken(String email) {
    return Jwts.builder()
        .setSubject(email)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
        .signWith(getKey())
        .compact();
  }

  /** Extrai o email (subject) do token */
  public String extrairEmail(String token) {
    return extrairClaims(token).getSubject();
  }

  /** Valida se o token é válido e não expirou */
  public boolean validarToken(String token) {
    try {
      extrairClaims(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  private Claims extrairClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(getKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
  }
}