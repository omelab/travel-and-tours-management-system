# zedtrago 
— a Tours & Travel Management System at enterprise + microservice level? That’s a serious, scalable build. Love it.

I’ll design this like it’s meant to handle:

✈️ Flights
🏨 Hotels
🚗 Transfers
🧳 Tour Packages
👥 Agents / B2B
💳 Payments
🌍 Multi-language & multi-currency


Using NestJS + Fastify + Nestia for high performance.

## 🧠 1️⃣ High-Level Architecture

We go microservices + API Gateway

```bash
                🌍 Clients (Web / Mobile / Agent Portal)
                               |
                               |
                        🚪 API Gateway
                               |
        -------------------------------------------------
        |        |         |         |        |         |
   👤 Auth   🧳 Booking  🏨 Hotel  ✈️ Flight 🚗 Transfer 💳 Payment
        |        |         |         |        |         |
        ------------------📦 Message Broker -------------------
                               |
                          📊 Reporting
                               |
                           🧠 AI/Rules (optional)

```

## 🚪 2️⃣ API Gateway (Main Entry)

Tech: NestJS + Fastify + Nestia
Handles:

- Authentication middleware
- Rate limiting
- Request aggregation
- Response shaping
- Public API docs

```bash
apps/api-gateway
```

## 🔐 3️⃣ Auth Service

Handles:

- Admin login
- Agent login (B2B)
- Customer login
- JWT / Refresh tokens
- Roles & permissions

```bash
apps/auth-service
```
DB: PostgreSQL
Cache: Redis (sessions, OTP)


## 👤 4️⃣ User Service

- Customers
- Agents
- Admin profiles
- Company accounts (B2B agencies)

```bash
apps/user-service

```


## 🏨 5️⃣ Hotel Service

- Hotel CRUD
- Room types
- Seasonal pricing
- Availability
- Hotel images & amenities

```bash
apps/hotel-service
```

## ✈️ 6️⃣ Flight Service

- Airline management
- Flight routes
- Schedules
- Seat classes
- API integration ready (Amadeus/Sabre later)

```bash
apps/flight-service
```


## 🚗 7️⃣ Transfer Service

- Airport pickup/drop
- Vehicle types
- Driver assignment
- Route pricing

```bash
apps/transfer-service
```

## 🧳 8️⃣ Tour Package Service

- CORE for travel business
- Tour packages
- Itinerary builder (Day-wise plan)
- Multi-language content
- Package pricing rules
- Seasonal pricing

```bash
apps/tour-service
```


## 🧾 9️⃣ Booking Service (MOST IMPORTANT)
This service connects everything.

Handles:
- Cart system
- Multi-service booking (hotel + transfer + tour)
- Availability locking
- Booking status
- Cancellation rules

```bash
apps/booking-service
```


## 💳 10️⃣ Payment Service

- Stripe / SSLCommerz / Razorpay integration
- Wallet system (for agents)
- Commission tracking
- Refund handling

```bash
apps/payment-service
```


## 📊 11️⃣ Reporting & Analytics

- Sales reports
- Agent commission reports
- Booking trends
- Revenue by service

```bash
apps/report-service
```
🧩 12️⃣ Communication Between Services
Use Message Broker

| Tool                 | Purpose           |
| -------------------- | ----------------- |
| **RabbitMQ / Kafka** | Async events      |
| **Redis**            | Caching           |
| **REST (Fastify)**   | Direct sync calls |

Example flow:
Booking Created → Event → Payment Service
Payment Success → Event → Booking Confirmed
Booking Confirmed → Event → Email Service


🗂 13️⃣ Monorepo Structure (Recommended)

Use Nx Monorepo

```bash
apps/
  api-gateway/
  auth-service/
  user-service/
  hotel-service/
  flight-service/
  transfer-service/
  tour-service/
  booking-service/
  payment-service/
  report-service/

libs/
  common/
    dto/
    entities/
    enums/
    guards/
    interceptors/
  database/
  messaging/
  auth/

```
## ⚡ 14️⃣ Performance Stack

| Layer             | Tech                                  |
| ----------------- | ------------------------------------- |
| Framework         | NestJS                                |
| HTTP Engine       | Fastify                               |
| Type Optimization | Nestia                                |
| Database          | PostgreSQL                            |
| ORM               | Prisma or TypeORM                     |
| Cache             | Redis                                 |
| Queue             | RabbitMQ                              |
| File Storage      | S3 / Cloudinary                       |
| Search            | Elasticsearch (Hotels & Tours search) |


## 🔒 15️⃣ Enterprise Features You SHOULD Add

✅ Multi-language content
✅ Multi-currency pricing
✅ Timezone-aware bookings
✅ Agent commission rules
✅ Dynamic pricing engine
✅ Coupon & promo system
✅ Audit logs
✅ Admin approval workflows

## 🏗 Example Service Tech Stack (Hotel Service)

| Part       | Tech             |
| ---------- | ---------------- |
| Framework  | NestJS + Fastify |
| Validation | Nestia           |
| DB         | PostgreSQL       |
| Cache      | Redis            |
| Search     | Elasticsearch    |
| Events     | RabbitMQ         |

## 🏁 Final Result

You get a system that is:

✔ Scalable to millions of bookings
✔ Easy to add new services (Visa, Insurance later)
✔ Fast API performance
✔ Ready for B2B + B2C
✔ Enterprise structured




## 🧱 PHASE 1 — Monorepo & Core Setup

✅ Step 1: Create Monorepo with NestJS

```bash
npm i -g @nestjs/cli
nest new travel-platform
cd travel-platform
```

Now convert into microservices structure:

```bash
nest generate app api-gateway
nest generate app auth-service
nest generate app user-service
nest generate app hotel-service
nest generate app tour-service
nest generate app booking-service
nest generate app payment-service
```

✅ Step 2: Install Performance Stack

Inside root:

```bash
npm install @nestjs/platform-fastify fastify
npm install @nestjs/microservices
npm install @nestjs/config
npm install @nestjs/jwt passport passport-jwt
npm install prisma @prisma/client
npm install ioredis
npm install amqplib
npm install @nestia/core typia nestia --save-dev
```

