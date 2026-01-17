# 🦁 NestJS API + RBAC Template

Welcome to your new NestJS API! This template is pre-configured with **Prisma** (Database), **JWT Authentication** (Access & Refresh Tokens), and a **Role-Based Access Control (RBAC)** system.

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database (Prisma)
This template uses a local SQLite file (`dev.db`) by default.

Generate the Prisma Client and migrate:
```bash
npx prisma generate
npx prisma migrate dev --name init
```
*(Optional) To view your database UI:*
```bash
npx prisma studio
```

### 3. Run the Server
```bash
npm run start:dev
```
The server will start at `http://localhost:3000`.

---

## 🔐 Authentication (JWT)

This API implements a robust JWT-based authentication system with **Refresh Tokens**.

### Endpoints
-   `POST /auth/register`: Create a new user account.
-   `POST /auth/login`: Authenticate and receive an Access Token (15m) and Refresh Token (7d).
-   `POST /auth/refresh`: Exchange a valid Refresh Token for a new Access Token (Token Rotation).

### Token Security
-   Access Tokens are used for authorizing requests via the `Bearer` scheme.
-   Refresh Tokens are stored in the database and rotated upon use to maximize security.

---

## 🛡️ Role-Based Access Control (RBAC)

We use standard NestJS **Guards** and **Passport JWT Strategy** to protect your routes.

### 1. The `@UseGuards(JwtAuthGuard)`
Protect any route or controller by adding the guard.

### 2. The `@CheckPermissions` Decorator
To enforce specific RBAC rules:
```typescript
@Get()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@CheckPermissions('view', 'todos')
getTodos() { ... }
```

### 3. The Logic (`src/auth/policy.ts`)
This file defines **HOW** permissions are checked. It handles policy strings like `IS_OWNER`.

---

## 🛠️ Customizing

1.  **Add Roles/Permissions**: Modify the database via Prisma Studio or scripts.
2.  **Add Policies**: Add new logic to `src/auth/policy.ts`.
3.  **JWT Secret**: Update `JWT_SECRET` in your `.env` file for production.

## 📚 Folder Structure

-   `src/auth/` -> JWT Strategy, Guards, Controllers, and Policy Engine.
-   `src/prisma/` -> Database service and connectivity.
-   `prisma/` -> Database schema and migrations.
