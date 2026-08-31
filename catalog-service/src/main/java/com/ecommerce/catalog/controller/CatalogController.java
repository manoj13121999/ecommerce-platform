package com.ecommerce.catalog.controller;

import com.ecommerce.catalog.dto.CategoryResponse;
import com.ecommerce.catalog.dto.ProductPageResponse;
import com.ecommerce.catalog.dto.ProductResponse;
import com.ecommerce.catalog.dto.ValidateItemsRequest;
import com.ecommerce.catalog.dto.ValidateItemsResponse;
import com.ecommerce.catalog.service.CategoryService;
import com.ecommerce.catalog.service.ProductService;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CatalogController {

    private final CategoryService categoryService;
    private final ProductService productService;

    public CatalogController(CategoryService categoryService, ProductService productService) {
        this.categoryService = categoryService;
        this.productService = productService;
    }

    @GetMapping("/categories")
    public List<CategoryResponse> listCategories() {
        return categoryService.listCategories();
    }

    @GetMapping("/products")
    public ProductPageResponse listProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "name_asc") String sort) {
        return productService.listProducts(categoryId, minPrice, maxPrice, inStock, page, size, sort);
    }

    @GetMapping("/products/deals")
    public ProductPageResponse listDeals(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "price_asc") String sort) {
        return productService.listDeals(page, size, sort);
    }

    @GetMapping("/products/by-ids")
    public List<ProductResponse> getProductsByIds(@RequestParam("ids") String ids) {
        List<Long> productIds = Arrays.stream(ids.split(","))
                .map(String::trim)
                .filter(value -> !value.isEmpty())
                .map(Long::valueOf)
                .toList();
        return productService.getProductsByIds(productIds);
    }

    @GetMapping("/products/search")
    public ProductPageResponse searchProducts(
            @RequestParam("q") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return productService.searchProducts(query, page, size);
    }

    @PostMapping("/products/validate")
    public ValidateItemsResponse validateItems(@Valid @RequestBody ValidateItemsRequest request) {
        return productService.validateItems(request);
    }

    @GetMapping("/products/{id}")
    public ProductResponse getProduct(@PathVariable Long id) {
        return productService.getProduct(id);
    }

    @GetMapping("/products/{id}/related")
    public List<ProductResponse> getRelatedProducts(
            @PathVariable Long id,
            @RequestParam(defaultValue = "4") int limit) {
        return productService.getRelatedProducts(id, limit);
    }
}
