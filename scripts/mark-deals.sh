#!/usr/bin/env bash
# Sets compare_at_price on ~20% of products for the Deals page.
# Usage: ./scripts/mark-deals.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DB_HOST="${CATALOG_DB_HOST:-127.0.0.1}"
DB_PORT="${CATALOG_DB_PORT:-3308}"
DB_NAME="${CATALOG_DB_NAME:-catalog_db}"
DB_USER="${CATALOG_DB_USER:-ecommerce}"
DB_PASSWORD="${CATALOG_DB_PASSWORD:-ecommerce}"
SQL_FILE="${ROOT_DIR}/scripts/mark-deals.sql"

run_mysql() {
  if command -v mysql >/dev/null 2>&1; then
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" "$@"
  else
    local container
    container="$(docker ps -qf 'name=mysql-catalog' | head -1)"
    if [[ -z "$container" ]]; then
      echo "mysql client not found and mysql-catalog container is not running."
      echo "Start infra first: ./scripts/dev-up.sh"
      exit 1
    fi
    docker exec -i "$container" mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" "$@"
  fi
}

"${ROOT_DIR}/scripts/schema-catalog.sh"

echo "Marking sale products..."
run_mysql < "$SQL_FILE"

DEAL_COUNT="$(run_mysql -N -e "
  SELECT COUNT(*)
  FROM products
  WHERE compare_at_price IS NOT NULL
    AND compare_at_price > price;
")"

echo "Done. ${DEAL_COUNT} products are now on sale."
