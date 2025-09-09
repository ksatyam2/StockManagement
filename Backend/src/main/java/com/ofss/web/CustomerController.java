package com.ofss.web;

import com.ofss.domain.Customer;
import com.ofss.service.CustomerService;
import com.ofss.web.dto.CustomerDto;
import org.springframework.beans.BeanUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @GetMapping
    public List<Customer> all() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Customer get(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public Customer create(@RequestBody @Validated CustomerDto dto) {
        Customer c = new Customer();
        BeanUtils.copyProperties(dto, c);
        return service.create(c);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
    
    @PutMapping("/{id}")
    public Customer update(@PathVariable Long id, @RequestBody @Validated CustomerDto dto) {
        Customer c = new Customer();
        BeanUtils.copyProperties(dto, c);
        c.setCustomerId(id); // ensure ID is set for update
        return service.update(id, c);
    }
}