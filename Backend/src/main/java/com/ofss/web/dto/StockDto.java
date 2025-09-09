package com.ofss.web.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class StockDto {
    @NotBlank
    private String name;

    @NotBlank
    @Size(max = 10)
    private String symbol;

    @NotNull
    @Digits(integer = 8, fraction = 2)
    @DecimalMin(value = "0.00", inclusive = true)
    private BigDecimal price;

    @NotNull
    @Min(0)
    private Integer quantity;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}