✅ Step 3: Shared Libraries

```bash
nest generate library common
nest generate library database
nest generate library messaging
nest generate library auth
```

Use these for:

- DTOs
- Enums
- Event patterns
- DB connection
- JWT guards

## ⚙️ PHASE 2 — Infrastructure Setup
✅ Step 4: Docker Compose (DB + Cache + Queue)

Create `docker-compose.yml`

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: travel
      POSTGRES_PASSWORD: travel123
      POSTGRES_DB: travel_db
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"

```

Run:

```bash
docker compose up -d
```

## 🔐 PHASE 3 — Authentication Service

✅ Step 5: Auth Service Features

Build:

- Admin login
- Agent login
- Customer login
- JWT Access + Refresh Tokens
- Role-based access

Tables:

```bash
users
roles
permissions
user_roles
```
Auth flow:

```bash
Login → JWT Issued → API Gateway verifies → Forwards to services
```


## 🚪 PHASE 4 — API Gateway

✅ Step 6: Gateway Responsibilities

In api-gateway

- Validate JWT
- Rate limit
- Route requests to services
- Aggregate responses

Install proxy:
```bash
npm install @fastify/http-proxy
```
Example routing:

| Route     | Service         |
| --------- | --------------- |
| /auth     | auth-service    |
| /users    | user-service    |
| /hotels   | hotel-service   |
| /tours    | tour-service    |
| /bookings | booking-service |


## 🏨 PHASE 5 — Core Business Services
Now we build domain by domain.

## 🧳 Step 7: Tour Service

Tables:

```bash
tours
tour_itineraries (day-wise)
tour_prices
tour_translations
```
Features:

✔ Day-wise itinerary
✔ Multi-language
✔ Seasonal pricing

## 🏨 Step 8: Hotel Service

Tables:

```bash
hotels
rooms
room_prices
hotel_amenities
hotel_translations

```

Features:

✔ Room availability
✔ Seasonal rates
✔ Image galleries


## 📦 PHASE 6 — Booking Engine (Heart of System)
✅ Step 9: Booking Service

This connects Hotels + Tours + Transfers

Tables:

```bash
bookings
booking_items
travellers
booking_payments
booking_status_logs
```

Flow:

```bash
Create Booking → Lock availability → Await payment → Confirm booking
```

## 💳 PHASE 7 — Payment Service

Step 10: Integrate Payment Gateways

Support:
    - Stripe
    - SSLCommerz (Bangladesh)
    - Agent Wallet

Tables:

```bash
transactions
refunds
agent_wallets
commissions
```

Event flow:

```bash
Payment Success → Emit Event → Booking Service Confirms
```

## 📨 PHASE 8 — Event-Driven Communication
Step 11: RabbitMQ Messaging
Events:

| Event             | Triggered By | Consumed By        |
| ----------------- | ------------ | ------------------ |
| booking.created   | Booking      | Payment            |
| payment.success   | Payment      | Booking            |
| booking.confirmed | Booking      | Email/Notification |

## 🌍 PHASE 9 — Enterprise Features

Step 12: Add Advanced Capabilities

✔ Multi-currency pricing
✔ Currency conversion service
✔ Timezone handling
✔ Coupon & promo engine
✔ Agent commission rules
✔ Admin approval flows

## 🔎 PHASE 10 — Search & Optimization

Step 13: Elasticsearch (Later Phase)

Use for:

- Hotel search
- Tour search
- Filters (price, rating, location)


## 🚀 PHASE 11 — Deployment
Step 14: Dockerize Each Service
Each app gets:

```bash
Dockerfile
.env
```
Then deploy via:

- DigitalOcean
- AWS ECS
- Kubernetes (later)

## 📊 PHASE 12 — Admin Panel & B2B Panel

After backend stable:

- Admin dashboard
- Agent portal (B2B booking system)
- Reports & analytics




## 🏁 BUILD ORDER (VERY IMPORTANT)

Follow this exact order:

1. Monorepo setup
2. Docker infra (Postgres, Redis, RabbitMQ)
3. Auth Service
4. API Gateway
5. User Service
6. Tour Service
7. Hotel Service
8. Booking Service
9. Payment Service
10. Events & Messaging
11. Enterprise features
12. Search
13. Deployment




## 🗄️ 1️⃣ AUTH DATABASE SCHEMA

We support:

✔ Admin
✔ Agent (B2B)
✔ Customer

### 👤 users

| Field      | Type             | Notes              |
| ---------- | ---------------- | ------------------ |
| id         | UUID             | PK                 |
| name       | varchar          | Full name          |
| email      | varchar (unique) | Login ID           |
| phone      | varchar          | Optional           |
| password   | varchar          | Hashed             |
| status     | enum             | active / suspended |
| created_at | timestamp        |                    |
| updated_at | timestamp        |                    |


### 🎭 roles

| Field | Type    | Notes                    |
| ----- | ------- | ------------------------ |
| id    | UUID    | PK                       |
| name  | varchar | admin / agent / customer |

### 🔑 permissions

| Field | Type    | Example                        |
| ----- | ------- | ------------------------------ |
| id    | UUID    |                                |
| name  | varchar | create_booking, approve_refund |


### 🔗 user_roles

| user_id | role_id |
| ------- | ------- |


### 🔗 role_permissions
| role_id | permission_id |
| ------- | ------------- |

### 🔄 refresh_tokens

| Field      | Type      |
| ---------- | --------- |
| id         | UUID      |
| user_id    | UUID      |
| token      | text      |
| expires_at | timestamp |



## 🔐 2️⃣ JWT AUTH FLOW

```bash
Login → Auth Service validates password
      → Issues Access Token (15m)
      → Issues Refresh Token (7d)

Client → Calls API Gateway with Access Token

Gateway → Verifies JWT
        → Forwards request to services

Access token expired?
Client → Sends Refresh Token → Gets new Access Token

