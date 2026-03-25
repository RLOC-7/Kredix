package com.Kredix.Kredix.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.Kredix.Kredix.dto.request.UserRequestDTO;
import com.Kredix.Kredix.config.JwtUtil;
import com.Kredix.Kredix.dto.request.LoginRequestDTO;
import com.Kredix.Kredix.dto.response.UserResponseDTO;
import com.Kredix.Kredix.dto.response.BankResponseDTO;
import com.Kredix.Kredix.dto.response.LoginResponseDTO;
import com.Kredix.Kredix.model.Bank;
import com.Kredix.Kredix.model.User;
import com.Kredix.Kredix.repository.BankRepository;
import com.Kredix.Kredix.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

  private final UserRepository repository;
  private final BankRepository bankRepository;
  private final JwtUtil jwtUtil;
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  public UserService(UserRepository repository, BankRepository bankRepository, JwtUtil jwtUtil) {
    this.repository = repository;
    this.bankRepository = bankRepository;
    this.jwtUtil = jwtUtil;
  }

  // ===== REGRAS DE NEGOCIO =====
  @Transactional
  public User salvarNovoUsuario(UserRequestDTO dto) {
    if (dto.name() == null || dto.name().isEmpty())
      throw new IllegalArgumentException("Nome é obrigatório!");
    if (dto.lastname() == null || dto.lastname().isEmpty())
      throw new IllegalArgumentException("Sobrenome é obrigatório!");

    User usuario = new User();
    usuario.setName(dto.name());
    usuario.setLastname(dto.lastname());
    usuario.setEmail(dto.email());
    usuario.setPassword(passwordEncoder.encode(dto.password()));
    usuario.setCadStatus(dto.cadStatus());
    usuario.setBirth(dto.birth());

    User usuarioSalvo = repository.save(usuario);

    Bank novaConta = new Bank();
    novaConta.setUser(usuarioSalvo);
    novaConta.setCashBalance(5000000.0);
    novaConta.setBankBalance(1500000.0);
    novaConta.setAgency("0001");

    int numeroConta;
    boolean isUnico = false;
    do {
      numeroConta = (int) (Math.random() * 9000) + 1000;
      if (bankRepository.findByAccount(numeroConta).isEmpty()) {
        isUnico = true;
      }
    } while (!isUnico);

    novaConta.setAccount(numeroConta);

    bankRepository.save(novaConta);

    return usuarioSalvo;
  }

  public List<User> salvarMuitos(List<User> lista) {
    lista.forEach(u -> {
      if (u.getCadStatus() == null)
        u.setCadStatus(true);
    });
    return repository.saveAll(lista);
  }

  // ===== AUTENTICAÇÃO =====

  public LoginResponseDTO login(LoginRequestDTO dto) {
    Optional<User> userOpt = repository.findByEmail(dto.getEmail());

    if (userOpt.isEmpty()) {
      throw new RuntimeException("Usuário não encontrado");
    }

    User user = userOpt.get();

    if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
      throw new RuntimeException("Senha incorreta");
    }

    // Gera JWT real com o email como subject
    String token = jwtUtil.gerarToken(user.getEmail());

    return new LoginResponseDTO(user, token);
  }

  // BUSCA USER PELO EMAIL EXTRACT DO TOKEN JWT
  public User buscarUsuarioPorToken(String token) {
    if (!jwtUtil.validarToken(token)) {
      return null;
    }
    String email = jwtUtil.extrairEmail(token);
    return repository.findByEmail(email).orElse(null);
  }

  public BankResponseDTO buscarDadosBancarios(String token) {
    User user = buscarUsuarioPorToken(token);

    Bank bank = bankRepository.findByUser(user)

        .orElseThrow(() -> new RuntimeException("Dados bancários não encontrados para o usuário"));

    return new BankResponseDTO(
        bank.getAgency().toString(),
        bank.getAccount().toString(),
        bank.getCashBalance(),
        bank.getBankBalance(),
        bank.getInvestmentBalance(),
        user.getCadStatus());
  }

  // Atualiza o perfil do usuário logado identificado pelo token
  public UserResponseDTO atualizarPorToken(String token, UserRequestDTO dto) {
    User user = buscarUsuarioPorToken(token);
    if (user == null) {
      throw new RuntimeException("Usuário não autenticado ou não encontrado");
    }

    // Atualiza apenas os campos permitidos
    if (dto.name() != null)
      user.setName(dto.name());
    if (dto.lastname() != null)
      user.setLastname(dto.lastname());
    if (dto.birth() != null)
      user.setBirth(dto.birth());

    User saved = repository.save(user);

    return new UserResponseDTO(
        saved.getId(),
        saved.getName(),
        saved.getLastname(),
        saved.getEmail(),
        saved.getCreatedAt());
  }

  // Altera a senha do usuário logado validando a senha atual
  public void alterarSenha(String token, String currentPassword, String newPassword) {
    User user = buscarUsuarioPorToken(token);
    if (user == null) {
      throw new RuntimeException("Usuário não autenticado ou não encontrado");
    }

    // Valida se a senha atual fornecida bate com a hash no banco de dados
    if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
      throw new RuntimeException("A senha atual está incorreta.");
    }

    // Hasheia e salva a nova senha
    user.setPassword(passwordEncoder.encode(newPassword));
    repository.save(user);
  }

  // ===== OPERAÇÕES DE BANCO =====
  public Optional<User> buscarPorId(Long id) {
    if (id == null) {
      throw new IllegalArgumentException("ID do usuário não pode ser nulo");
    }
    return repository.findById(id);
  }

  public List<User> listarTodos() {
    return repository.findAll();
  }

  public User atualizar(Long id, User dados) {
    if (id == null) {
      throw new IllegalArgumentException("ID do usuário não pode ser nulo");
    }
    return repository.findById(id).map(reg -> {
      reg.setName(dados.getName());
      reg.setLastname(dados.getLastname());
      reg.setBirth(dados.getBirth());
      reg.setCadStatus(dados.getCadStatus());
      return repository.save(reg);
    }).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
  }

  public void deletar(Long id) {
    if (id == null) {
      throw new IllegalArgumentException("ID do usuário não pode ser nulo");
    }
    repository.deleteById(id);
  }

}
