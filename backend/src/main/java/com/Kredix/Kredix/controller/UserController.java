package com.Kredix.Kredix.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.stream.Collectors;

import com.Kredix.Kredix.dto.response.UserResponseDTO;
import com.Kredix.Kredix.dto.request.LoginRequestDTO;
import com.Kredix.Kredix.dto.response.LoginResponseDTO;
import com.Kredix.Kredix.dto.response.BankResponseDTO;
import com.Kredix.Kredix.service.UserService;
import com.Kredix.Kredix.dto.request.UserRequestDTO;
import com.Kredix.Kredix.model.User;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/user")
public class UserController {

  public UserController(UserService service) {
    this.service = service;
  }

  private final UserService service;

  @PostMapping("/login")
  public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO dto) {
    try {
      // Chama o service para autenticar
      LoginResponseDTO response = service.login(dto);
      return ResponseEntity.ok(response);
    } catch (RuntimeException e) {
      // Retorna 401 Unauthorized se email/senha inválidos
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(null);
    }
  }

  @GetMapping("/extract")
  public ResponseEntity<BankResponseDTO> extract(@RequestHeader("Authorization") String authHeader) {
    try {
      if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String token = authHeader.replace("Bearer ", "");

      // O Service agora faz todo o trabalho de validação e busca
      BankResponseDTO response = service.buscarDadosBancarios(token);

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      // Se o token for falso ou a conta não existir, cai aqui
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
  }

  @PostMapping
  public ResponseEntity<UserResponseDTO> create(@RequestBody UserRequestDTO dto) {
    return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(service.salvarNovoUsuario(dto)));
  }

  // READ - Busca por ID
  @GetMapping("/{id}")
  public ResponseEntity<UserResponseDTO> buscarPorId(@PathVariable Long id) {
    return service.buscarPorId(id)
        .map(user -> ResponseEntity.ok(toDTO(user)))
        .orElse(ResponseEntity.notFound().build());
  }

  // READ ALL - LISTA TODOS REGISTROS DE USUÁRIO DO BANCO
  @GetMapping
  public ResponseEntity<List<UserResponseDTO>> listarTodos() {
    List<UserResponseDTO> lista = service.listarTodos().stream().map(this::toDTO).collect(Collectors.toList());
    return ResponseEntity.ok(lista);
  }

  // UPDATE - ATUALIZA USUÁRIO EXISTENTE NO BANCO
  @PutMapping("/{id}")
  public ResponseEntity<UserResponseDTO> atualizar(@PathVariable Long id, @RequestBody UserRequestDTO dados) {
    try {
      User user = new User();
      user.setName(dados.name());
      user.setLastname(dados.lastname());
      user.setBirth(dados.birth());
      user.setCadStatus(dados.cadStatus());
      return ResponseEntity.ok(toDTO(service.atualizar(id, user)));
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }
  }

  // DELETE - REMOVE USUÁRIO DO BANCO
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletar(@PathVariable Long id) {
    service.deletar(id);
    return ResponseEntity.noContent().build();

  }

  private UserResponseDTO toDTO(User user) {
    return new UserResponseDTO(user.getId(), user.getName(), user.getLastname(), user.getEmail(), user.getCreatedAt());
  }
}
