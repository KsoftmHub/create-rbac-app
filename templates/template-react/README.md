# ⚛️ React + Vite + RBAC Template

Welcome to your new React application! This template is pre-configured with a powerful **Role-Based Access Control (RBAC)** system.

## 🚀 Getting Started

### 1. Install Dependencies
Open your terminal in this folder and run:
```bash
npm install
```

### 2. Run the App
Start the development server:
```bash
npm run dev
```
Open the link shown in the terminal (usually `http://localhost:5173`).

---

## 🔐 How the Permissions Work

This app distinguishes between **"Authentication"** (Who are you?) and **"Authorization"** (What can you do?).

### 1. The Policy File (`src/auth/policy.ts`)
This is the brain of your permission system. It maps "Policy Strings" from your database (or mock data) to actual code.

```typescript
export const POLICY_HANDLERS = {
  // Simple rule: Always allow
  ALWAYS_ALLOW: () => true,

  // Complex rule: Allow only if user owns the data
  IS_OWNER: (user, data) => data.userId === user.id,

  // Composition: Reuse other rules!
  DELETE_OWN_COMPLETED: (user, data) =>
    POLICY_HANDLERS.IS_OWNER(user, data) && data.completed
};
```

### 2. The `<Guard>` Component
Use this wrapper to show/hide UI elements based on permissions.

```tsx
import { Guard } from './components/Guard';

<Guard
  action="delete"       // The action you want to check
  resource="todos"      // The resource you are acting on
  data={todo}           // The data needed for the check (e.g. to check owner)
  fallback={<span>🚫 No Access</span>} // (Optional) What to show if denied
>
  <button>Delete Button</button>
</Guard>
```

### 3. The `usePermission` Hook
Use this if you need to check permissions inside your functions or effects.

```tsx
const { can } = usePermission();

if (can('view', 'dashboard')) {
  console.log("User can view dashboard!");
}
```

## 🛠️ Customizing

1.  **Add Roles/Permissions**: Open `src/App.tsx` (or your real backend data) and add roles like "Manager" or "Editor" to your User object.
2.  **Add New Policies**: Go to `src/auth/policy.ts` and add a new function to `POLICY_HANDLERS`.
3.  **Update Types**: Edit `src/auth/types.ts` if you add new Resources (e.g., "products", "orders").

## 📚 Folder Structure

-   `src/auth/` -> Contains all permission logic (Context, Policy, Types).
-   `src/components/` -> Reusable UI components (Guard).
-   `src/App.tsx` -> Demo page showing how to use everything.
