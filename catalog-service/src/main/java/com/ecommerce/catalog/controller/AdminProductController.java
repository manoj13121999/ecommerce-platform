package com.ecommerce.catalog.controller;

import com.ecommerce.catalog.dto.AdminProductPageResponse;
import com.ecommerce.catalog.dto.AdminProductResponse;
import com.ecommerce.catalog.dto.CreateProductRequest;
import com.ecommerce.catalog.dto.UpdateProductRequest;
import com.ecommerce.catalog.service.ProductAdminService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final ProductAdminService productAdminService;

    public AdminProductController(ProductAdminService productAdminService) {
        this.productAdminService = productAdminService;
    }

    @GetMapping
    public AdminProductPageResponse listProducts(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return productAdminService.listProducts(q, page, size);
    }

    @GetMapping("/{id}")
    public AdminProductResponse getProduct(@PathVariable Long id) {
        return productAdminService.getProduct(id);
    }

    @PostMapping
    public AdminProductResponse createProduct(@Valid @RequestBody CreateProductRequest request) {
        return productAdminService.createProduct(request);
    }

    @PutMapping("/{id}")
    public AdminProductResponse updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProductRequest request) {
        return productAdminService.updateProduct(id, request);
    }

    @DeleteMapping("/{id}")
    public void deactivateProduct(@PathVariable Long id) {
        productAdminService.deactivateProduct(id);
    }
}
