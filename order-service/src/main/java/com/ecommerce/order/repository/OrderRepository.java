package com.ecommerce.order.repository;

import com.ecommerce.order.entity.Order;
import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Order> findByIdAndUserId(Long id, Long userId);

    @Query("""
            SELECT o FROM Order o
            WHERE (:status IS NULL OR :status = '' OR o.status = :status)
            ORDER BY o.createdAt DESC
            """)
    Page<Order> findForAdmin(@Param("status") String status, Pageable pageable);

    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countGroupedByStatus();

    @Query("""
            SELECT COALESCE(SUM(o.subtotal), 0) FROM Order o
            WHERE o.status IN :statuses
            """)
    BigDecimal sumSubtotalByStatusIn(@Param("statuses") Collection<String> statuses);
}
