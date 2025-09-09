package com.ofss.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
@SequenceGenerator(name = "users_seq_gen", sequenceName = "users_seq", allocationSize = 1)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_seq_gen")
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(nullable = false, length = 255)
    private String password; // Store hashed password

    @Column(nullable = false, length = 20)
    private String role; // "ADMIN" or "CUSTOMER"

    @OneToOne
    @JoinColumn(name = "customer_id")
    private Customer customer; // Nullable for admin users

    // Getters and Setters

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public Customer getCustomer() {
        return customer;
    }
    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
}