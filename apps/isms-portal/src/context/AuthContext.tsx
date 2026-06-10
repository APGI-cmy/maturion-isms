import React, { createContext, useContext, useMemo, useState } from 'react';

export type User = { id: string; email: string } | null;

interface AuthContextValue {
  user: User;
  signIn: (email: string) => void;
  signOut: () => void;
}

const AUTH_STORAGE_KEY = 'isms_mock_user';

function readStoredUser(): User {
  if (typeof window === 'undefined') return null;

  const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as User;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  signIn: () => undefined,
  signOut: () => undefined,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => readStoredUser());

  const value = useMemo<AuthContextValue>(() => ({
    user,
    signIn: (email: string) => {
      const nextUser = { id: 'mock-user', email };
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
    },
    signOut: () => {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
    },
  }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  return useContext(AuthContext);
};
