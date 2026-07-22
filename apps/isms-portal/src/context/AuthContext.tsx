import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createPitSupabaseClient } from '@/lib/supabasePitProjectClient';

export type MockRouteRole =
  | 'viewer'
  | 'contributor'
  | 'team_leader'
  | 'project_manager'
  | 'org_admin'
  | 'cs2_admin';

export type User = { id: string; email: string; role: MockRouteRole; orgId?: string } | null;

interface AuthContextValue {
  user: User;
  loading: boolean;
  authError: string | null;
  signIn: (email: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AUTH_STORAGE_KEY = 'isms_mock_user';
const ROLE_PRIORITY: MockRouteRole[] = ['cs2_admin', 'org_admin', 'project_manager', 'team_leader', 'contributor', 'viewer'];
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
    if (prefixes.some((prefix) => localPart.startsWith(prefix))) return role;
  }
  return 'project_manager';
}

function readStoredMockUser(): User {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as Partial<NonNullable<User>>;
    if (!parsed.email) return null;
    return { id: parsed.id || 'mock-user', email: parsed.email, role: parsed.role || resolveMockRouteRole(parsed.email), orgId: parsed.orgId };
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function configuredClient(): SupabaseClient | null {
  try {
    return createPitSupabaseClient();
  } catch {
    return null;
  }
}

async function resolveSupabaseUser(client: SupabaseClient): Promise<User> {
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return null;
  const userId = data.user.id;
  const { data: memberships, error: membershipError } = await client
    .from('user_org_memberships').select('org_id').eq('user_id', userId).eq('status', 'active');
  if (membershipError || !memberships || memberships.length !== 1) return null;
  const orgId = String(memberships[0].org_id);
  const { data: roles, error: roleError } = await client
    .from('user_roles').select('role, org_id').eq('user_id', userId).or(`org_id.eq.${orgId},and(role.eq.cs2_admin,org_id.is.null)`);
  if (roleError) return null;
  const role = ROLE_PRIORITY.find((candidate) => roles?.some((entry) => entry.role === candidate));
  if (!role) return null;
  return { id: userId, email: data.user.email || '', role, orgId };
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  authError: null,
  signIn: async () => undefined,
  signOut: async () => undefined,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const client = useMemo(() => configuredClient(), []);

  useEffect(() => {
    let active = true;
    if (!client) {
      setUser(readStoredMockUser());
      setLoading(false);
      return;
    }
    void resolveSupabaseUser(client).then((resolved) => {
      if (active) setUser(resolved);
    }).finally(() => {
      if (active) setLoading(false);
    });
    const { data: listener } = client.auth.onAuthStateChange(() => {
      void resolveSupabaseUser(client).then((resolved) => active && setUser(resolved));
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [client]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    authError,
    signIn: async (email: string, password?: string) => {
      setAuthError(null);
      const trimmedEmail = email.trim();
      if (client) {
        if (!password) throw new Error('Password is required for the governed Supabase sign-in');
        const { error } = await client.auth.signInWithPassword({ email: trimmedEmail, password });
        if (error) {
          setAuthError(error.message);
          throw error;
        }
        const resolved = await resolveSupabaseUser(client);
        if (!resolved) {
          await client.auth.signOut();
          throw new Error('The account has no single active PIT organisation membership and role');
        }
        setUser(resolved);
        return;
      }
      const nextUser = { id: 'mock-user', email: trimmedEmail, role: resolveMockRouteRole(trimmedEmail) };
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
    },
    signOut: async () => {
      if (client) await client.auth.signOut();
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
    },
  }), [authError, client, loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => useContext(AuthContext);
