#!/usr/bin/env bash
# Applies scripts/schema-order.sql to order_db.
# Usage: ./scripts/schema-order.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DB_HOST="${ORDER_DB_HOST:-127.0.0.1}"
DB_PORT="${ORDER_DB_PORT:-3309}"
DB_NAME="${ORDER_DB_NAME:-order_db}"
DB_USER="${ORDER_DB_USER:-ecommerce}"
DB_PASSWORD="${ORDER_DB_PASSWORD:-ecommerce}"
SCHEMA_FILE="${ROOT_DIR}/scripts/schema-order.sql"

if [[ ! -f "$SCHEMA_FILE" ]]; then
  echo "Missing ${SCHEMA_FILE}"
  exit 1
fi

run_mysql() {
  if command -v mysql >/dev/null 2>&1; then
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" "$@"
  else
    local container
    container="$(docker ps -qf 'name=mysql-order' | head -1)"
    if [[ -z "$container" ]]; then
      echo "mysql client not found and mysql-order container is not running."
      echo "Start infra first: ./scripts/dev-up.sh"
      exit 1
    fi
    docker exec -i "$container" mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" "$@"
  fi
}

echo "Applying order_db schema from scripts/schema-order.sql ..."
run_mysql < "$SCHEMA_FILE"
echo "order_db schema ready."
