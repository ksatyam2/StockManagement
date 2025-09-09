package com.ofss.service;

import com.ofss.domain.Customer;
import com.ofss.domain.Stock;
import com.ofss.domain.Transaction;
import com.ofss.repository.CustomerRepository;
import com.ofss.repository.StockRepository;
import com.ofss.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransactionService {

    private final TransactionRepository txRepo;
    private final CustomerRepository customerRepo;
    private final StockRepository stockRepo;

    public TransactionService(TransactionRepository txRepo, CustomerRepository customerRepo, StockRepository stockRepo) {
        this.txRepo = txRepo;
        this.customerRepo = customerRepo;
        this.stockRepo = stockRepo;
    }

    @Transactional
    public Transaction buy(Long customerId, Long stockId, Integer qty) {
        if (qty == null || qty <= 0) throw new IllegalArgumentException("Quantity must be > 0");
        Customer customer = customerRepo.findById(customerId)
            .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        Stock stock = stockRepo.findById(stockId)
            .orElseThrow(() -> new IllegalArgumentException("Stock not found"));

        if (stock.getQuantity() < qty)
            throw new IllegalStateException("Insufficient stock quantity");

        stock.setQuantity(stock.getQuantity() - qty);

        Transaction tx = new Transaction();
        tx.setCustomer(customer);
        tx.setStock(stock);
        tx.setTransactionType("BUY");
        tx.setQuantity(qty);
        return txRepo.save(tx);
    }

    @Transactional
    public Transaction sell(Long customerId, Long stockId, Integer qty) {
        if (qty == null || qty <= 0) throw new IllegalArgumentException("Quantity must be > 0");
        Customer customer = customerRepo.findById(customerId)
            .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        Stock stock = stockRepo.findById(stockId)
            .orElseThrow(() -> new IllegalArgumentException("Stock not found"));

        Integer net = txRepo.getNetHoldings(customerId, stockId);
        if (net == null) net = 0;
        if (net < qty) throw new IllegalStateException("Customer does not have enough holdings to sell");

        stock.setQuantity(stock.getQuantity() + qty);

        Transaction tx = new Transaction();
        tx.setCustomer(customer);
        tx.setStock(stock);
        tx.setTransactionType("SELL");
        tx.setQuantity(qty);
        return txRepo.save(tx);
    }
}