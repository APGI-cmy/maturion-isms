import React, { createContext, useContext, useMemo, useState } from 'react';

export type MockRouteRole =
  | 'viewer'
  | 'contributor'
  | 'team_leader'
  | 'project_manager'
  | 'org_admin'
  | 'cs2_admin';

export type User = { id: string; email: string; role: MockRouteRole } | null;

interface AuthContextValue {
  user: User;
  signIn: (email: string) => void;
  signOut: () => void;
}

const AUTH_STORAGE_KEY = 'isms_mock_user';

const TEST_ROLE_EMAIL_PREFIXES: Array<[MockRouteRole, string[]]> = [
  ['cs2_admin', ['cs2-admin', 'cs2_admin', 'cs2admin']],
  ['org_admin', ['org-admin', 'org_admin', 'orgadmin']],
  ['project_manager', ['project-manager', 'project_manager', 'projectmanager']],
  ['team_leader', ['team-leader', 'team_leader', 'teamleader']],
  ['contributor', ['contributor']],
  ['viewer', ['viewer']],
];

export function resolveMockRouteRole(email: string): MockRouteRole {
  const localPart = email.trim().toLowerCase().split('@')[0] || '';

  for (const [role, prefixes] of TEST_ROLE_EMAIL_PREFIXES) {
    if (prefixes.some((prefix) => localPart.startsWith(prefix))) {
      return role;
    }
  }

  return 'project_manager';
}

function readStoredUser(): User {
  if (typeof window === 'undefined') return null;

  const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as Partial<NonNullable<User>>;

    if (!parsed.email) return null;

    return {
      id: parsed.id || 'mock-user',
      email: parsed.email,
      role: parsed.role || resolveMockRouteRole(parsed.email),
    };
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
      const trimmedEmail = email.trim();
      const nextUser = {
        id: 'mock-user',
        email: trimmedEmail,
        role: resolveMockRouteRole(trimmedEmail),
      };
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
