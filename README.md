# Solutech Technical Test - Backend Developer

REST API backend untuk technical test Solutech menggunakan Next.js App Router, TypeScript, Prisma, dan PostgreSQL.

## Tech Stack

- Next.js App Router
- TypeScript
- Prisma ORM v6
- PostgreSQL
- Zod (validation)
- jsonwebtoken (JWT)
- bcryptjs (password hashing)

## Features Completed

- Authentication with JWT (login only)
- Product CRUD with pagination, search, and soft delete
- Order creation with database transaction and stock reduction
- User-owned order list
- Input validation using Zod
- Consistent API response format
- Protected routes using Bearer token
- Prisma error mapping to proper HTTP status codes
- Request logging with structured JSON logs
- Rate limiting per IP (stricter for login)
- UUID validation for path parameters
- Environment variable validation at startup

## Project Structure

```
src/
  app/api/           # Route handlers
  constants/         # Error and success message constants
  lib/               # Shared utilities (config, prisma, jwt, response, errors, validation, prisma-error, logger, request-context, rate-limit)
  middlewares/       # Auth, logging, and rate limit middleware/helpers
  modules/           # Feature modules (auth, products, orders)
  types/             # Shared types
prisma/              # Prisma schema and seed
postman/             # Postman collection
database/            # SQL create table scripts
```

- `route.ts` only parses request, calls service, and returns response.
- `service.ts` contains business logic.
- `repository.ts` contains Prisma queries.

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/solutech_db?schema=public"
JWT_SECRET="your-secret-key-min-32-characters-long"
JWT_EXPIRES_IN="1d"

# Optional: Rate limiting and request logging
RATE_LIMIT_WINDOW_SECONDS=900
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_MAX_REQUESTS=5
ENABLE_REQUEST_LOGGING=true
ENABLE_RATE_LIMITING=true
```

- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: Secret key for signing JWT (minimum 32 characters recommended).
- `JWT_EXPIRES_IN`: Token expiration time (e.g., `1d`, `7d`, `1h`).
- `RATE_LIMIT_WINDOW_SECONDS`: Time window for rate limiting in seconds (default: 900 = 15 minutes).
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per IP per window for general API (default: 100).
- `LOGIN_RATE_LIMIT_MAX_REQUESTS`: Max login attempts per IP per window (default: 5).
- `ENABLE_REQUEST_LOGGING`: Toggle structured request logging (`true`/`false`).
- `ENABLE_RATE_LIMITING`: Toggle rate limiting (`true`/`false`).

Environment variables are validated at startup. The app will throw an error if required variables are missing.

## Setup PostgreSQL Database

1. Install PostgreSQL locally or use Docker.
2. Create a database named `solutech_db`.
3. Create tables using one of these methods:

### Option A: Run SQL file

```bash
psql -U postgres -d solutech_db -f database/create_tables.sql
```

### Option B: Use Prisma Migrate (Recommended for Production)

This project supports Prisma Migrate for version-controlled schema changes.

Initialize migrations from the current schema:

```bash
npx prisma migrate dev --name init
```

This will:
- Create the `prisma/migrations/` directory
- Generate the initial `migration.sql`
- Create and track the `_prisma_migrations` table in the database
- Apply the schema to the database

After the initial migration is created, future schema changes should use:

```bash
npx prisma migrate dev --name add_product_category
```

For production or CI/CD deployment:

```bash
npm run prisma:migrate:prod
```

This runs `prisma migrate deploy` which applies pending migrations without prompting.

Check migration status:

```bash
npm run prisma:status
```

## Schema Rollback Strategy

Prisma Migrate does not have an automatic `rollback` command. The recommended rollback approach is to create a new migration that performs the inverse operation.

### Example: Rollback After a Buggy Migration

Suppose a migration added a `category` column to `products`:

```bash
npx prisma migrate dev --name add_category_to_product
```

If this causes a bug in production, do not manually delete the migration file. Instead, create a new migration that undoes the change:

```bash
npx prisma migrate dev --name remove_category_from_product
```

Prisma will generate SQL such as:

```sql
ALTER TABLE products DROP COLUMN category;
```

This keeps all schema changes tracked in version control.

### Pre-Migration Backup

Always backup the database before applying migrations in production:

```bash
pg_dump -U postgres -d solutech_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore from Backup