```

## 📁 3️⃣ AUTH SERVICE FOLDER STRUCTURE
```bash
auth-service/
 ├── src/
 │   ├── auth/
 │   │   ├── auth.controller.ts
 │   │   ├── auth.service.ts
 │   │   ├── jwt.strategy.ts
 │   │   ├── jwt.guard.ts
 │   │   ├── roles.guard.ts
 │   │   └── dto/
 │   │        ├── login.dto.ts
 │   │        └── register.dto.ts
 │   ├── users/
 │   ├── roles/
 │   ├── permissions/
 │   └── main.ts
```

## ⚡ 4️⃣ KEY IMPLEMENTATION

✅ Install Packages

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
```

### 🔑 JWT Strategy

```ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, role: payload.role };
  }
}
```


### 🔐 Auth Service (Login)

```ts
async login(dto: LoginDto) {
  const user = await this.usersService.findByEmail(dto.email);

  if (!user || !(await bcrypt.compare(dto.password, user.password))) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const payload = { sub: user.id, role: user.role };

  return {
    access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
    refresh_token: await this.createRefreshToken(user.id),
  };
}

```

### 🔄 Refresh Token

```ts
async refresh(token: string) {
  const saved = await this.prisma.refreshToken.findUnique({ where: { token } });
  if (!saved || saved.expiresAt < new Date()) {
    throw new UnauthorizedException();
  }

  const payload = { sub: saved.userId };
  return {
    access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
  };
}
```


### 🛡 JWT Guard

```bash
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### 🎭 Role Guard

```ts
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const user = context.switchToHttp().getRequest().user;
    return requiredRoles.includes(user.role);
  }
}

```

Usage:

```ts
@Roles('admin')
@Get('admin-only')
findAllAdmins() {}
```

## 🚪 5️⃣ API GATEWAY CONNECTION

Gateway verifies JWT using same secret.

Forward headers:

```bash
Authorization: Bearer <token>
x-user-id
x-user-role
```
### 🧠 BEST PRACTICES (Enterprise)

✅ Hash passwords with bcrypt (salt 10+)
✅ Store refresh tokens in DB (not JWT)
✅ Add login attempt limit (Redis)
✅ Add email verification later
✅ Add OTP for agents



## 🚪 PART 1 — API GATEWAY (JWT Verification + Routing)

The API Gateway is the front door of your system. Every request passes through here.

🧠 Responsibilities

✔ Verify JWT
✔ Extract user info
✔ Forward request to correct microservice
✔ Rate limiting (later)
✔ Logging

### ✅ Step 1 — Install Required Packages

Inside api-gateway

```bash
npm install @nestjs/platform-fastify fastify
npm install @nestjs/jwt passport passport-jwt @nestjs/passport
npm install @fastify/http-proxy
```

✅ Step 2 — Setup Fastify Adapter

main.ts

```ts
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.listen(3000, '0.0.0.0');
}
bootstrap();

```


### ✅ Step 3 — JWT Strategy (Same Secret as Auth Service)

auth/jwt.strategy.ts

```ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return payload; // contains sub, role
  }
}
```



```ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### ✅ Step 5 — Global Auth Middleware

Apply guard globally except login/register routes.

### ✅ Step 6 — Proxy Requests to Services

Register Fastify proxy inside main.ts after app creation:

```ts
const fastify = app.getHttpAdapter().getInstance();

fastify.register(require('@fastify/http-proxy'), {
  upstream: 'http://localhost:3001',
  prefix: '/users',
  rewritePrefix: '/users',
});

fastify.register(require('@fastify/http-proxy'), {
  upstream: 'http://localhost:3002',
  prefix: '/hotels',
  rewritePrefix: '/hotels',
});

fastify.register(require('@fastify/http-proxy'), {
  upstream: 'http://localhost:3003',
  prefix: '/tours',
  rewritePrefix: '/tours',
});

```

### ✅ Step 7 — Forward User Context to Services

Add hook:

```ts
fastify.addHook('onRequest', async (req: any) => {
  if (req.user) {
    req.headers['x-user-id'] = req.user.sub;
    req.headers['x-user-role'] = req.user.role;
  }
});
```
Now every microservice knows who is calling.


## 👤 PART 2 — USER SERVICE (Profiles, Agents, Companies)

This service manages who the users ARE, not authentication.

### 🗄 Database Tables

👤 profiles

| Field         | Type                     |
| ------------- | ------------------------ |
| id            | UUID                     |
| user_id       | UUID (from auth service) |
| first_name    | varchar                  |
| last_name     | varchar                  |
| date_of_birth | date                     |
| gender        | varchar                  |
| nationality   | varchar                  |


🏢 agencies (B2B Agents)

| Field         | Type                      |
| ------------- | ------------------------- |
| id            | UUID                      |
| company_name  | varchar                   |
| trade_license | varchar                   |
| address       | text                      |
| country       | varchar                   |
| status        | pending/approved/rejected |


🔗 agent_users

| user_id | agency_id | role          |
| ------- | --------- | ------------- |
| UUID    | UUID      | manager/staff |


📞 contacts

| id | UUID |
| profile_id | UUID |
| type | phone/email/emergency |
| value | varchar |

### 📁 Folder Structure

```bash
user-service/
 ├── profiles/
 ├── agencies/
 ├── agent-users/
 ├── contacts/
 └── main.ts

```

### ✅ Step 1 — Extract User Info from Gateway

Every request contains:

```bash
x-user-id
x-user-role
```

Create decorator:

```ts
export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return {
      id: request.headers['x-user-id'],
      role: request.headers['x-user-role'],
    };
  },
);
```


### ✅ Step 2 — Create Profile (First Time Login)

```ts
@Post('profile')
createProfile(@CurrentUser() user, @Body() dto: CreateProfileDto) {
  return this.profileService.create(user.id, dto);
}
```

### ✅ Step 3 — Agent Company Registration

```ts
@Post('agencies')
@Roles('agent')
registerAgency(@CurrentUser() user, @Body() dto: CreateAgencyDto) {
  return this.agencyService.create(user.id, dto);
}

```
Admin later approves.

