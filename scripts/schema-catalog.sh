#!/usr/bin/env bash
# Applies scripts/schema-catalog.sql to catalog_db.
# Usage: ./scripts/schema-catalog.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DB_HOST="${CATALOG_DB_HOST:-127.0.0.1}"
DB_PORT="${CATALOG_DB_PORT:-3308}"
DB_NAME="${CATALOG_DB_NAME:-catalog_db}"
DB_USER="${CATALOG_DB_USER:-ecommerce}"
DB_PASSWORD="${CATALOG_DB_PASSWORD:-ecommerce}"
SCHEMA_FILE="${ROOT_DIR}/scripts/schema-catalog.sql"

if [[ ! -f "$SCHEMA_FILE" ]]; then
  echo "Missing ${SCHEMA_FILE}"
  exit 1
fi

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

echo "Applying catalog_db schema from scripts/schema-catalog.sql ..."
run_mysql < "$SCHEMA_FILE"
echo "catalog_db schema ready."
