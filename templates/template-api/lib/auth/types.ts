export type ResourceType = "todos" | "comments" | "users";

export interface Permission {
  resource: string;
  action: string;
  policy: string; // The link to our code logic
}

export interface Role {
  name: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  email: string;
  roles: Role[];
}
