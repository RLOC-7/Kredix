package com.Kredix.Kredix.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Kredix.Kredix.repository.BankRepository;
import com.Kredix.Kredix.repository.TransactionRepository;
import com.Kredix.Kredix.model.Bank;
import com.Kredix.Kredix.model.User;
import com.Kredix.Kredix.model.Transaction;
import com.Kredix.Kredix.dto.request.TransferRequestDTO;
import com.Kredix.Kredix.dto.response.BankResponseDTO;
import com.Kredix.Kredix.dto.response.TransactionResponseDTO;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.scheduling.annotation.Scheduled;

@Service
public class TransactionService {

    private final UserService userService;
    private final BankRepository bankRepository;
    private final TransactionRepository transactionRepository;
    private final NotificationService notificationService;

    public TransactionService(UserService userService, BankRepository bankRepository, TransactionRepository transactionRepository, NotificationService notificationService) {
        this.userService = userService;
        this.bankRepository = bankRepository;
        this.transactionRepository = transactionRepository;
        this.notificationService = notificationService;
    }

    private Bank getOrigemBank(String token) {
        User user = userService.buscarUsuarioPorToken(token);
        if (user == null) {
            throw new RuntimeException("Usuário não autenticado");
        }
        return bankRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Conta bancária não encontrada para o usuário"));
    }

    @Transactional
    public BankResponseDTO depositar(String token, Double amount) {
        Bank bank = getOrigemBank(token);
        if (bank.getCashBalance() < amount) {
            throw new RuntimeException("Saldo insuficiente em dinheiro físico (CashBalance)");
        }
        bank.setCashBalance(bank.getCashBalance() - amount);
        bank.setBankBalance(bank.getBankBalance() + amount);
        
        Bank saved = bankRepository.save(bank);

        Transaction t = new Transaction();
        t.setBank(saved);
        t.setType("DEPOSIT");
        t.setAmount(amount);
        t.setDescription("Depósito em conta");
        transactionRepository.save(t);

        return toDTO(saved);
    }

    @Transactional
    public BankResponseDTO sacar(String token, Double amount) {
        Bank bank = getOrigemBank(token);
        if (bank.getBankBalance() < amount) {
            throw new RuntimeException("Saldo bancário insuficiente");
        }
        bank.setBankBalance(bank.getBankBalance() - amount);
        bank.setCashBalance(bank.getCashBalance() + amount);
        
        Bank saved = bankRepository.save(bank);

        Transaction t = new Transaction();
        t.setBank(saved);
        t.setType("WITHDRAW");
        t.setAmount(amount);
        t.setDescription("Saque em espécie");
        transactionRepository.save(t);

        return toDTO(saved);
    }

    @Transactional
    public BankResponseDTO investir(String token, Double amount) {
        Bank bank = getOrigemBank(token);
        if (bank.getBankBalance() < amount) {
            throw new RuntimeException("Saldo bancário insuficiente para investir");
        }
        bank.setBankBalance(bank.getBankBalance() - amount);
        bank.setInvestmentBalance(bank.getInvestmentBalance() + amount);
        
        Bank saved = bankRepository.save(bank);

        Transaction t = new Transaction();
        t.setBank(saved);
        t.setType("INVEST");
        t.setAmount(amount);
        t.setDescription("Aplicação em Investimento");
        transactionRepository.save(t);

        return toDTO(saved);
    }

    @Transactional
    public BankResponseDTO resgatar(String token, Double amount) {
        Bank bank = getOrigemBank(token);
        if (bank.getInvestmentBalance() < amount) {
            throw new RuntimeException("Saldo de investimento insuficiente para resgate");
        }
        bank.setInvestmentBalance(bank.getInvestmentBalance() - amount);
        bank.setBankBalance(bank.getBankBalance() + amount);
        
        Bank saved = bankRepository.save(bank);

        Transaction t = new Transaction();
        t.setBank(saved);
        t.setType("REDEEM");
        t.setAmount(amount);
        t.setDescription("Resgate de Investimento");
        transactionRepository.save(t);

        return toDTO(saved);
    }

    /**
     * Roda todos os dias à meia-noite (cron = "0 0 0 * * *")
     * Para demonstração, você pode alterar para rodar mais rápido, ex: @Scheduled(fixedRate = 60000)
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void applyDailyYield() {
        List<Bank> banks = bankRepository.findAll();
        for (Bank bank : banks) {
            if (bank.getInvestmentBalance() > 0) {
                Double yield = bank.getInvestmentBalance() * 0.50; // 50% ao dia
                bank.setInvestmentBalance(bank.getInvestmentBalance() + yield);
                bankRepository.save(bank);

                Transaction t = new Transaction();
                t.setBank(bank);
                t.setType("YIELD");
                t.setAmount(yield);
                t.setDescription("Rendimento diário (50%)");
                transactionRepository.save(t);
                
                // Opcional: Notificar o usuário se ele estiver online
                notificationService.notifyUser(bank.getUser().getId(), "yield", "Seu investimento rendeu R$ " + String.format("%.2f", yield));
            }
        }
    }

    @Transactional
    public BankResponseDTO transferir(String token, TransferRequestDTO dto) {
        Bank origem = getOrigemBank(token);
        if (origem.getBankBalance() < dto.amount()) {
            throw new RuntimeException("Saldo bancário insuficiente para transferência");
        }
        if (origem.getAccount().equals(dto.targetAccount())) {
            throw new RuntimeException("Não é possível transferir para a própria conta");
        }

        Bank destino = bankRepository.findByAccount(dto.targetAccount())
                .orElseThrow(() -> new RuntimeException("Conta de destino não encontrada"));

        origem.setBankBalance(origem.getBankBalance() - dto.amount());
        destino.setBankBalance(destino.getBankBalance() + dto.amount());

        bankRepository.save(destino);
        Bank saved = bankRepository.save(origem);
        
        Transaction tOut = new Transaction();
        tOut.setBank(saved);
        tOut.setType("TRANSFER_OUT");
        tOut.setAmount(dto.amount());
        tOut.setDescription("Transferência enviada para " + destino.getUser().getName() + " " + destino.getUser().getLastname() + " (Conta " + destino.getAccount() + ")");
        transactionRepository.save(tOut);

        Transaction tIn = new Transaction();
        tIn.setBank(destino);
        tIn.setType("TRANSFER_IN");
        tIn.setAmount(dto.amount());
        tIn.setDescription("Transferência recebida de " + origem.getUser().getName() + " " + origem.getUser().getLastname() + " (Conta " + origem.getAccount() + ")");
        transactionRepository.save(tIn);

        // Notify recipient in real-time
        String notificationMsg = "Você recebeu R$ " + String.format("%.2f", dto.amount()) + " de " + origem.getUser().getName();
        notificationService.notifyUser(destino.getUser().getId(), "transfer", notificationMsg);

        return toDTO(saved);
    }

    public List<TransactionResponseDTO> getHistory(String token) {
        Bank bank = getOrigemBank(token);
        List<Transaction> transactions = transactionRepository.findByBankOrderByCreatedAtDesc(bank);
        return transactions.stream().map(t -> new TransactionResponseDTO(
            t.getId(),
            t.getType(),
            t.getAmount(),
            t.getDescription(),
            t.getCreatedAt()
        )).collect(Collectors.toList());
    }

    private BankResponseDTO toDTO(Bank bank) {
        return new BankResponseDTO(
            bank.getAgency().toString(),
            bank.getAccount().toString(),
            bank.getCashBalance(),
            bank.getBankBalance(),
            bank.getInvestmentBalance(),
            bank.getUser().getCadStatus()
        );
    }
}
