-- DEPRECATED: Schema is managed by scripts/schema-catalog.sql (NOT Flyway).
-- This file is kept for reference only.

ALTER TABLE products
    ADD COLUMN compare_at_price DECIMAL(10, 2) NULL AFTER price;
