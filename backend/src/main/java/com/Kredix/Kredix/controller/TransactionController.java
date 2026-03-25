package com.Kredix.Kredix.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import com.Kredix.Kredix.service.TransactionService;
import com.Kredix.Kredix.dto.request.TransactionRequestDTO;
import com.Kredix.Kredix.dto.request.TransferRequestDTO;
import com.Kredix.Kredix.dto.response.BankResponseDTO;
import com.Kredix.Kredix.dto.response.TransactionResponseDTO;
import java.util.List;

@RestController
@RequestMapping("/api/transaction")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/deposit")
    public ResponseEntity<BankResponseDTO> deposit(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody TransactionRequestDTO dto) {
        String cleanToken = token.replace("Bearer ", "");
        BankResponseDTO response = transactionService.depositar(cleanToken, dto.amount());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<BankResponseDTO> withdraw(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody TransactionRequestDTO dto) {
        String cleanToken = token.replace("Bearer ", "");
        BankResponseDTO response = transactionService.sacar(cleanToken, dto.amount());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/transfer")
    public ResponseEntity<BankResponseDTO> transfer(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody TransferRequestDTO dto) {
        String cleanToken = token.replace("Bearer ", "");
        BankResponseDTO response = transactionService.transferir(cleanToken, dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/invest")
    public ResponseEntity<BankResponseDTO> invest(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody TransactionRequestDTO dto) {
        String cleanToken = token.replace("Bearer ", "");
        BankResponseDTO response = transactionService.investir(cleanToken, dto.amount());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/redeem")
    public ResponseEntity<BankResponseDTO> redeem(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody TransactionRequestDTO dto) {
        String cleanToken = token.replace("Bearer ", "");
        BankResponseDTO response = transactionService.resgatar(cleanToken, dto.amount());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<TransactionResponseDTO>> getHistory(
            @RequestHeader("Authorization") String token) {
        String cleanToken = token.replace("Bearer ", "");
        List<TransactionResponseDTO> history = transactionService.getHistory(cleanToken);
        return ResponseEntity.ok(history);
    }
}
