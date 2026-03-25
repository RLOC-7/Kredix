package com.Kredix.Kredix.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Setter;
import lombok.Getter;

@Entity
@Getter
@Setter
@Table(name = "tb_bank")
public class Bank {

  @PrePersist
  @PreUpdate
  private void prepararDados() {

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

  @OneToOne
  @JoinColumn(name = "user_id", nullable = false)
  @JsonIgnore
  private User user;

  private String agency;
  private Integer account;

  @Column(name = "cash_balance", nullable = false)
  private Double cashBalance;

  @Column(name = "bank_balance", nullable = false)
  private Double bankBalance;

  @Column(name = "investment_balance", nullable = false)
  private Double investmentBalance = 0.0;

  @Column(name = "cad_status", nullable = false)
  private Boolean cadStatus;

  @Column(name = "created_at", updatable = false)
  private LocalDate createdAt;

}
