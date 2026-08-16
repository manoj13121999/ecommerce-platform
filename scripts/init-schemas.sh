#!/usr/bin/env bash
# Applies all SQL schemas (user + catalog). Run before seed scripts.
# Usage: ./scripts/init-schemas.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

"${ROOT_DIR}/scripts/schema-user.sh"
"${ROOT_DIR}/scripts/schema-catalog.sh"
"${ROOT_DIR}/scripts/schema-order.sh"
"${ROOT_DIR}/scripts/schema-payment.sh"

echo ""
echo "All schemas applied. Next:"
echo "  ./scripts/seed-users.sh"
echo "  ./scripts/seed-catalog.sh"
echo "  ./scripts/mark-deals.sh"