If the migration caused critical issues and data cannot be recovered with an inverse migration, restore from backup:

```bash
psql -U postgres -d solutech_db < backup_YYYYMMDD_HHMMSS.sql
```

Then mark the problematic migration as rolled back in Prisma:

```bash
npx prisma migrate resolve --rolled-back "20260105120000_add_category_to_product"
```

This updates the `_prisma_migrations` table without changing the database schema.

### Important Notes

- The `database/create_tables.sql` file is kept as a fallback reference.
- Once Prisma Migrate is initialized, use `prisma migrate dev` for future schema changes.
- For zero-downtime deployments, prefer backward-compatible migrations (e.g., add nullable columns, add new endpoints) before removing old fields.

## Install Dependencies

```bash
npm install
```

## Run Prisma Generate

```bash
npm run prisma:generate
```

## Run Prisma Seed

```bash
npm run prisma:seed
```

Or using Prisma CLI directly:

```bash
npx prisma db seed
```

Seed creates one user and five sample products.

## Run Development Server

```bash
npm run dev
```

Server will run at `http://localhost:3000`.

## Run with Docker (One Command)

This project includes Docker and Docker Compose setup with PostgreSQL.

### Requirements

- Docker
- Docker Compose
- Make

### Quick Start

Run everything with one command:

```bash
make setup
```

This will:
1. Build the Docker image for the Next.js app.
2. Start the PostgreSQL container.
3. Wait for PostgreSQL to be healthy.
4. Start the app container.
5. Run `prisma migrate deploy` to apply migrations.
6. Run `prisma db seed` to seed the admin user and sample products.

After the command completes, the API is available at:

```
http://localhost:3000
```

PostgreSQL is available at:

```
localhost:5432
```

### Useful Make Commands

| Command | Description |
|---------|-------------|
| `make setup` | Build and start everything from scratch |
| `make up` | Start existing containers |
| `make down` | Stop containers |
| `make logs` | Follow container logs |
| `make clean` | Remove containers, volumes, and images |
| `make shell` | Open shell inside the app container |
| `make migrate` | Run `prisma migrate dev` inside the container |
| `make seed` | Run `prisma db seed` inside the container |
| `make status` | Check Prisma migration status |
| `make rebuild` | Rebuild and restart containers |

### Docker Notes

- The app uses Next.js standalone output for smaller production image.
- PostgreSQL data is persisted in a Docker volume named `postgres_data`.
- Environment variables for Docker are defined in `docker-compose.yml`.
- For production deployment, change `JWT_SECRET` to a strong random value in `docker-compose.yml` or use a secrets manager.
- The in-memory rate limiter is shared per container. For multi-container deployments, use Redis-based rate limiting.

## Test Using Postman

1. Import `postman/Solutech-Backend-Test.postman_collection.json`.
2. Set collection variable `base_url` to `http://localhost:3000`.
3. Send `POST /api/auth/login` with credentials below.
4. Copy the `token` from response.
5. Set collection variable `token` to the copied value.
6. Use other endpoints; they automatically use the token.

### Example Login Credentials

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

## Optional Features: Request Logging and Rate Limiting

These are value-added features implemented without overengineering the project.

### Request Logging

Every API request is logged as structured JSON to the console. Logged fields:

- `level`: `info` or `error`
- `requestId`: unique request identifier
- `method`: HTTP method
- `path`: URL path
- `statusCode`: response status code
- `durationMs`: request duration in milliseconds
- `ip`: client IP address
- `userAgent`: client user agent
- `timestamp`: ISO timestamp

Sensitive data such as password, JWT token, and Authorization header are **never** logged.

Example log:

```json
{
  "level": "info",
  "requestId": "req_123",
  "method": "POST",
  "path": "/api/auth/login",
  "statusCode": 200,
  "durationMs": 35,
  "ip": "127.0.0.1",
  "userAgent": "PostmanRuntime/7.37.0",
  "timestamp": "2026-07-05T12:00:00.000Z"
}
```

### Rate Limiting

Simple in-memory rate limiter using IP address as identifier.

Rules:

- General API: 100 requests per IP per 15 minutes.
- Login endpoint: 5 requests per IP per 15 minutes.

When limit is exceeded, the API returns:

```json
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "errors": null
}
```

HTTP status code: `429 Too Many Requests`.

### Test Rate Limiting in Postman

1. Send login request more than 5 times in 15 minutes.
2. The 6th request should return `429`.
3. For general API, send more than 100 requests in 15 minutes.
4. The 101st request should return `429`.

### Limitations

The in-memory rate limiter works well for local development and single-instance deployments. It is **not suitable** for multi-instance production because each server instance has its own memory store. For real production, use Redis-based rate limiting.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/products` | List products (paginated, searchable) |
| GET | `/api/products/:id` | Get product detail |
| POST | `/api/products` | Create product |
| PATCH | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Soft delete product |
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | List current user's orders |

## Example Request and Response

### Login

Request:

```json
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "...",
      "name": "Admin",
      "email": "admin@example.com"
    }
  }
}
```

### Create Product

Request:

```json
POST /api/products
Authorization: Bearer <token>
{
  "name": "Mechanical Keyboard",
  "description": "RGB mechanical keyboard",
  "price": 750000,
  "stock": 30
}
```

Response:

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "...",
    "name": "Mechanical Keyboard",
    "description": "RGB mechanical keyboard",
    "price": "750000.00",
    "stock": 30,
    "isDeleted": false,
    "createdAt": "...",
    "updatedAt": "...",
    "deletedAt": null
  }
}
```

### Create Order

Request:

```json
POST /api/orders
Authorization: Bearer <token>
{
  "items": [
    { "productId": "product_id_here", "quantity": 2 },
    { "productId": "another_product_id_here", "quantity": 1 }
  ]
}
```

Response:

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "...",
    "totalPrice": "150000.00",
    "items": [
      {
        "id": "...",
        "productId": "...",
        "quantity": 2,
        "price": "...",
        "subtotal": "...",
        "product": {
          "id": "...",
          "name": "...",
          "price": "..."
        }
      }
    ]
  }
}
```

## Notes About Transaction and Stock Handling

- Order creation runs inside a single Prisma transaction.
- Products are fetched first, then validated for existence and sufficient stock.
- If any item is invalid, product is deleted, or stock is insufficient, the entire transaction is rolled back.
- Product prices are taken from the database, not from the client request.
- Duplicate product IDs in the same order are rejected by validation.
- Stock is reduced only after all validations pass.

## Technical Decisions

- Prisma transaction callback is used to guarantee atomicity for order creation.
- Soft delete is implemented by setting `isDeleted` and `deletedAt` instead of deleting rows.
- Layered architecture separates route, service, and repository for easier testing and maintenance.
- JWT is used for stateless authentication.
- Prisma known errors are mapped to appropriate HTTP status codes (e.g., P2002 duplicate to 409, P2025 not found to 404).
- Request logging and rate limiting use in-memory store for simplicity.
- Environment variables are validated at startup to fail fast if configuration is missing.

## Assumptions

- Only login is required for authentication (no registration endpoint).
- One admin seed user is enough for the technical test.
- Orders are immutable after creation (no update/delete order endpoint).
- Product name is unique across all products.
- Rate limiting is acceptable using in-memory store for a technical test/local environment.

## Optional Features Not Implemented

- User registration
- Refresh token
- Logout / token blacklist
- Order status / payment flow
- Admin role authorization
- Unit / integration tests
- Product image upload
- Redis-based distributed rate limiting

## Estimated Working Time

Approximately 5-7 hours for complete implementation, documentation, and review.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run development server |
| `npm run build` | Build production app |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run Prisma migration |
| `npm run prisma:seed` | Seed database |
