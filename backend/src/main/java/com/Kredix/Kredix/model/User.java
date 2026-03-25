package com.Kredix.Kredix.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "tb_user")
@Getter
@Setter
public class User {

  @PrePersist
  @PreUpdate
  private void prepararDados() {
    if (this.name != null)
      this.name = this.name.toUpperCase().trim();
    if (this.lastname != null)
      this.lastname = this.lastname.toUpperCase().trim();
    if (this.id == null && this.createdAt == null) {
      this.createdAt = LocalDate.now();
    }
    if (this.cadStatus == null) {
      this.cadStatus = true;
    }
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
  private Bank bank;

  @NotBlank
  @Column(name = "name", length = 255)
  private String name;

  @NotBlank
  @Column(name = "lastname", length = 255)
  @com.fasterxml.jackson.annotation.JsonProperty("lastName")
  private String lastname;

  @NotBlank
  @Column(name = "email", nullable = false, unique = true, length = 255)
  private String email;

  @JsonFormat(pattern = "yyyy-MM-dd")
  @Column(name = "birth", columnDefinition = "DATE")
  private LocalDate birth;

  @NotBlank
  @JsonIgnore
  @Size(min = 6)
  @Column(name = "password", nullable = false, length = 255)
  private String password;

  @Column(name = "cad_status", nullable = false)
  private Boolean cadStatus;

  @Column(name = "created_at", updatable = false)
  private LocalDate createdAt;

  // Manual Getters and Setters to ensure build stability
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getLastname() { return lastname; }
  public void setLastname(String lastname) { this.lastname = lastname; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }
  public LocalDate getBirth() { return birth; }
  public void setBirth(LocalDate birth) { this.birth = birth; }
  public Boolean getCadStatus() { return cadStatus; }
  public void setCadStatus(Boolean cadStatus) { this.cadStatus = cadStatus; }
  public LocalDate getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}
