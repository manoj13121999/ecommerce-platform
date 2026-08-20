package com.ecommerce.catalog.repository;

import com.ecommerce.catalog.entity.Product;
import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("""
            SELECT p FROM Product p
            JOIN p.category c
            WHERE p.active = true
            AND (:categoryId IS NULL OR c.id = :categoryId)
            AND (:minPrice IS NULL OR p.price >= :minPrice)
            AND (:maxPrice IS NULL OR p.price <= :maxPrice)
            AND (:inStock IS NULL OR (:inStock = TRUE AND p.stock > 0) OR (:inStock = FALSE AND p.stock = 0))
            """)
    Page<Product> findActiveProducts(
            @Param("categoryId") Long categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("inStock") Boolean inStock,
            Pageable pageable);

    @Query("""
            SELECT p FROM Product p
            JOIN FETCH p.category c
            WHERE p.id = :id AND p.active = true
            """)
    java.util.Optional<Product> findActiveById(@Param("id") Long id);

    @Query("""
            SELECT p FROM Product p
            JOIN FETCH p.category c
            WHERE p.active = true
            AND p.compareAtPrice IS NOT NULL
            AND p.compareAtPrice > p.price
            """)
    Page<Product> findDeals(Pageable pageable);

    @Query("""
            SELECT p FROM Product p
            JOIN FETCH p.category c
            WHERE p.active = true
            AND c.id = :categoryId
            AND p.id <> :productId
            ORDER BY p.createdAt DESC
            """)
    List<Product> findRelatedProducts(
            @Param("categoryId") Long categoryId,
            @Param("productId") Long productId,
            Pageable pageable);

    @Query("""
            SELECT p FROM Product p
            JOIN FETCH p.category c
            WHERE p.active = true
            AND p.id IN :ids
            """)
    List<Product> findActiveByIds(@Param("ids") Collection<Long> ids);

    @Query("""
            SELECT p.category.id, COUNT(p)
            FROM Product p
            WHERE p.active = true
            GROUP BY p.category.id
            """)
    List<Object[]> countActiveProductsByCategory();

    @Query("""
            SELECT p FROM Product p
            JOIN FETCH p.category c
            WHERE (:query IS NULL OR :query = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')))
            """)
    Page<Product> findForAdmin(@Param("query") String query, Pageable pageable);

    @Query("""
            SELECT p FROM Product p
            JOIN FETCH p.category c
            WHERE p.id = :id
            """)
    java.util.Optional<Product> findByIdWithCategory(@Param("id") Long id);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);
}