### ✅ Step 4 — Get Logged-in User Profile


```ts
@Get('me')
getMyProfile(@CurrentUser() user) {
  return this.profileService.findByUserId(user.id);
}
```

### 🔄 How Auth + Gateway + User Service Work Together

```bash
User logs in → Auth Service issues JWT
Client calls /users/me → API Gateway validates JWT
Gateway forwards request with x-user-id
User Service fetches profile using that ID
```


### 🏨 PHASE 1 — Hotel Service Setup

✅ Step 1 — Run Service on Fastify

In apps/hotel-service/src/main.ts

```ts
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(3002, '0.0.0.0');
}
bootstrap();
```

### 🗄 PHASE 2 — Database Schema

### 🏨 hotels
| Field       | Type      | Notes    |
| ----------- | --------- | -------- |
| id          | UUID      | PK       |
| name        | varchar   |          |
| star_rating | int       | 1–5      |
| address     | text      |          |
| city        | varchar   |          |
| country     | varchar   |          |
| latitude    | decimal   |          |
| longitude   | decimal   |          |
| description | text      |          |
| created_by  | UUID      | Admin ID |
| created_at  | timestamp |          |


### 🌍 hotel_translations

| hotel_id | language_code | name | description |

### 🛏 rooms

| Field        | Type                    |
| ------------ | ----------------------- |
| id           | UUID                    |
| hotel_id     | UUID                    |
| name         | varchar (Deluxe, Suite) |
| max_adults   | int                     |
| max_children | int                     |
| base_price   | decimal                 |

### 💰 room_prices

Seasonal pricing

| room_id | date | price |


### 📅 room_inventory

Availability tracking
| room_id | date | total_rooms | booked_rooms |


### 🖼 hotel_images

| id | UUID |
| hotel_id | UUID |
| url | text |

### 📁 Folder Structure

```bash
hotel-service/
 ├── hotels/
 ├── rooms/
 ├── pricing/
 ├── inventory/
 └── main.ts
```

### 🏨 PHASE 3 — Hotel Module

Create hotel

```ts
@Post()
@Roles('admin')
createHotel(@Body() dto: CreateHotelDto, @CurrentUser() user) {
  return this.hotelService.create(dto, user.id);
}
```
Get hotel list (Public)
```ts
@Get()
findAll(@Query() query: SearchHotelDto) {
  return this.hotelService.search(query);
}

```


Search filters later:
✔ City
✔ Price range
✔ Star rating


### 🛏 PHASE 4 — Room Management

Add Room to Hotel

```ts
@Post(':hotelId/rooms')
addRoom(
  @Param('hotelId') hotelId: string,
  @Body() dto: CreateRoomDto,
) {
  return this.roomService.create(hotelId, dto);
}
```


### 💰 PHASE 5 — Pricing Engine

Set seasonal price

```ts
@Post('rooms/:roomId/prices')
setRoomPrice(@Param('roomId') roomId: string, @Body() dto: SetRoomPriceDto) {
  return this.pricingService.set(roomId, dto);
}
```

Later supports:

✔ Weekend price
✔ Seasonal rate
✔ Agent special price


### 📅 PHASE 6 — Availability System
Update inventory

```ts
@Post('rooms/:roomId/inventory')
updateInventory(@Param('roomId') roomId: string, @Body() dto: InventoryDto) {
  return this.inventoryService.update(roomId, dto);
}
```

Check availability (used by Booking Service)

```ts
@Get('availability')
checkAvailability(@Query() dto: CheckAvailabilityDto) {
  return this.inventoryService.check(dto);
}
```


### 🔄 PHASE 7 — Booking Integration (IMPORTANT)

When booking happens:

- Booking Service requests availability
- Hotel Service responds
- Booking Service locks inventory
- On confirmation → Hotel Service increments booked_rooms
We’ll use Redis locking later.


### 🧠 PHASE 8 — Enterprise Features

Add later:

✔ Cancellation policy
✔ Child pricing rules
✔ Meal plan (Breakfast included)
✔ Room amenities
✔ Bed types


### 🔐 Security via Gateway

Only Admin can:

✔ Add hotel
✔ Add rooms
✔ Set pricing

Public can:

✔ Search hotels
✔ Check availability

All verified via x-user-role from API Gateway.


### ✅ HOTEL SERVICE READY

You now have:

✔ Hotel listings
✔ Room types
✔ Pricing control
✔ Availability tracking
✔ Booking integration ready


## TOUR PACKAGE SERVICE

🧳 Tour Packages
📅 Day-wise Itinerary
🌍 Multi-language content
💰 Pricing (seasonal + per person)


### 🧳 PHASE 1 — Service Setup

apps/tour-service/src/main.ts

```ts
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(3003, '0.0.0.0');
}
bootstrap();

```

### 🗄 PHASE 2 — Database Schema

#### 🧳 tours

| Field           | Type      | Notes             |
| --------------- | --------- | ----------------- |
| id              | UUID      | PK                |
| title           | varchar   | Default language  |
| slug            | varchar   | SEO URL           |
| duration_days   | int       | e.g. 5            |
| duration_nights | int       | e.g. 4            |
| country         | varchar   |                   |
| city            | varchar   |                   |
| base_price      | decimal   | Starting price    |
| status          | enum      | draft / published |
| created_by      | UUID      | Admin             |
| created_at      | timestamp |                   |


#### 🌍 tour_translations

| tour_id | language_code | title | description |

#### 📅 tour_itineraries

| Field       | Type    |
| ----------- | ------- |
| id          | UUID    |
| tour_id     | UUID    |
| day_number  | int     |
| title       | varchar |
| description | text    |

#### 🖼 tour_images

| id | UUID |
| tour_id | UUID |
| url | text |

#### 💰 tour_prices

Seasonal pricing

| Field       | Type    |
| ----------- | ------- |
| id          | UUID    |
| tour_id     | UUID    |
| start_date  | date    |
| end_date    | date    |
| price_adult | decimal |
| price_child | decimal |


