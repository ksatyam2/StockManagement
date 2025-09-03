package com.ofss.web;

import com.ofss.domain.Transaction;
import com.ofss.repository.TransactionRepository;
import com.ofss.service.TransactionService;
import com.ofss.web.dto.TradeRequest;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService service;
    private final TransactionRepository txRepo;

    public TransactionController(TransactionService service, TransactionRepository txRepo) {
        this.service = service;
        this.txRepo = txRepo;
    }

    @GetMapping
    public List<Transaction> all() {
        return txRepo.findAll();
    }

    @PostMapping("/buy")
    public Transaction buy(@RequestBody @Validated TradeRequest req) {
        return service.buy(req.getCustomerId(), req.getStockId(), req.getQuantity());
    }

    @PostMapping("/sell")
    public Transaction sell(@RequestBody @Validated TradeRequest req) {
        return service.sell(req.getCustomerId(), req.getStockId(), req.getQuantity());
    }
}