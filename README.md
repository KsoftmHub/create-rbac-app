# 🚀 Create RBAC App

**The easiest way to scaffold production-ready apps with built-in Role-Based Access Control (RBAC).**

This CLI tool generates two types of templates that share a **unified permission logic**:
1.  **Frontend**: React (Vite) + TypeScript
2.  **Backend**: NestJS + Prisma + TypeScript

Both templates verify permissions using the exact same logic structure, making it easy to build full-stack apps where your "Policy Logic" is consistent everywhere.

## ✨ Quick Start

You don't need to install anything globally. Just run:

```bash
npx create-rbac-app@latest
```

Follow the prompts:
1.  Enter your **Project Name** (e.g., `my-super-app`).
2.  Select a **Template**:
    -   `React (Vite + TS + RBAC)`
    -   `API (NestJS + Prisma + RBAC)`

The CLI will create the folder and copy all the necessary files.

## 📦 Templates Overview

### 1. React Template (Frontend)
-   **Tech Stack**: Vite, React, TypeScript.
-   **Features**:
    -   **AuthContext**: Manages user login state.
    -   **`<Guard>` Component**: Protects UI elements declarative (e.g., hide "Delete" button if no permission).
    -   **`usePermission()` Hook**: Check permissions in your code logic.
    -   **Policy Engine**: Central file (`src/auth/policy.ts`) to define rules like `IS_OWNER` or `DELETE_OWN_COMPLETED`.

### 2. API Template (Backend)
-   **Tech Stack**: NestJS, Prisma (SQLite by default), TypeScript.
-   **Features**:
    -   **RBAC Guards**: Protect API endpoints automatically.
    -   **`@CheckPermissions()` Decorator**: Add rules to your Controllers easily.
    -   **Unified Logic**: Uses the same `src/auth/policy.ts` structure as the frontend.

## 🛠️ Developing the CLI (For Contributors)

If you want to modify *this* tool itself:

1.  Clone this repo.
2.  Run `npm install`.
3.  Make changes to `src/cli.ts` or the `templates/` folder.
4.  Run `npm run build` to bundle the CLI.
5.  Test locally: `node dist/cli.js my-test-project`

---

*Generated definitions for `User`, `Role`, and `Permission` are included in both templates out of the box.*
