import { Controller, Get, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/guards/auth.guard';
import { PoliciesGuard } from './auth/guards/policies.guard';
import { CheckPermissions } from './auth/decorators/check-permissions.decorator';
import { Request } from 'express';

// Mock DB Data
const TODOS = [
  { id: 't1', title: 'My Task', userId: 'u1', completed: true, invitedUsers: [] },
  { id: 't2', title: 'Others Task', userId: 'u2', completed: false, invitedUsers: [] },
];

@Controller('api/example')
export class AppController {

  @Get()
  @UseGuards(AuthGuard, PoliciesGuard)
  @CheckPermissions('view', 'todos', (req) => {
    // For a list view, we might not pass specific data to the policy check
    // unless we are checking "Can view THIS specific todo".
    // Here we might just check generic "view todos" if the policy allows.
    // OR, we filter the return list like we did in Next.js.
    // But Guards are boolean.

    // NestJS ABAC pattern: Data is often needed.
    // If the policy is "IS_OWNER", we need data.
    // If we list, we can't check owner of "all".

    // We will return generic data or null here, relying on the fact that
    // the guard will pass if the user has a permission that allows generic view
    // OR we implement logic to return filtered list in the handler.
    return null;
  })
  getTodos(@Req() req: any) {
    // In the handler, we can do further filtering
    // The Guard only ensured we have *some* permission to view todos.
    // Real implementation would filter based on policy.
    return { message: "You have generic view access. Filtering data...", data: TODOS };
  }

  @Delete()
  @UseGuards(AuthGuard, PoliciesGuard)
  @CheckPermissions('delete', 'todos', (req) => {
    // Determine which todo we are acting on (mocking query param id)
    const id = req.query.id as string;
    return TODOS.find(t => t.id === id);
  })
  deleteTodo(@Req() req: any) {
    return { success: true, message: `Deleted todo ${req.query.id} (Mock)` };
  }
}
