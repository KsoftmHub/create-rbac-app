import { User } from './types';

// Same logic as React template for consistency
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
