package com.ofss.service;

import com.ofss.domain.Stock;
import com.ofss.repository.StockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class StockService {
    private final StockRepository stockRepo;

    public StockService(StockRepository stockRepo) {
        this.stockRepo = stockRepo;
    }

    public List<Stock> findAll() {
        return stockRepo.findAll();
    }

    public Stock findById(Long id) {
        return stockRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Stock not found: " + id));
    }

    public Stock create(Stock stock) {
        if (stockRepo.existsBySymbol11g(stock.getSymbol())) {
            throw new IllegalArgumentException("Symbol already exists: " + stock.getSymbol());
        }
        return stockRepo.save(stock);
    }

    @Transactional
    public Stock update(Long id, Stock update) {
        Stock s = this.findById(id);
        if (update.getName() != null) s.setName(update.getName());
        if (update.getPrice() != null) s.setPrice(update.getPrice());
        if (update.getQuantity() != null) s.setQuantity(update.getQuantity());
        return s;
    }

    public void delete(Long id) {
        stockRepo.deleteById(id);
    }
}