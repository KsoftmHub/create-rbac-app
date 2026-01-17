import { User, ResourceType } from './types';

// --- POLICY HANDLERS (The "How") ---
export const POLICY_HANDLERS = {
  ALWAYS_ALLOW: () => true,

  IS_OWNER: (user: User, data: any) =>
    data?.userId === user.id || data?.authorId === user.id,

  IS_COLLABORATOR: (user: User, data: any) =>
    data?.invitedUsers?.includes(user.id),

  OWNER_OR_COLLABORATOR: (user: User, data: any) =>
    POLICY_HANDLERS.IS_OWNER(user, data) || POLICY_HANDLERS.IS_COLLABORATOR(user, data),

  ONLY_IF_COMPLETED: (user: User, data: any) =>
    !!data?.completed,

  DELETE_OWN_COMPLETED: (user: User, data: any) =>
    POLICY_HANDLERS.IS_OWNER(user, data) && POLICY_HANDLERS.ONLY_IF_COMPLETED(user, data)
};

export type PolicyName = keyof typeof POLICY_HANDLERS;

// --- THE CORE ENGINE ---

/**
 * Pure function to check permissions.
 * Can be used in Node.js/API or React.
 */
export function hasPermission(
  user: User | null,
  resource: ResourceType,
  action: string,
  data?: any
): boolean {
  if (!user) return false;

  return user.roles.some((role) => {
    // 1. Find the permission for this resource and action
    const permission = role.permissions.find(
      (p) => p.resource === resource && p.action === action
    );

    if (!permission) return false;

    // 2. Map the DB policy string to the code function
    // Cast to any to access dynamic key if string is not narrow enough,
    // or typically we'd validate the string against PolicyName
    const handler = POLICY_HANDLERS[permission.policy as PolicyName];

    if (!handler) {
      console.warn(`Policy handler "${permission.policy}" not defined in code.`);
      return false;
    }

    // 3. Execute the logic
    return handler(user, data);
  });
}
