import React, { createContext, useContext } from 'react';

export type User = { id: string; email: string } | null;

interface AuthContextValue {
  user: User;
}

const AuthContext = createContext<AuthContextValue>({ user: null });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthContext.Provider value={{ user: null }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  return useContext(AuthContext);
};