#### 👥 tour_inclusions
| tour_id | item | (Hotel, Meals, Guide, etc.) |


#### ❌ tour_exclusions

| tour_id | item | (Visa, Flight, etc.) |

#### 📁 Folder Structure

```bash
tour-service/
 ├── tours/
 ├── itineraries/
 ├── pricing/
 ├── translations/
 └── main.ts

```


#### 🧳 PHASE 3 — Tour Management (Admin)
Create Tour

```ts
@Post()
@Roles('admin')
createTour(@Body() dto: CreateTourDto, @CurrentUser() user) {
  return this.tourService.create(dto, user.id);
}
```


Add Itinerary (Day Plan)

```ts
@Post(':tourId/itinerary')
addItinerary(
  @Param('tourId') tourId: string,
  @Body() dto: CreateItineraryDto,
) {
  return this.itineraryService.create(tourId, dto);
}
```

Add Seasonal Price


```ts
@Post(':tourId/prices')
setTourPrice(@Param('tourId') tourId: string, @Body() dto: TourPriceDto) {
  return this.pricingService.set(tourId, dto);
}
```

Publish Tour

```ts
Patch(':id/publish')
@Roles('admin')
publishTour(@Param('id') id: string) {
  return this.tourService.publish(id);
}
```


#### 🌍 PHASE 4 — Public APIs (Used by Website)
List Tours

```ts
@Get()
findAll(@Query() dto: SearchTourDto) {
  return this.tourService.search(dto);
}

```
Filters later:
✔ Country
✔ Duration
✔ Price range


Get Tour Details

```ts
@Get(':slug')
findOne(@Param('slug') slug: string) {
  return this.tourService.details(slug);
}
```
Includes:
✔ Itinerary
✔ Images
✔ Inclusions / Exclusions
✔ Pricing


#### 💰 PHASE 5 — Pricing Logic

When frontend requests tour price:

Inputs: 
    - Travel date
    - Adults
    - Children

Logic:
    - Find seasonal price range
    - Calculate:
        total = adults * price_adult + children * price_child

This result is sent to Booking Service later.


#### 🔄 PHASE 6 — Booking Integration

Booking Service will:

Call Tour Service → get price & availability

Lock slot (future upgrade)

Save price snapshot in booking record


#### 🧠 PHASE 7 — Enterprise Add-ons (Later)

✔ Group discounts
✔ Private tour pricing
✔ Optional add-ons (extra excursion)
✔ Tour difficulty level
✔ Age restrictions

#### 🔐 Security

| Action           | Role   |
| ---------------- | ------ |
| Create/Edit Tour | Admin  |
| View Tours       | Public |
| Add Pricing      | Admin  |

All enforced via API Gateway role headers.




## BOOKING SERVICE

### 🧱 PHASE 1 — Service Setup

apps/booking-service/src/main.ts

```bash
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(3004, '0.0.0.0');
}
bootstrap();
```

### 🗄 PHASE 2 — Database Schema

#### 📘 bookings

| Field          | Type      | Notes                                    |
| -------------- | --------- | ---------------------------------------- |
| id             | UUID      | PK                                       |
| booking_number | varchar   | Unique human ID                          |
| user_id        | UUID      | From Auth                                |
| total_amount   | decimal   | Snapshot                                 |
| currency       | varchar   |                                          |
| status         | enum      | pending / confirmed / cancelled / failed |
| expires_at     | timestamp | Payment deadline                         |
| created_at     | timestamp |                                          |


#### 🧾 booking_items

Each service inside a booking

| Field        | Type                                |
| ------------ | ----------------------------------- |
| id           | UUID                                |
| booking_id   | UUID                                |
| type         | enum (hotel/tour/transfer)          |
| reference_id | UUID (hotel room or tour id)        |
| start_date   | date                                |
| end_date     | date                                |
| details      | jsonb (price snapshot, guest count) |


#### 👥 travellers

| id | UUID |
| booking_id | UUID |
| first_name | varchar |
| last_name | varchar |
| type | adult/child |


#### 💳 booking_payments

| id | UUID |
| booking_id | UUID |
| amount | decimal |
| status | pending/success/failed |
| provider | stripe/sslcommerz |
| transaction_id | varchar |


#### 📜 booking_logs

Track status history

| booking_id | status | timestamp |


#### 📁 Folder Structure

```bash
booking-service/
 ├── bookings/
 ├── items/
 ├── travellers/
 ├── payments/
 ├── inventory/
 └── main.ts

```


#### 🔄 PHASE 3 — Booking Flow

Step 1 — Create Booking (Cart Stage)

```bash
@Post()
createBooking(@CurrentUser() user, @Body() dto: CreateBookingDto) {
  return this.bookingService.create(user.id, dto);
}
```

This will:

✔ Generate booking number
✔ Calculate total from Hotel/Tour service
✔ Set status = pending
✔ Set payment expiry (e.g., 15 mins)

Step 2 — Add Items to Booking

```ts
@Post(':bookingId/items')
addItem(@Param('bookingId') id: string, @Body() dto: AddItemDto) {
  return this.itemService.add(id, dto);
}
```

Item types:

- HOTEL_ROOM
- TOUR_PACKAGE


#### 🔒 PHASE 4 — Availability Check + Lock

Before confirming booking:

Hotel Flow

Call Hotel Service → check availability

Lock inventory in Redis

```bash
LOCK: hotel_room_123_2026-03-10
TTL: 15 minutes
```

Tour Flow

Later similar slot system

#### 💰 PHASE 5 — Payment Step

Client pays → Payment Service processes → sends event:

```bash
payment.success
```

Booking Service listens:
```ts
@EventPattern('payment.success')
handlePaymentSuccess(data) {
  this.bookingService.confirm(data.bookingId);
}

```


#### ✅ PHASE 6 — Confirm Booking

When payment success:

✔ Change booking status → confirmed
✔ Deduct real inventory in Hotel Service
✔ Save booking logs
✔ Emit booking.confirmed event

