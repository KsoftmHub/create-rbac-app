# 🦁 NestJS API + RBAC Template

Welcome to your new NestJS API! This template is pre-configured with **Prisma** (Database) and a **Role-Based Access Control (RBAC)** system using Guards and Decorators.

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database (Prisma)
This template uses a local SQLite file (`dev.db`) by default, so you don't need to install Postgres or MySQL yet.

Generate the Prisma Client:
```bash
npx prisma generate
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

## 🔐 How Permissions Work

We use standard NestJS **Guards** to protect your routes. The logic matches the React template perfectly.

### 1. The `@CheckPermissions` Decorator
To protect a route (like `GET /api/example`), simply add the decorator to your Controller in `src/app.controller.ts`.

```typescript
@Get()
@UseGuards(AuthGuard, PoliciesGuard) // <--- 1. Apply the Guards
@CheckPermissions('view', 'todos', (req) => {
    // <--- 2. Define the Rule

    // (Optional) Return data for ABAC checks (like checking ownership)
    // For listing items, we might return null or filtered criteria
    return null;
})
getTodos() { ... }
```

### 2. The Logic (`src/auth/policy.ts`)
Just like the frontend, this file defines **HOW** permissions are checked.

```typescript
export const POLICY_HANDLERS = {
  IS_OWNER: (user, data) => data.userId === user.id,
};
```

### 3. Database Schema (`prisma/schema.prisma`)
We include a robust RBAC schema:
-   **User**: Has many Roles.
-   **Role**: Has many Permissions.
-   **Permission**: Links a `resource` + `action` to a `policy` string (e.g., "IS_OWNER").

## 🛠️ Customizing

1.  **Switch Database**: Change `provider = "sqlite"` to `"postgresql"` in `prisma/schema.prisma` and update your `.env` file.
2.  **Add Policies**: Add new logic to `src/auth/policy.ts`.
3.  **Real Auth**: Currently `AuthService` mocks a user ("Alice"). Connect this to a real JWT strategy in `src/auth/auth.service.ts` when ready.

## 📚 Folder Structure

-   `src/auth/` -> Auth Module, Guards, Decorators, and Policy Engine.
-   `src/app.controller.ts` -> Example Controller with protected routes.
-   `prisma/` -> Database schema.
