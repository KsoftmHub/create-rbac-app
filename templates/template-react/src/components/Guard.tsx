import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface GuardProps {
  resource: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Guard: React.FC<GuardProps> = ({ resource, action, children, fallback = null }) => {
  const { hasPermission } = useAuth();

  if (hasPermission(resource, action)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
