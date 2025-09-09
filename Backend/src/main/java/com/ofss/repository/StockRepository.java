package com.ofss.repository;

import com.ofss.domain.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, Long> {
    Optional<Stock> findBySymbol(String symbol);

    // Custom query compatible with Oracle 11g (NO "FETCH FIRST ... ROWS ONLY")
    @Query("SELECT (COUNT(s) > 0) FROM Stock s WHERE s.symbol = :symbol")
    boolean existsBySymbol11g(@Param("symbol") String symbol);
}