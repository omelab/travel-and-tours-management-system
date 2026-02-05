🌐 Enterprise Travel Platform — Microservices Architecture

## 1. API Gateway

- Purpose: Single entry point for web/mobile clients. Handles routing, authentication, rate-limiting, and request aggregation.

- Technology: NestJS + Fastify

- Responsibilities: 
    - Route requests to internal services 
    - Authenticate users (JWT / OAuth2) 
    - Forward x-user-role for RBAC 
    - Support multi-language headers for content

- Multi-language: Accepts Accept-Language header and forwards to services.

## 2. Auth Service

- Purpose: Authentication and authorization 
- Responsibilities: 
    - JWT token generation 
    - Refresh tokens 
    - User roles & permissions 
    - Password hashing & reset
- Communication: API Gateway request / response
- Events: Emits user.created, user.updated for other services

## 3. User Service

- Purpose: Manage user profiles, agents, and customers
 
- Responsibilities: 
    - Profile CRUD 
    - Agent hierarchy & commission 
    - Multi-language support for user metadata 
- Events: user.created, user.updated 
- DB: PostgreSQL


## 4. Hotel Service

- Purpose: Manage hotels, rooms, inventory 
- Responsibilities: 
    - Hotel CRUD 
    - Room types & pricing 
    - Inventory / availability 
    - Multi-language content via hotel_translations 
- Events: 
    - hotel.created, hotel.updated → Search Service & Booking Service 
- DB: PostgreSQL 


## 5. Tour Service
 
- Purpose: Manage tour packages & itineraries 
- Responsibilities: 
    - Tour CRUD 
    - Itinerary day plans 
    - Multi-language via tour_translations 
    - Seasonal pricing 
- Events: 
    - tour.created, tour.updated → Search Service & Booking Service 
- DB: PostgreSQL

## 6. Booking Service
 
- Purpose: Central booking engine 
- Responsibilities: 
    - Handle hotel/tour bookings 
    - Inventory locking (Redis) 
    - Multi-item bookings 
    - Booking lifecycle: pending → confirmed → cancelled 
- Events: 
    - booking.created → Payment & Notification 
    - booking.confirmed → Notification, Reporting 
    - booking.cancelled → Notification 
- DB: PostgreSQL + Redis for locks


## 7. Payment Service
 
- Purpose: Payment processing 
- Responsibilities: 
    - Gateway integration (Stripe, SSLCommerz) 
    - Agent wallet payments 
    - Refunds & partial payments 
- Events: 
    - payment.success → Booking Service & Notification 
    - payment.failed → Booking Service & Notification 
- DB: PostgreSQL
 
## 8. Notification Service
 
- Purpose: Multi-channel user notifications 
- Responsibilities: 
    - Email, SMS, WhatsApp 
    - Templates per event & multi-language support 
    - Queue system for high volume 
    - Events: Listens for booking/payment events 
- DB: PostgreSQL or NoSQL (logs)
 
## 9. Reporting & Analytics Service 
- Purpose: Enterprise reporting and dashboards 
- Responsibilities: 
    - Aggregate booking, payment, agent metrics 
    - Daily/weekly/monthly summaries 
    - Export reports (CSV/PDF)  
- Events: Listens for booking/payment events 
- DB: PostgreSQL / optional data warehouse



## 10. Multi-Currency & Exchange Rate Service

- Purpose: Currency conversion & international pricing 
- Responsibilities: 
    - Store supported currencies 
    - Fetch live exchange rates from external APIs 
    - Convert prices for Hotel/Tour/Booking services 
    - Maintain historical rate snapshots 
- Events: Optional events for price recalculation 

## 11. Search Service (Elasticsearch)

- Purpose: Fast search & filtering for hotels/tours 
- Responsibilities: 
    - Index hotels and tours in Elasticsearch 
    - Support full-text search, filters, faceted search, geo-search 
- Multi-language search using language-specific fields  
- Events: Listens for hotel.* and tour.* events to update index


## 12. Message Broker

- Purpose: Event-driven communication
- Technology: RabbitMQ / Kafka
- Responsibilities: 
    - Publish/subscribe pattern for events 
    - Decouple services 
    - Guarantee event delivery 
- Events: 
    - Booking: booking.created, booking.confirmed, booking.cancelled 
    - Payment: payment.success, payment.failed
    - Hotel/Tour: hotel.*, tour.* 
    - Notifications: send.notification
 
## 13. Multi-Language Support
 
- Implementation: 
    - Each service with customer-facing content has *_translations tables
    - Language service or internal translation tables store supported languages
    - API Gateway accepts Accept-Language header
    - Frontend receives content in user-selected language
 
- Services using multi-language: Hotel Service, Tour Service, Notification Service
 
#### Communication Flow

1. Client → API Gateway → Microservice
    Requests are authenticated via JWT
    Multi-language headers forwarded

2. Booking Flow:
    - Booking Service checks inventory → locks → Payment Service processes → emits success/failure → Booking confirmed/cancelled
    - Notification Service sends email/SMS/WhatsApp
    - Reporting Service updates metrics

3. Search Flow: 
    - Hotel/Tour CRUD → emits events → Search Service updates indexes 
4. Currency Conversion: 
    - Hotel/Tour/Booking services query Currency Service for local prices


## Databases per Service

| Service      | DB Type                     |
| ------------ | --------------------------- |
| Auth         | PostgreSQL                  |
| User         | PostgreSQL                  |
| Hotel        | PostgreSQL                  |
| Tour         | PostgreSQL                  |
| Booking      | PostgreSQL + Redis          |
| Payment      | PostgreSQL                  |
| Notification | PostgreSQL / NoSQL          |
| Reporting    | PostgreSQL / Data Warehouse |
| Currency     | PostgreSQL                  |
| Search       | Elasticsearch               |


## Enterprise Project Structure (Monorepo)

Below is a clean, enterprise-grade structure that scales teams, services, and infrastructure.

```bash
zedtrago/
  apps/
    api-gateway/
    auth-service/
    user-service/
    hotel-service/
    tour-service/
    booking-service/
    payment-service/
    notification-service/
    reporting-service/
    currency-service/
    search-service/

  libs/
    common/                 # shared types, errors, utils
    config/                 # typed config loaders
    database/               # DB clients + migrations helpers
    messaging/              # event bus wrappers + schemas
    auth/                   # guards, decorators, policies
    observability/          # logging, tracing, metrics
    contracts/              # OpenAPI + AsyncAPI specs

  tests/
    e2e/                    # cross-service workflow tests
    contract/               # consumer/provider contract tests

  infra/
    docker/                 # local compose, images
    k8s/                    # Helm charts / manifests
    terraform/              # cloud infra IaC

  docs/
    architecture/
    runbooks/
    decisions/              # ADRs

  scripts/
    db/
    ci/
    tooling/

  config/
    eslint/
    prettier/
    tsconfig/

  .env.example
  package.json
  nx.json / turbo.json
  README.md
```

### Key Enterprise Conventions

- Each service owns its DB schema, migrations, and data access layer.
- `libs/` is for truly shared, versioned code only. Keep it small and stable.
- `contracts/` is the source of truth for API and event schemas.
- `tests/contract` ensures services evolve safely without breaking consumers.
- `infra/` separates local dev from production deployments cleanly.


✅ This document represents a complete enterprise-level travel microservices platform, with:

    Event-driven architecture 
    Multi-language content  
    Multi-currency support 
    Search & analytics 
    Scalable, modular design
