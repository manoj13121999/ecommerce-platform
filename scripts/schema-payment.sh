#!/usr/bin/env bash
# Applies scripts/schema-payment.sql to payment_db.
# Usage: ./scripts/schema-payment.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DB_HOST="${PAYMENT_DB_HOST:-127.0.0.1}"
DB_PORT="${PAYMENT_DB_PORT:-3310}"
DB_NAME="${PAYMENT_DB_NAME:-payment_db}"
DB_USER="${PAYMENT_DB_USER:-ecommerce}"
DB_PASSWORD="${PAYMENT_DB_PASSWORD:-ecommerce}"
SCHEMA_FILE="${ROOT_DIR}/scripts/schema-payment.sql"

if [[ ! -f "$SCHEMA_FILE" ]]; then
  echo "Missing ${SCHEMA_FILE}"
  exit 1
fi

run_mysql() {
  if command -v mysql >/dev/null 2>&1; then
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" "$@"
  else
    local container
    container="$(docker ps -qf 'name=mysql-payment' | head -1)"
    if [[ -z "$container" ]]; then
      echo "mysql client not found and mysql-payment container is not running."
      echo "Start infra first: ./scripts/dev-up.sh"
      exit 1
    fi
    docker exec -i "$container" mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" "$@"
  fi
}

echo "Applying payment_db schema from scripts/schema-payment.sql ..."
run_mysql < "$SCHEMA_FILE"
echo "payment_db schema ready."
