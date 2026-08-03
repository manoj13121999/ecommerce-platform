#!/usr/bin/env bash
# Applies scripts/schema-user.sql to user_db.
# Usage: ./scripts/schema-user.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DB_HOST="${USER_DB_HOST:-127.0.0.1}"
DB_PORT="${USER_DB_PORT:-3307}"
DB_NAME="${USER_DB_NAME:-user_db}"
DB_USER="${USER_DB_USER:-ecommerce}"
DB_PASSWORD="${USER_DB_PASSWORD:-ecommerce}"
SCHEMA_FILE="${ROOT_DIR}/scripts/schema-user.sql"

if [[ ! -f "$SCHEMA_FILE" ]]; then
  echo "Missing ${SCHEMA_FILE}"
  exit 1
fi

run_mysql() {
  if command -v mysql >/dev/null 2>&1; then
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" "$@"
  else
    local container
    container="$(docker ps -qf 'name=mysql-user' | head -1)"
    if [[ -z "$container" ]]; then
      echo "mysql client not found and mysql-user container is not running."
      echo "Start infra first: ./scripts/dev-up.sh"
      exit 1
    fi
    docker exec -i "$container" mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" "$@"
  fi
}

echo "Applying user_db schema from scripts/schema-user.sql ..."
run_mysql < "$SCHEMA_FILE"
echo "user_db schema ready."
