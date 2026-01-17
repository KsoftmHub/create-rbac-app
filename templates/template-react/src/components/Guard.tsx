import React, { ReactNode } from 'react';
import { usePermission } from '../auth/AuthContext';
import { ResourceType } from '../auth/types';

interface GuardProps {
  action: string;
  resource: ResourceType;
  data?: any;
  fallback?: ReactNode;
  children: ReactNode;
}

export const Guard = ({ action, resource, data, children, fallback = null }: GuardProps) => {
  const { can } = usePermission();

  if (can(action, resource, data)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
