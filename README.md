# ShopVault — Ecommerce Platform

Event-driven ecommerce microservices with a React storefront and Spring Boot admin console.

## Architecture

| Layer | Components |
|-------|------------|
| Storefront | React + Vite (`frontend/`) on port **5173** |
| API gateway | Kong on port **8000** (proxies `/api/*`) |
| Admin UI | Spring Boot + Thymeleaf on port **8087** |
| Services | user 8081, catalog 8082, cart 8083, order 8084, payment 8085, notification 8086 |
| Data | MySQL (per service), MongoDB (cart), Redis, Kafka, Elasticsearch |

## Quick start

### 1. Start Docker Desktop, then infrastructure

```bash
./scripts/dev-up.sh
```

### 2. Apply schemas and seed data

```bash
./scripts/init-schemas.sh
./scripts/seed-users.sh
./scripts/seed-catalog.sh
./scripts/mark-deals.sh
```

### 3. Start microservices

Run each service from your IDE (IntelliJ) or Maven:

```bash
mvn -pl user-service spring-boot:run
mvn -pl catalog-service spring-boot:run
mvn -pl cart-service spring-boot:run
mvn -pl order-service spring-boot:run
mvn -pl payment-service spring-boot:run
mvn -pl notification-service spring-boot:run
mvn -pl admin-service spring-boot:run
```

### 4. Start the storefront

```bash
cd frontend && npm install && npm run dev
```

Open http://localhost:5173

## URLs

| App | URL |
|-----|-----|
| Storefront | http://localhost:5173 |
| Kong API | http://localhost:8000 |
| Admin login | http://localhost:8087/admin/login |
| Admin dashboard | http://localhost:8087/admin |

## Test accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@shopvault.local` | `password123` |
| Customer | `manojprabhakar1312@gmail.com` | `password123` |

**Admin vs storefront:** Customers sign in on the React app (5173). Admins use the separate admin console (8087). Admin users also see an **Admin** link on their account page in the storefront.

## Features

- Product catalog with search, categories, and deals
- Cart, checkout, and order placement with live stock checks
- Order status tracking (placed → paid → shipped → delivered)
- Customer cancel for placed/paid orders (restores inventory after payment)
- Admin: product CRUD, order fulfillment, user list, operations dashboard
- Kafka events for order status updates and notification emails (logged in dev)

## Health check

```bash
./scripts/check-services.sh
```

## Stop infrastructure

```bash
./scripts/dev-down.sh
```

## Recent changes

- Storefront home UX (hero, deals, perks, login/signup)
- Admin/storefront login separation
- Order fulfillment tracking with status timeline
- Admin dashboard with revenue, pipeline stats, and recent orders
- Checkout uses catalog prices and stock; cancelled paid orders restore stock
