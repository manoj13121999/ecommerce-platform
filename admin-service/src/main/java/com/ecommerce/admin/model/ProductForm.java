package com.ecommerce.admin.model;

import com.ecommerce.admin.client.AdminApiModels.AdminProductResponse;
import java.math.BigDecimal;

public class ProductForm {

    private Long categoryId;
    private String name = "";
    private String slug = "";
    private String description = "";
    private BigDecimal price;
    private BigDecimal compareAtPrice;
    private Integer stock = 0;
    private String imageUrl = "";
    private Boolean active = true;

    public static ProductForm empty() {
        return new ProductForm();
    }

    public static ProductForm from(AdminProductResponse product) {
        ProductForm form = new ProductForm();
        form.setCategoryId(product.categoryId());
        form.setName(product.name());
        form.setSlug(product.slug());
        form.setDescription(product.description());
        form.setPrice(product.price());
        form.setCompareAtPrice(product.compareAtPrice());
        form.setStock(product.stock());
        form.setImageUrl(product.imageUrl());
        form.setActive(product.active());
        return form;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getCompareAtPrice() {
        return compareAtPrice;
    }

    public void setCompareAtPrice(BigDecimal compareAtPrice) {
        this.compareAtPrice = compareAtPrice;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
