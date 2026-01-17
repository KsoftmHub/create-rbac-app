import { Injectable } from '@nestjs/common';
import { User, ResourceType, Role } from './types';
import { POLICY_HANDLERS, PolicyName } from './policy';

@Injectable()
export class AuthService {
  // Mock User retrieval
  async getCurrentUser(): Promise<User> {
    return {
      id: "u1",
      email: "alice@example.com",
      roles: [
        {
          name: "User",
          permissions: [
            { resource: "todos", action: "view", policy: "IS_OWNER" },
            { resource: "todos", action: "delete", policy: "DELETE_OWN_COMPLETED" }
          ]
        }
      ]
    };
  }

  hasPermission(
    user: User,
    resource: ResourceType,
    action: string,
    data?: any
  ): boolean {
    if (!user) return false;

    return user.roles.some((role) => {
      const permission = role.permissions.find(
        (p) => p.resource === resource && p.action === action
      );

      if (!permission) return false;

      const handler = POLICY_HANDLERS[permission.policy as PolicyName];
      if (!handler) {
        console.warn(`Policy handler "${permission.policy}" not defined.`);
        return false;
      }

      return handler(user, data);
    });
  }
}
