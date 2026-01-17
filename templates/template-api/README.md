# Next.js API + RBAC Template

This template provides a backend API structure with built-in RBAC/ABAC middleware.

## Features
- **Next.js 13+**: App Router structure.
- **Prisma**: Database ORM with User, Role, Permission schema.
- **Middleware**: Example `middleware.ts` for route protection.
- **Shared Logic**: Uses the same `policy.ts` structure as the frontend for consistency.

## Getting Started

1. `npm install`
2. `npx prisma generate`
3. `npm run dev`

## Usage

- Define database models in `prisma/schema.prisma`.
- Implement policy handlers in `lib/auth/policy.ts`.
- Use `hasPermission` in API routes or Middleware to check access.
