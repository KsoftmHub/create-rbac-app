# ⚛️ React + Vite + RBAC Template

Welcome to your new React application! This template is pre-configured with a powerful **Role-Based Access Control (RBAC)** system, **Redux State Management**, and **JWT Authentication**.

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pnpm install # or npm install
```

### 2. Run the App
```bash
npm run dev
```
Open the link shown in the terminal (usually `http://localhost:5173`).

---

## 🔐 Authentication & Persistent State

This app features a full-stack authentication flow:

### 1. JWT with Auto-Refresh
The app uses a **Universal Axios instance** (`src/api/axios.ts`) that:
-   Automatically attaches your Access Token to every request.
-   Handles 401 errors by attempting to rotate tokens via `/auth/refresh`.
-   Retries failed requests automatically after a successful refresh.

### 2. Redux State & Persistence
Auth state (user data and tokens) is managed by **Redux Toolkit** and persisted to local storage via **Redux Persist**. This ensures you stay logged in even after a page refresh.

### 3. Built-in Auth Pages
Ready-to-use, modern **Login** and **Register** pages are included at `src/pages/auth/`.

---

## 🛡️ Role-Based Access Control (RBAC)

### 1. The `<Guard>` Component
Wrap any part of your UI to show/hide it based on permissions:
```tsx
<Guard resource="todos" action="delete" fallback={<p>Locked</p>}>
  <button>Delete Resource</button>
</Guard>
```

### 2. The `useAuth()` Hook
Centralized hook for all auth and permission needs:
```tsx
const { user, isAuthenticated, hasPermission, login, logout } = useAuth();
```

---

## 🛠️ Customizing

1.  **Modify Permissions**: Roles and permissions are now fetched from the backend. Assign roles to users in your API database.
2.  **Add New Policies**: Local policy logic can still be added to `src/auth/policy.ts` for frontend-side checks.
3.  **Update Config**: Change `VITE_API_URL` in your `.env` file to point to your backend.

## 📚 Folder Structure

-   `src/api/` -> Universal Axios instance with interceptors.
-   `src/store/` -> Redux store and persistence config.
-   `src/hooks/` -> `useAuth` custom hook.
-   `src/pages/auth/` -> Login and Register pages.
-   `src/components/` -> `ProtectedRoute` and `Guard` components.
