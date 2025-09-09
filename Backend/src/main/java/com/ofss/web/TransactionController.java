package com.ofss.web;

import com.ofss.domain.Transaction;
import com.ofss.domain.User;
import com.ofss.repository.TransactionRepository;
import com.ofss.repository.UserRepository;
import com.ofss.service.TransactionService;
import com.ofss.web.dto.TradeRequest;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService service;
    private final TransactionRepository txRepo;
    private final UserRepository userRepo;

    public TransactionController(TransactionService service, TransactionRepository txRepo, UserRepository userRepo) {
        this.service = service;
        this.txRepo = txRepo;
        this.userRepo = userRepo;
    }

    // ROLE-based filtering: admin=all, customer=own only
    @GetMapping
    public List<Transaction> all(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepo.findByUsername(username).orElseThrow();
        if ("ADMIN".equals(user.getRole())) {
            return txRepo.findAll();
        } else if ("CUSTOMER".equals(user.getRole())) {
            Long customerId = user.getCustomer().getCustomerId();
            return txRepo.findAll().stream()
                .filter(tx -> tx.getCustomer().getCustomerId().equals(customerId))
                .collect(Collectors.toList());
        }
        return List.of();
    }

    @PostMapping("/buy")
    public Transaction buy(@RequestBody @Validated TradeRequest req, Authentication authentication) {
        // Optionally: enforce the authenticated user only for their own ID, if CUSTOMER
        String username = authentication.getName();
        User user = userRepo.findByUsername(username).orElseThrow();
        if ("CUSTOMER".equals(user.getRole()) && !user.getCustomer().getCustomerId().equals(req.getCustomerId())) {
            throw new SecurityException("Customers can only buy for their own account");
        }
        return service.buy(req.getCustomerId(), req.getStockId(), req.getQuantity());
    }

    @PostMapping("/sell")
    public Transaction sell(@RequestBody @Validated TradeRequest req, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepo.findByUsername(username).orElseThrow();
        if ("CUSTOMER".equals(user.getRole()) && !user.getCustomer().getCustomerId().equals(req.getCustomerId())) {
            throw new SecurityException("Customers can only sell for their own account");
        }
        return service.sell(req.getCustomerId(), req.getStockId(), req.getQuantity());
    }
}