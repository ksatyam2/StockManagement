package com.ofss.web;

import com.ofss.domain.Stock;
import com.ofss.service.StockService;
import com.ofss.web.dto.StockDto;
import org.springframework.beans.BeanUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    private final StockService service;

    public StockController(StockService service) {
        this.service = service;
    }

    @GetMapping
    public List<Stock> all() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Stock get(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public Stock create(@RequestBody @Validated StockDto dto) {
        Stock s = new Stock();
        BeanUtils.copyProperties(dto, s);
        return service.create(s);
    }

    @PutMapping("/{id}")
    public Stock update(@PathVariable Long id, @RequestBody @Validated StockDto dto) {
        Stock s = new Stock();
        BeanUtils.copyProperties(dto, s);
        return service.update(id, s);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}