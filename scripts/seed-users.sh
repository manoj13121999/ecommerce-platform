#!/usr/bin/env bash
# Loads scripts/seed-users.sql into user_db. NOT a Flyway migration.
# Usage: ./scripts/seed-users.sh
#
# Password for all 1000 users: password123

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DB_HOST="${USER_DB_HOST:-127.0.0.1}"
DB_PORT="${USER_DB_PORT:-3307}"
DB_NAME="${USER_DB_NAME:-user_db}"
DB_USER="${USER_DB_USER:-ecommerce}"
DB_PASSWORD="${USER_DB_PASSWORD:-ecommerce}"
SQL_FILE="${ROOT_DIR}/scripts/seed-users.sql"

if [[ ! -f "$SQL_FILE" ]]; then
  echo "Missing ${SQL_FILE}"
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

echo "Loading 1000 users from scripts/seed-users.sql ..."
run_mysql < "$SQL_FILE"

echo "Done."
echo "  manojprabhakar1312@gmail.com  / password123"
echo "  manojguru1961999@gmail.com    / password123"
