-- DEPRECATED: Schema is managed by scripts/schema-user.sql (NOT Flyway).
-- This file is kept for reference only.

CREATE TABLE wishlist_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_wishlist_user_product UNIQUE (user_id, product_id),
    INDEX idx_wishlist_user (user_id)
);
