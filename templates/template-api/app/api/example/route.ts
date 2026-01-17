import { NextResponse } from 'next/server';
import { hasPermission } from '@/lib/auth/policy';
import { User, Role } from '@/lib/auth/types';

// Mock Data Source
const TODOS = [
  { id: 't1', title: 'My Task', userId: 'u1', completed: true, invitedUsers: [] },
  { id: 't2', title: 'Others Task', userId: 'u2', completed: false, invitedUsers: [] },
];

export async function GET(request: Request) {
  // Mock User (Same as middleware, usually passed via headers or context)
  const user: User = {
    id: 'u1',
    email: 'alice@example.com',
    roles: [
      {
        name: 'User',
        permissions: [
          // Alice can View ONLY if she is Owner
          // But let's say she wants to list them.
          // Typically "list" is different from "view detail".
          // But we will filter the list based on permission.
          { resource: 'todos', action: 'view', policy: 'IS_OWNER' }
        ]
      }
    ]
  };

  // Filter the data based on permissions
  const visibleTodos = TODOS.filter(todo => {
    return hasPermission(user, 'todos', 'view', todo);
  });

  return NextResponse.json({
    data: visibleTodos,
    meta: {
      total: TODOS.length,
      visible: visibleTodos.length
    }
  });
}

export async function DELETE(request: Request) {
  // In a real route, we get ID from params or body
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const todo = TODOS.find(t => t.id === id);

  if (!todo) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const user: User = {
    id: 'u1',
    email: 'alice@example.com',
    roles: [
      {
        name: 'User',
        permissions: [
          { resource: 'todos', action: 'delete', policy: 'DELETE_OWN_COMPLETED' }
        ]
      }
    ]
  };

  const canDelete = hasPermission(user, 'todos', 'delete', todo);

  if (!canDelete) {
    return NextResponse.json({
      error: 'Forbidden',
      reason: 'Policy check failed (DELETE_OWN_COMPLETED)'
    }, { status: 403 });
  }

  // Perform delete...
  return NextResponse.json({ success: true, deletedId: id });
}
