package com.ecommerce.catalog.service;

import com.ecommerce.catalog.document.ProductDocument;
import com.ecommerce.catalog.dto.ProductPageResponse;
import com.ecommerce.catalog.dto.ProductResponse;
import com.ecommerce.catalog.entity.Product;
import com.ecommerce.catalog.mapper.CatalogMapper;
import com.ecommerce.catalog.repository.ProductRepository;
import com.ecommerce.catalog.repository.ProductSearchRepository;
import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductSearchRepository productSearchRepository;

    public ProductService(
            ProductRepository productRepository,
            ProductSearchRepository productSearchRepository) {
        this.productRepository = productRepository;
        this.productSearchRepository = productSearchRepository;
    }

    @Transactional(readOnly = true)
    public ProductPageResponse listProducts(
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean inStock,
            int page,
            int size,
            String sort) {
        PageRequest pageable = PageRequest.of(page, size, ProductSortMapper.toSort(sort));
        Page<Product> products = productRepository.findActiveProducts(
                categoryId, minPrice, maxPrice, inStock, pageable);
        List<ProductResponse> content = products.getContent().stream()
                .map(CatalogMapper::toProductResponse)
                .toList();
        return new ProductPageResponse(
                content,
                products.getNumber(),
                products.getSize(),
                products.getTotalElements(),
                products.getTotalPages());
    }

    @Transactional(readOnly = true)
    public ProductPageResponse listDeals(int page, int size, String sort) {
        PageRequest pageable = PageRequest.of(page, size, ProductSortMapper.toSort(sort));
        Page<Product> products = productRepository.findDeals(pageable);
        List<ProductResponse> content = products.getContent().stream()
                .map(CatalogMapper::toProductResponse)
                .toList();
        return new ProductPageResponse(
                content,
                products.getNumber(),
                products.getSize(),
                products.getTotalElements(),
                products.getTotalPages());
    }

    @Transactional(readOnly = true)
    public ProductResponse getProduct(Long id) {
        Product product = productRepository.findActiveById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        return CatalogMapper.toProductResponse(product);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getRelatedProducts(Long id, int limit) {
        Product product = productRepository.findActiveById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        return productRepository
                .findRelatedProducts(
                        product.getCategory().getId(),
                        product.getId(),
                        PageRequest.of(0, limit))
                .stream()
                .map(CatalogMapper::toProductResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }

        return productRepository.findActiveByIds(ids).stream()
                .map(CatalogMapper::toProductResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductPageResponse searchProducts(String query, int page, int size) {
        if (query == null || query.isBlank()) {
            return new ProductPageResponse(List.of(), page, size, 0, 0);
        }

        String keyword = query.trim();
        List<ProductDocument> matches = productSearchRepository
                .findByNameContainingOrDescriptionContaining(keyword, keyword)
                .stream()
                .filter(ProductDocument::isActive)
                .sorted(Comparator.comparing(ProductDocument::getName))
                .toList();

        int totalElements = matches.size();
        int totalPages = size <= 0 ? 0 : (int) Math.ceil((double) totalElements / size);
        int fromIndex = Math.min(page * size, totalElements);
        int toIndex = Math.min(fromIndex + size, totalElements);

        List<ProductResponse> content = matches.subList(fromIndex, toIndex).stream()
                .map(doc -> productRepository.findActiveById(doc.getId()).orElse(null))
                .filter(Objects::nonNull)
                .map(CatalogMapper::toProductResponse)
                .toList();

        return new ProductPageResponse(content, page, size, totalElements, totalPages);
    }
}
