package com.Kredix.Kredix.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Kredix.Kredix.model.Bank;
import com.Kredix.Kredix.model.Transaction;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByBankOrderByCreatedAtDesc(Bank bank);
}
