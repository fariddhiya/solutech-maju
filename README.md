# Solutech Technical Test - Backend Developer

REST API backend untuk technical test Solutech menggunakan Next.js App Router, TypeScript, Prisma, dan PostgreSQL.

## Tech Stack

- Next.js App Router
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod (validation)
- jsonwebtoken (JWT)
- bcryptjs (password hashing)

## Features Completed

- Authentication with JWT (login only)
- Product CRUD with pagination, search, and soft delete
- Order creation with transaction and stock reduction
- User-owned order list
- Input validation using Zod
- Consistent API response format
- Protected routes using Bearer token

## Project Structure

```
src/
  app/api/           # Route handlers
  lib/               # Shared utilities (prisma, jwt, response, errors, validation)
  middlewares/       # Auth middleware/helper
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
```

- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: Secret key for signing JWT.
- `JWT_EXPIRES_IN`: Token expiration time.

## Setup PostgreSQL Database

1. Install PostgreSQL locally or use Docker.
2. Create a database named `solutech_db`.
3. Create tables using one of these methods:

### Option A: Run SQL file

```bash
psql -U postgres -d solutech_db -f database/create_tables.sql
```

### Option B: Use Prisma Migrate

```bash
npx prisma migrate dev --name init
```

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

Seed creates one user and five sample products.

## Run Development Server

```bash
npm run dev
```

Server will run at `http://localhost:3000`.

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
    "items": [...]
  }
}
```

## Notes About Transaction and Stock Handling

- Order creation runs inside a single Prisma transaction.
- Products are fetched first, then validated for existence and sufficient stock.
- If any item is invalid or stock is insufficient, the entire transaction is rolled back.
- Product prices are taken from the database, not from the client request.
- Stock is reduced only after all validations pass.

## Technical Decisions

- Prisma transaction callback is used to guarantee atomicity for order creation.
- Soft delete is implemented by setting `isDeleted` and `deletedAt` instead of deleting rows.
- Layered architecture separates route, service, and repository for easier testing and maintenance.
- JWT is used for stateless authentication.

## Assumptions

- Only login is required for authentication (no registration endpoint).
- One admin seed user is enough for the technical test.
- Orders are immutable after creation (no update/delete order endpoint).

## Optional Features Not Implemented

- User registration
- Refresh token
- Order status / payment flow
- Admin role authorization
- Unit / integration tests

## Estimated Working Time

Approximately 4-6 hours for stages 1 to 5, depending on review and refinement time.
