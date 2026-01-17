# 🚀 Create RBAC App

**The easiest way to scaffold production-ready apps with built-in Role-Based Access Control (RBAC) and Full-Stack Authentication.**

This CLI tool generates two types of templates that share a **unified permission logic** and a **complete JWT system**:
1.  **Frontend**: React (Vite) + Typescript + Redux Toolkit + JWT Flow
2.  **Backend**: NestJS + Prisma (SQLite) + JWT Strategy

---

## 🔐 Production-Ready Authentication

Unlike other templates, we don't use mock data. Both templates are hardwired for security:

-   **JWT with Rotation**: Access Tokens (15m) and Refresh Tokens (7d) are handled out of the box.
-   **State Persistence**: Frontend state survives refreshes using Redux Persist.
-   **Token Interceptors**: Axios is configured to handle token injection and auto-refresh logic.
-   **End-to-End Encryption**: Secured by `@meebon/meebon-crypto` for sensitive payloads.

## ✨ Quick Start

You don't need to install anything globally. Just run:

```bash
npx create-rbac-app@latest
```

Follow the prompts:
1.  Enter your **Project Name**.
2.  Select a **Template**:
    -   `React (Vite + TS + RBAC + Redux)`
    -   `API (NestJS + Prisma + RBAC + JWT)`

The CLI will create the folder and copy all the necessary files.

## 📦 Templates Overview

### 1. React Template (Frontend)
-   **Tech Stack**: Vite, React, Redux Toolkit, Redux Persist, Tailwind, Lucide.
-   **Features**:
    -   **Redux Store**: Centralized auth state with persistence.
    -   **useAuth() Hook**: Easy interaction with authentication and permissions.
    -   **Guard System**: Declarative `<Guard>` component and `ProtectedRoute` for routing.
    -   **Auth Pages**: Beautiful, interactive Login and Register pages.

### 2. API Template (Backend)
-   **Tech Stack**: NestJS, Prisma (SQLite), Passport, bcrypt.
-   **Features**:
    -   **JWT Endpoints**: Full login, registration, and token refresh controllers.
    -   **Database Integration**: Real user and role persistence.
    -   **RBAC Guards**: Controller-level `@CheckPermissions()` enforcement.
    -   **Secure Hashing**: Password hashing via bcrypt.

---

*Unified permission definitions ensure your policy logic stays consistent from the backend to the frontend UI.*
