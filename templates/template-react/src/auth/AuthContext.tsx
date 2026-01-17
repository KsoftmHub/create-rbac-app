import React, { createContext, useContext, ReactNode } from 'react';
import { User, ResourceType } from './types';
import { hasPermission } from './policy';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => { },
  logout: () => { }
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);

  const login = (newUser: User) => setUser(newUser);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const usePermission = () => {
  const { user } = useAuth();

  return {
    can: (action: string, resource: ResourceType, data?: any) =>
      hasPermission(user, resource, action, data),
    user
  };
};
