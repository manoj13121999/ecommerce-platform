-- payment_db schema. NOT Flyway. Run: ./scripts/schema-payment.sh

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(32) NOT NULL,
    payment_reference VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'COMPLETED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_payments_order_id (order_id),
    INDEX idx_payments_user_id (user_id)
);
