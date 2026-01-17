# React + Vite + RBAC Template

This template provides a production-ready foundation for React applications with Role-Based Access Control (RBAC).

## Features
- **Vite**: Fast development server and build tool.
- **TypeScript**: Type safety for User, Role, and Permission objects.
- **AuthContext**: Manages user state and provides `usePermission` hook.
- **Guard Component**: `<Guard action="delete" resource="todos">...</Guard>` for declarative UI protection.
- **Policy Engine**: Centralized logic in `src/auth/policy.ts`.

## Getting Started

1. `npm install`
2. `npm run dev`

## Usage

Define your policies in `src/auth/policy.ts` and use the `<Guard>` component or `usePermission` hook to protect your UI.
