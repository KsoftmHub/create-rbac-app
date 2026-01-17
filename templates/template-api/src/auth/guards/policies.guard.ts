import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { CHECK_POLICIES_KEY, PolicyHandlerParams } from '../decorators/check-permissions.decorator';
import { User } from '../types';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policy = this.reflector.get<PolicyHandlerParams>(
      CHECK_POLICIES_KEY,
      context.getHandler(),
    );

    if (!policy) {
      return true; // No policy defined, allow
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user; // Assumes AuthGuard has run and attached user

    if (!user) return false;

    // Resolve data for ABAC
    let data = undefined;
    if (policy.getData) {
      data = policy.getData(request);
    }

    return this.authService.hasPermission(user, policy.resource, policy.action, data);
  }
}