#### ❌ PHASE 7 — Expiry & Cancellation

Cron job checks expired bookings:

```bash
@Cron('*/5 * * * *')
releaseExpiredBookings() {
  // unlock Redis inventory
  // mark booking failed
}
```


#### 🔄 EVENTS FLOW
| Event             | From    | To           |
| ----------------- | ------- | ------------ |
| booking.created   | Booking | Payment      |
| payment.success   | Payment | Booking      |
| booking.confirmed | Booking | Notification |


🧠 ENTERPRISE LOGIC

✔ Price snapshot saved (future price changes don’t affect booking)
✔ Inventory locking prevents overbooking
✔ Supports multiple items in one booking
✔ Status tracking for audits


#### 🔐 Security

Booking always tied to:
```bash
x-user-id
```

Agents can later book for customers.

✅ BOOKING ENGINE COMPLETE

Your system can now:

✔ Create bookings
✔ Add hotels & tours
✔ Lock inventory
✔ Handle payments
✔ Confirm reservations


## PAYMENT SERVICE

This service talks to:

🧾 Booking Service
🏦 External Gateways (Stripe / SSLCommerz)
👤 Agent Wallets (B2B credit system)

### 🧱 PHASE 1 — Service Setup

apps/payment-service/src/main.ts

```ts
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(3005, '0.0.0.0');
}
bootstrap();

```


### 🗄 PHASE 2 — Database Schema

#### 💳 transactions

| Field           | Type      | Notes                                 |
| --------------- | --------- | ------------------------------------- |
| id              | UUID      | PK                                    |
| booking_id      | UUID      |                                       |
| user_id         | UUID      |                                       |
| amount          | decimal   |                                       |
| currency        | varchar   |                                       |
| provider        | enum      | stripe / sslcommerz / wallet          |
| status          | enum      | pending / success / failed / refunded |
| transaction_ref | varchar   | Gateway ref                           |
| created_at      | timestamp |                                       |


#### 💼 agent_wallets

| agent_id | balance |

#### 🧾 wallet_transactions

| Field      | Type            |
| ---------- | --------------- |
| id         | UUID            |
| agent_id   | UUID            |
| amount     | decimal         |
| type       | credit/debit    |
| reference  | booking/payment |
| created_at | timestamp       |


#### 💸 refunds

| transaction_id | amount | reason | status |


#### 📁 Folder Structure

```bash
payment-service/
 ├── gateways/
 │    ├── stripe.service.ts
 │    └── sslcommerz.service.ts
 ├── wallet/
 ├── transactions/
 ├── refunds/
 └── main.ts
```


#### 💳 PHASE 3 — Payment Flow
Step 1 — Booking Requests Payment

Booking Service emits:

```bash
booking.created
```

Payment Service listens:

```ts
@EventPattern('booking.created')
async initiatePayment(data) {
  return this.paymentService.createTransaction(data);
}
```


Step 2 — Create Transaction Record

```ts
async createTransaction(booking) {
  return this.prisma.transaction.create({
    data: {
      bookingId: booking.id,
      amount: booking.totalAmount,
      currency: booking.currency,
      status: 'pending',
      provider: booking.paymentMethod,
    },
  });
}

```



### 🌐 PHASE 4 — Stripe Integration (Example)

```ts
const stripe = new Stripe(process.env.STRIPE_SECRET);

async createStripePayment(amount: number) {
  return stripe.paymentIntents.create({
    amount: amount * 100,
    currency: 'usd',
    payment_method_types: ['card'],
  });
}
```

Webhook handles confirmation.


#### 🇧🇩 PHASE 5 — SSLCommerz Integration (Bangladesh)

Redirect flow:

Create session

User pays

SSLCommerz callback → verify → mark success


#### 👤 PHASE 6 — Agent Wallet System (B2B)

Agents can book using wallet credit.

Deduct Wallet Balance

```ts
async payWithWallet(agentId: string, amount: number) {
  const wallet = await this.walletRepo.find(agentId);

  if (wallet.balance < amount) throw new Error('Insufficient balance');

  await this.walletRepo.update(agentId, { balance: wallet.balance - amount });

  return true;
}
```


#### 🔄 PHASE 7 — Payment Success Event

When payment is confirmed:

```ts
this.client.emit('payment.success', {
  bookingId,
  transactionId,
});
```


#### ❌ PHASE 8 — Failed or Expired Payment
Emit:
```ts
payment.failed
```
Booking becomes failed and inventory lock is released.


#### 💸 PHASE 9 — Refunds

```ts
@Post('refund')
@Roles('admin')
refund(@Body() dto: RefundDto) {
  return this.refundService.process(dto);
}
```
Refund triggers event to update booking.


#### 🔐 Security

✔ Validate booking amount from Booking Service
✔ Never trust frontend amount
✔ Webhook signature verification required


#### 📊 ENTERPRISE ADD-ONS

✔ Partial payments
✔ Installment payments
✔ Commission split
✔ Auto-invoice generation


PAYMENT SYSTEM COMPLETE

Now your platform can:

✔ Accept online payments
✔ Handle agent credit wallets
✔ Confirm bookings after payment
✔ Process refunds


🧠 SYSTEM STATUS NOW

You have built:

✔ Auth
✔ Gateway
✔ Users
✔ Hotels
✔ Tours
✔ Booking Engine
✔ Payment System

This is already a real travel ERP backend.


## NOTIFICATION SERVICE

🧱 PHASE 1 — Service Setup

apps/notification-service/src/main.ts

```ts
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(3006, '0.0.0.0');
}
bootstrap();
```


🗄 PHASE 2 — Database Schema

📩 notifications

| Field      | Type      | Notes                            |
| ---------- | --------- | -------------------------------- |
| id         | UUID      | PK                               |
| user_id    | UUID      | Recipient                        |
| type       | enum      | email / sms / whatsapp           |
| status     | enum      | pending / sent / failed          |
| subject    | varchar   | Email subject                    |
| message    | text      | Body content                     |
| metadata   | jsonb     | Optional data (booking ID, etc.) |
| created_at | timestamp |                                  |

