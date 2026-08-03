#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Starting infrastructure (MySQL, Mongo, Redis, Kafka, Elasticsearch, Kong)..."
docker compose up -d

echo ""
echo "Infrastructure is up. Apply DB schemas and seed data:"
echo "  ./scripts/init-schemas.sh     # create/upgrade all tables"
echo "  ./scripts/seed-users.sh"
echo "  ./scripts/seed-catalog.sh"
echo "  ./scripts/mark-deals.sh"
echo ""
echo "Service URLs:"
echo "  Kong API Gateway:  http://localhost:8000"
echo "  Kong Admin:        http://localhost:8001"
echo "  Kafka:             localhost:9092"
echo "  Redis:             localhost:6379"
echo "  Elasticsearch:     http://localhost:9200"
echo "  MySQL (user):      localhost:3307"
echo ""
echo "Start microservices locally:"
echo "  mvn -pl user-service spring-boot:run"
echo "  mvn -pl catalog-service spring-boot:run"
echo ""
echo "Start React storefront:"
echo "  cd frontend && npm run dev"
