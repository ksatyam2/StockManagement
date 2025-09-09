package com.ofss.repository;

import com.ofss.domain.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // ✅ Net holdings for a given customer and stock
    @Query("select coalesce(sum(case when t.transactionType = 'BUY' then t.quantity " +
           "when t.transactionType = 'SELL' then -t.quantity else 0 end), 0) " +
           "from Transaction t where t.customer.customerId = :customerId and t.stock.stockId = :stockId")
    Integer getNetHoldings(@Param("customerId") Long customerId,
                           @Param("stockId") Long stockId);

    // ✅ All transactions for a given customer
    List<Transaction> findByCustomerCustomerId(Long customerId);
}
