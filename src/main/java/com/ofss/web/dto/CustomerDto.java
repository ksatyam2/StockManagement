package com.ofss.web.dto;

import jakarta.validation.constraints.*;

public class CustomerDto {
    @NotBlank
    private String name;

    @NotBlank
    @Email
    @Size(max = 100)
    private String email;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}