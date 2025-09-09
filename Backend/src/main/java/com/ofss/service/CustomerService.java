package com.ofss.service;

import com.ofss.domain.Customer;
import com.ofss.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CustomerService {
    private final CustomerRepository repo;

    public CustomerService(CustomerRepository repo) {
        this.repo = repo;
    }

    public List<Customer> findAll() {
        return repo.findAll();
    }

    public Customer findById(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + id));
    }

    public Customer create(Customer c) {
        return repo.save(c);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
    
    @Transactional
    public Customer update(Long id, Customer updated) {
        Customer c = findById(id);
        if (updated.getName() != null) c.setName(updated.getName());
        if (updated.getEmail() != null) c.setEmail(updated.getEmail());
        return c;
    }
}