🔄 notification_logs

| Field           | Type      | Notes                  |
| --------------- | --------- | ---------------------- |
| notification_id | UUID      | FK                     |
| status          | enum      | sent / failed          |
| error           | text      | Optional error message |
| sent_at         | timestamp |                        |

📁 Folder Structure

notification-service/
 ├── email/
 │    ├── email.service.ts
 │    └── templates/
 ├── sms/
 │    └── sms.service.ts
 ├── whatsapp/
 │    └── whatsapp.service.ts
 ├── notifications/
 └── main.ts

📧 PHASE 3 — Email System

Example using SMTP / Nodemailer

```ts
@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, html });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

```

📱 PHASE 4 — SMS System

Example using Twilio or local gateway:

```ts
@Injectable()
export class SmsService {
  async sendSms(to: string, message: string) {
    // Use Twilio SDK or HTTP API of local provider
  }
}
```


🌍 PHASE 5 — WhatsApp / Chat Apps (Optional)

Use Twilio WhatsApp API or other provider

Similar pattern: sendMessage(to, message)

Good for automated booking confirmations


🔄 PHASE 6 — Event-Driven Notification Flow

Booking Service emits events:

```bash
booking.confirmed
booking.cancelled
payment.success
payment.failed

```


Notification Service listens:

```ts
@EventPattern('booking.confirmed')
async handleBookingConfirmed(data) {
  await this.sendBookingEmail(data);
  await this.sendBookingSMS(data);
}
```

#### 📩 PHASE 7 — Templates

Organize templates per type:

```bash
templates/
 ├── booking_confirmed.html
 ├── booking_cancelled.html
 └── payment_success.html
```


Use Handlebars or EJS to dynamically inject:

- User name
- Booking number
- Dates
- Amounts

#### ⚡ PHASE 8 — Queue System (Optional for Scale)

For high volume, use RabbitMQ / BullMQ

Push notification tasks to queue

Workers process them asynchronously

This prevents delays in API responses.


#### 🔐 PHASE 9 — Security & Best Practices

Never expose full booking/payment details in SMS

Emails should have booking reference only

Rate-limit notifications per user

Retry failed notifications automatically

✅ NOTIFICATION SERVICE READY

Now your system can:

✔ Send booking confirmations
✔ Send payment success/failure alerts
✔ Notify cancellations
✔ Handle high-volume async messages



## REPORTING & ADMIN ANALYTICS SERVICE

### 🧱 PHASE 1 — Service Setup

apps/reporting-service/src/main.ts

```ts
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(3007, '0.0.0.0');
}
bootstrap();
```


### 🗄 PHASE 2 — Database / Data Warehouse

For reporting, we use PostgreSQL or optionally a separate data warehouse.

Core Tables (Aggregated Data)

**1. booking_reports**

| Field          | Type    | Notes                       |
| -------------- | ------- | --------------------------- |
| id             | UUID    | PK                          |
| booking_date   | date    |                             |
| service_type   | enum    | hotel/tour/transfer         |
| total_bookings | int     | count                       |
| total_amount   | decimal | sum                         |
| status         | enum    | pending/confirmed/cancelled |


**2. payment_reports**

| Field              | Type    | Notes                    |
| ------------------ | ------- | ------------------------ |
| id                 | UUID    | PK                       |
| payment_date       | date    |                          |
| provider           | enum    | stripe/sslcommerz/wallet |
| total_transactions | int     | count                    |
| total_amount       | decimal | sum                      |
| success_rate       | decimal | %                        |



**3. agent_reports**

| Field            | Type    | Notes |
| ---------------- | ------- | ----- |
| id               | UUID    | PK    |
| agent_id         | UUID    |       |
| total_bookings   | int     | count |
| total_commission | decimal | sum   |
| active_customers | int     |       |


📁 Folder Structure

```bash
reporting-service/
 ├── bookings/
 ├── payments/
 ├── agents/
 ├── dashboards/
 └── main.ts
```

### 🔄 PHASE 3 — Event-Driven Aggregation

Use events from Booking & Payment services

Update reporting tables asynchronously

Example:

```ts
@EventPattern('booking.confirmed')
async handleBookingConfirmed(data) {
  await this.bookingReportService.update(data);
}

@EventPattern('payment.success')
async handlePaymentSuccess(data) {
  await this.paymentReportService.update(data);
}
```

### 📊 PHASE 4 — Reporting APIs

1️⃣ Booking Summary

```ts
@Get('bookings/summary')
@Roles('admin')
async getBookingSummary(@Query() filter: BookingReportFilter) {
  return this.bookingReportService.getSummary(filter);
}

```

Supports filters:

Date range

Service type

Agent


### 2️⃣ Payment Summary

```ts
@Get('payments/summary')
@Roles('admin')
async getPaymentSummary(@Query() filter: PaymentReportFilter) {
  return this.paymentReportService.getSummary(filter);
}
```
Total revenue
Success/failure rate
Gateway performance



3️⃣ Agent Performance

```ts
@Get('agents/performance')
@Roles('admin')
async getAgentPerformance(@Query() filter: AgentReportFilter) {
  return this.agentReportService.getPerformance(filter);
}
```


Total bookings
Commissions
Active customers


### ⚡ PHASE 5 — Dashboard Metrics

Admin panel can consume these APIs to show:

Total Bookings by Day / Month / Year

Revenue by Service / Agent

Top-selling Tours / Hotels

Failed Payment Trends

Commission Overview

Optionally integrate Chart.js / Recharts on frontend.


#### 🧠 PHASE 6 — Advanced Features

Pre-aggregate daily/weekly/monthly reports for performance

Store historical snapshots for audit

Multi-currency reporting with exchange rates

Drill-down analytics per agent / service / region

Export to CSV / Excel / PDF


#### 🔐 PHASE 7 — Security

Admin only

Role-based API access

Optional IP restrictions for sensitive reports


