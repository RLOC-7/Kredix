package com.Kredix.Kredix.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Kredix.Kredix.model.Bank;
import com.Kredix.Kredix.model.User;

@Repository
public interface BankRepository extends JpaRepository<Bank, Long> {
  Optional<Bank> findByUser(User user);

  Optional<Bank> findByUserId(Long userId);

  Optional<Bank> findByAccount(Integer account);
}