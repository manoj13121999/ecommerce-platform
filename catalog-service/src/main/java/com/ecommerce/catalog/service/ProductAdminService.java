package com.ecommerce.catalog.service;

import com.ecommerce.catalog.dto.AdminProductPageResponse;
import com.ecommerce.catalog.dto.AdminProductResponse;
import com.ecommerce.catalog.dto.CreateProductRequest;
import com.ecommerce.catalog.dto.UpdateProductRequest;
import com.ecommerce.catalog.entity.Category;
import com.ecommerce.catalog.entity.Product;
import com.ecommerce.catalog.mapper.CatalogMapper;
import com.ecommerce.catalog.repository.CategoryRepository;
import com.ecommerce.catalog.repository.ProductRepository;
import com.ecommerce.catalog.util.SlugUtils;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProductAdminService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductIndexService productIndexService;

    public ProductAdminService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            ProductIndexService productIndexService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productIndexService = productIndexService;
    }

    @Transactional(readOnly = true)
    public AdminProductPageResponse listProducts(String query, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Product> products = productRepository.findForAdmin(normalizeQuery(query), pageable);
        List<AdminProductResponse> content = products.getContent().stream()
                .map(CatalogMapper::toAdminProductResponse)
                .toList();
        return new AdminProductPageResponse(
                content,
                products.getNumber(),
                products.getSize(),
                products.getTotalElements(),
                products.getTotalPages());
    }

    @Transactional(readOnly = true)
    public AdminProductResponse getProduct(Long id) {
        Product product = productRepository.findByIdWithCategory(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        return CatalogMapper.toAdminProductResponse(product);
    }

    @Transactional
    public AdminProductResponse createProduct(CreateProductRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found"));

        Product product = new Product();
        product.setCategory(category);
        applyRequest(product, request.name(), request.slug(), request.description(), request.price(),
                request.compareAtPrice(), request.stock(), request.imageUrl(),
                request.active() == null || request.active());
        product.setSlug(resolveUniqueSlug(product.getSlug(), null));

        Product saved = productRepository.save(product);
        productIndexService.indexProduct(saved);
        return CatalogMapper.toAdminProductResponse(saved);
    }

    @Transactional
    public AdminProductResponse updateProduct(Long id, UpdateProductRequest request) {
        Product product = productRepository.findByIdWithCategory(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found"));

        product.setCategory(category);
        applyRequest(product, request.name(), request.slug(), request.description(), request.price(),
                request.compareAtPrice(), request.stock(), request.imageUrl(), request.active());
        product.setSlug(resolveUniqueSlug(product.getSlug(), product.getId()));

        Product saved = productRepository.save(product);
        productIndexService.indexProduct(saved);
        return CatalogMapper.toAdminProductResponse(saved);
    }

    @Transactional
    public void deactivateProduct(Long id) {
        Product product = productRepository.findByIdWithCategory(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        product.setActive(false);
        productRepository.save(product);
        productIndexService.indexProduct(product);
    }

    private void applyRequest(
            Product product,
            String name,
            String slug,
            String description,
            java.math.BigDecimal price,
            java.math.BigDecimal compareAtPrice,
            int stock,
            String imageUrl,
            boolean active) {
        product.setName(name.trim());
        product.setSlug(resolveSlug(name, slug));
        product.setDescription(description.trim());
        product.setPrice(price);
        product.setCompareAtPrice(compareAtPrice);
        product.setStock(stock);
        product.setImageUrl(imageUrl == null ? null : imageUrl.trim());
        product.setActive(active);
    }

    private String resolveSlug(String name, String slug) {
        if (slug != null && !slug.isBlank()) {
            return SlugUtils.slugify(slug);
        }
        return SlugUtils.slugify(name);
    }

    private String resolveUniqueSlug(String baseSlug, Long productId) {
        String candidate = baseSlug;
        int suffix = 1;
        while (productId == null
                ? productRepository.existsBySlug(candidate)
                : productRepository.existsBySlugAndIdNot(candidate, productId)) {
            candidate = baseSlug + "-" + suffix;
            suffix += 1;
        }
        return candidate;
    }

    private String normalizeQuery(String query) {
        return query == null || query.isBlank() ? null : query.trim();
    }
}
