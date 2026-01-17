# Create RBAC App

A CLI tool to scaffold production-ready RBAC/ABAC enabled applications.

## Usage

```bash
npx create-rbac-app@latest
# or
npm init rbac-app
```

## Templates

### 1. React Template (Vite + TS)
- **Tech**: React, Vite, TypeScript
- **Features**:
  - `AuthContext` with mock user simulation.
  - `usePermission` hook (pure function logic).
  - `<Guard>` component for declarative checking.
  - Policy handlers in `src/auth/policy.ts`.

### 2. API Template (Next.js + Prisma)
- **Tech**: Next.js 13+, TypeScript, Prisma, SQLite (dev)
- **Features**:
  - Prisma Schema with User, Role, Permission models.
  - Shared `hasPermission` logic (same as frontend).
  - Middleware example for route protection.
  - API Route example with fine-grained checks (`DELETE only if owner + completed`).

## Publishing

To publish this CLI:
1. Ensure `templates/` directory is clean.
2. Run `npm run build`.
3. Run `npm publish`.
