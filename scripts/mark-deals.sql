-- Marks ~20% of products as on sale (compare_at_price > price).
-- Run after seed-catalog.sh and Flyway V2 migration.
-- Usage: ./scripts/mark-deals.sh

UPDATE products
SET compare_at_price = ROUND(price * 1.25, 2)
WHERE active = TRUE
  AND id MOD 5 = 0;
