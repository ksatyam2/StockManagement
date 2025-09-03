package com.ofss.repository;

import com.ofss.domain.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @Query("select coalesce(sum(case when t.transactionType = 'BUY' then t.quantity " +
           "when t.transactionType = 'SELL' then -t.quantity else 0 end), 0) " +
           "from Transaction t where t.customer.customerId = :customerId and t.stock.stockId = :stockId")
    Integer getNetHoldings(Long customerId, Long stockId);
}