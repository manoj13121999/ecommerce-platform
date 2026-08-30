#!/usr/bin/env bash
# Quick health check for local dev services.
set -euo pipefail

check() {
  local name="$1"
  local url="$2"
  local code
  code="$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout 2 --max-time 3 "$url" 2>/dev/null || echo "000")"
  if [[ "$code" =~ ^(200|302|401|403)$ ]]; then
    printf "  ✓ %-22s %s\n" "$name" "$url"
  else
    printf "  ✗ %-22s %s (HTTP %s)\n" "$name" "$url" "$code"
  fi
}

echo "ShopVault service check"
echo ""

echo "Infrastructure:"
check "Kong API" "http://127.0.0.1:8000/api/categories"
check "Elasticsearch" "http://127.0.0.1:9200"

echo ""
echo "Microservices:"
check "User service" "http://127.0.0.1:8081/actuator/health"
check "Catalog service" "http://127.0.0.1:8082/actuator/health"
check "Cart service" "http://127.0.0.1:8083/actuator/health"
check "Order service" "http://127.0.0.1:8084/actuator/health"
check "Payment service" "http://127.0.0.1:8085/actuator/health"
check "Notification service" "http://127.0.0.1:8086/actuator/health"
check "Admin service" "http://127.0.0.1:8087/admin/login"

echo ""
echo "Storefront:"
check "React dev server" "http://localhost:5173/"

echo ""
echo "Tip: start infra with ./scripts/dev-up.sh, then run Java services and cd frontend && npm run dev"
