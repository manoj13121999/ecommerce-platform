-- Catalog DB schema (source of truth — NOT Flyway).
-- Idempotent: safe to re-run.
-- Usage: ./scripts/schema-catalog.sh

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2) NULL,
    stock INT NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories (id),
    INDEX idx_products_category (category_id),
    INDEX idx_products_active (active)
);

-- Upgrade path: products table created before compare_at_price existed
SET @compare_at_price_exists := (
    SELECT COUNT(*)
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'products'
      AND column_name = 'compare_at_price'
);

SET @add_compare_at_price := IF(
    @compare_at_price_exists = 0,
    'ALTER TABLE products ADD COLUMN compare_at_price DECIMAL(10, 2) NULL AFTER price',
    'DO 0'
);

PREPARE add_compare_at_price_stmt FROM @add_compare_at_price;
EXECUTE add_compare_at_price_stmt;
DEALLOCATE PREPARE add_compare_at_price_stmt;
