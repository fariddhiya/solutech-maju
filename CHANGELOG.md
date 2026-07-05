# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Request logging with structured JSON logs.
- Rate limiting per IP address with configurable rules.
- Stricter rate limit for login endpoint.

## [1.0.0] - 2026-07-05

### Added
- Initial API release.
- JWT-based authentication with login endpoint.
- Product CRUD with pagination, search, and soft delete.
- Order creation with database transaction and stock reduction.
- User-owned order list.
- Zod input validation for auth, product, and order endpoints.
- Consistent JSON response format.
- Prisma error mapping to proper HTTP status codes.
- UUID validation for path parameters.
- Centralized error and success message constants.
- Environment variable validation at startup.
- Prisma seed for admin user and sample products.
- SQL create table file consistent with Prisma schema.
- Postman collection with example requests.
- Comprehensive README with setup and usage instructions.

### Security
- Password hashing using bcrypt.
- Protected product and order endpoints using Bearer token.
- JWT secret loaded from environment variable.
- No password or token logged in request logs.

### Technical
- Layered architecture: route handler, service, and repository.
- Prisma ORM with PostgreSQL.
- Next.js App Router route handlers.
- TypeScript strict mode.
- ESLint for code quality.
