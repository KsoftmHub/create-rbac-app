# NestJS API + RBAC Template

This template provides a specific NestJS backend structure with built-in RBAC/ABAC guards.

## Features
- **NestJS**: Modular architecture with Controllers, Services, and Modules.
- **Prisma**: Database ORM (Schema provided).
- **Guards & Decorators**: `@CheckPermissions('delete', 'todos', ...)` for declarative route protection.
- **Unified Logic**: Uses the same `policy.ts` engine structure as the frontend.

## Getting Started

1. `npm install`
2. `npx prisma generate`
3. `npm run start:dev`

## Usage

- Define database models in `prisma/schema.prisma`.
- Implement policy handlers in `src/auth/policy.ts`.
- Use the `@CheckPermissions` decorator on your Controller methods.