✅ REPORTING & ANALYTICS SERVICE READY

Your platform can now provide:

✔ Booking insights
✔ Payment trends
✔ Agent performance
✔ Revenue tracking
✔ Enterprise dashboards


## MULTI-CURRENCY & EXCHANGE RATE SERVICE

🧱 PHASE 1 — Service Setup

apps/currency-service/src/main.ts

```ts
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(3008, '0.0.0.0');
}
bootstrap();
```

🗄 PHASE 2 — Database Schema

#### 💱 currencies

| Field   | Type    | Notes                             |
| ------- | ------- | --------------------------------- |
| code    | varchar | USD, EUR, BDT, etc.               |
| name    | varchar | US Dollar, Euro, Bangladeshi Taka |
| symbol  | varchar | $, €, ৳                           |
| is_base | boolean | Only one base currency            |


#### 🔄 exchange_rates
| Field         | Type      | Notes           |
| ------------- | --------- | --------------- |
| id            | UUID      | PK              |
| from_currency | varchar   | e.g., USD       |
| to_currency   | varchar   | e.g., BDT       |
| rate          | decimal   | conversion rate |
| updated_at    | timestamp | last updated    |


#### 📁 Folder Structure

```ts
currency-service/
 ├── currencies/
 ├── exchange-rates/
 ├── services/
 └── main.ts
```

#### 🌐 PHASE 3 — Fetching Rates

Use public APIs like OpenExchangeRates, Fixer.io, or XE API

Cron job updates rates every 6 hours

Example:

```ts
@Injectable()
export class ExchangeRateService {
  async updateRates() {
    const response = await axios.get(`${process.env.EXCHANGE_API}?base=USD`);
    for (const [currency, rate] of Object.entries(response.data.rates)) {
      await this.prisma.exchangeRate.upsert({
        where: { from_to: `USD_${currency}` },
        update: { rate, updatedAt: new Date() },
        create: { fromCurrency: 'USD', toCurrency: currency, rate },
      });
    }
  }
}
```

🔄 PHASE 4 — Currency Conversion

Service method:

```ts
async convert(amount: number, from: string, to: string) {
  if (from === to) return amount;

  const rate = await this.prisma.exchangeRate.findUnique({
    where: { from_to: `${from}_${to}` },
  });

  if (!rate) throw new Error('Exchange rate not found');

  return amount * rate.rate;
}
```

📊 PHASE 5 — Integrating With Other Services

Hotel & Tour Service

Display prices in requested currency

Convert base price dynamically


```ts
const convertedPrice = await this.currencyService.convert(basePrice, 'USD', userCurrency);
```

Booking & Payment Service

Save snapshot of price in customer currency

Convert to gateway currency if needed


🔄 PHASE 6 — Event-Driven Updates (Optional)

When exchange rate updates, notify services via RabbitMQ

Services can recalculate displayed prices if necessary



🧠 PHASE 7 — Enterprise Features

✔ Multi-currency pricing per hotel/tour
✔ Historical rates for accurate booking snapshots
✔ Agent commission calculations in local currency
✔ Support for dynamic conversion fees





## SEARCH SERVICE

### 🧱 PHASE 1 — Service Setup

apps/search-service/src/main.ts

```ts
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(3009, '0.0.0.0');
}
bootstrap();
```

🗄 PHASE 2 — Install Elasticsearch Client

```bash
npm install @nestjs/elasticsearch @elastic/elasticsearch
```


📁 Folder Structure

```ts
search-service/
 ├── hotels/
 ├── tours/
 ├── services/
 │    └── elasticsearch.service.ts
 └── main.ts
```

🌐 PHASE 3 — Elasticsearch Connection

elasticsearch.service.ts


```ts
@Injectable()
export class ElasticsearchService {
  private client: Client;

  constructor() {
    this.client = new Client({ node: process.env.ELASTIC_NODE });
  }

  async indexDocument(index: string, id: string, body: any) {
    return this.client.index({
      index,
      id,
      body,
    });
  }

  async search(index: string, query: any) {
    return this.client.search({
      index,
      body: query,
    });
  }
}
```


🏨 PHASE 4 — Index Hotels & Tours
1️⃣ Hotel Index

```ts
async indexHotel(hotel: HotelDto) {
  await this.elasticsearchService.indexDocument('hotels', hotel.id, {
    name: hotel.name,
    city: hotel.city,
    country: hotel.country,
    star_rating: hotel.star_rating,
    price: hotel.min_price,
    amenities: hotel.amenities,
  });
}
```

2️⃣ Tour Index
```ts
async indexTour(tour: TourDto) {
  await this.elasticsearchService.indexDocument('tours', tour.id, {
    title: tour.title,
    city: tour.city,
    country: tour.country,
    duration_days: tour.duration_days,
    price: tour.base_price,
    tags: tour.tags,
  });
}
```

🔄 PHASE 5 — Real-Time Updates

Listen to events from services:

```bash
hotel.created / hotel.updated → Search Service indexes hotel
tour.created / tour.updated → Search Service indexes tour
```

🔍 PHASE 6 — Search API

```ts
@Get('hotels/search')
async searchHotels(@Query() query: SearchHotelDto) {
  const esQuery = {
    query: {
      bool: {
        must: [
          { match: { city: query.city } },
          { range: { price: { lte: query.max_price, gte: query.min_price } } },
        ],
        filter: [
          { term: { star_rating: query.star_rating } },
        ],
      },
    },
  };
  return this.elasticsearchService.search('hotels', esQuery);
}
```
Supports filtering:
✔ City / Country
✔ Price Range
✔ Star Rating
✔ Amenities

Can be extended for Tours similarly


🧠 PHASE 7 — Advanced Features

✔ Full-text search (hotel/tour name, description)
✔ Autocomplete / suggestions
✔ Faceted search (filters on amenities, duration, price)
✔ Multi-language support
✔ Location-based search (geo-distance queries)


🔐 PHASE 8 — Security

Only public search APIs are open

Admin search APIs can include unpublished items

Use API Gateway for authentication if needed