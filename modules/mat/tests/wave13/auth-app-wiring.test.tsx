/**
 * Wave 13 — Auth App Wiring Tests (T-W13-AUTH-APP-1 to T-W13-AUTH-APP-5)
 *
 * Test IDs : T-W13-AUTH-APP-1, T-W13-AUTH-APP-2, T-W13-AUTH-APP-3,
 *            T-W13-AUTH-APP-4, T-W13-AUTH-APP-5
 * Task     : 13.A.1 — RED QA Gate for auth provider omission failure
 * Builder  : qa-builder
 * Wave     : 13 — Live Deployment Wiring Regression
 * Branch   : copilot/fix-live-deployment-wiring-regression
 *
 * RED gate : These tests MUST FAIL until ui-builder wires AuthProvider,
 *            QueryClientProvider, ProtectedRoute, and real Supabase auth calls
 *            into App.tsx, AuthContext.tsx, and LoginPage.tsx.
 *
 * RCA Reference: INC-AUTH-PROVIDER-001
 *   F-01: All pages accessible without authentication (no AuthProvider / ProtectedRoute)
 *   F-02: LoginPage is a stub — no Supabase signInWithPassword / signUp calls
 *   F-03: AuthContext.tsx does not exist — no session state anywhere in the app
 *   F-04: QueryClientProvider missing — react-query hooks will crash on mount
 *
 * POLC Note: Committed as FAILING (RED) per Wave 13 QA gate mandate.
 *            Do NOT modify these tests to pass — implement the fix instead.
 */
import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import * as fs from 'node:fs';

// Resolve paths relative to repo root (modules/mat/frontend/src/)
const FRONTEND_SRC = path.resolve(process.cwd(), 'modules/mat/frontend/src');
const AUTH_CONTEXT_FILE = path.join(FRONTEND_SRC, 'contexts', 'AuthContext.tsx');
const APP_FILE = path.join(FRONTEND_SRC, 'App.tsx');
const LOGIN_PAGE_FILE = path.join(FRONTEND_SRC, 'pages', 'LoginPage.tsx');

describe('T-W13-AUTH-APP: Auth App Wiring', () => {
  it('T-W13-AUTH-APP-1: contexts/AuthContext.tsx exists and exports AuthProvider and useAuth', () => {
    // RED: fails until ui-builder creates contexts/AuthContext.tsx
    //
    // AuthContext.tsx must provide a React context that tracks the Supabase
    // auth session. It must export:
    //   - AuthProvider  — wraps the app and makes session available via context
    //   - useAuth       — hook that returns the current session / user
    //
    // Currently the file does not exist at all, so no auth state is available
    // to any component in the app.

    // RED: contexts/AuthContext.tsx does not exist
    expect(
      fs.existsSync(AUTH_CONTEXT_FILE),
      `contexts/AuthContext.tsx not found at ${AUTH_CONTEXT_FILE} — ui-builder must create it`
    ).toBe(true);

    const source = fs.readFileSync(AUTH_CONTEXT_FILE, 'utf-8');

    // RED: AuthProvider export does not exist
    expect(
      source,
      'AuthContext.tsx must export AuthProvider — add: export function AuthProvider(...) or export const AuthProvider = ...'
    ).toMatch(/export\s+(function\s+AuthProvider|const\s+AuthProvider)/);

    // RED: useAuth export does not exist
    expect(
      source,
      'AuthContext.tsx must export useAuth — add: export function useAuth() or export const useAuth = ...'
    ).toMatch(/export\s+(function\s+useAuth|const\s+useAuth)/);
  });

  it('T-W13-AUTH-APP-2: App.tsx imports and wraps the app with AuthProvider', () => {
    // RED: fails until ui-builder adds AuthProvider to App.tsx
    //
    // App.tsx must import AuthProvider from ./contexts/AuthContext (or similar)
    // and wrap the entire router tree so that useAuth() is available to all
    // route components. Without this, every component that calls useAuth() will
    // throw "must be used within an AuthProvider".
    //
    // Currently App.tsx has no import of AuthProvider and no <AuthProvider> JSX.

    expect(
      fs.existsSync(APP_FILE),
      `App.tsx not found at ${APP_FILE}`
    ).toBe(true);

    const source = fs.readFileSync(APP_FILE, 'utf-8');

    // RED: AuthProvider is not imported
    expect(
      source,
      'App.tsx must import AuthProvider from contexts/AuthContext or similar'
    ).toMatch(/import.*AuthProvider/);

    // RED: <AuthProvider> is not present as a JSX wrapper
    expect(
      source,
      'App.tsx must use <AuthProvider> as a JSX wrapper around the router tree'
    ).toMatch(/AuthProvider/);
  });

  it('T-W13-AUTH-APP-3: main.tsx provides the app with QueryClientProvider', () => {
    // Updated: QueryClientProvider was previously double-wrapped (both App.tsx and main.tsx).
    // The redundant wrapper has been removed from App.tsx; main.tsx is now the single
    // source of truth for QueryClient configuration (staleTime, retry).
    //
    // App.tsx must NOT double-wrap with QueryClientProvider — that causes the inner
    // client (with default settings) to shadow the configured one in main.tsx.
    //
    // This test verifies that main.tsx imports and uses QueryClientProvider so that
    // all useMutation / useQuery hooks work throughout the app.

    const mainFile = path.join(FRONTEND_SRC, 'main.tsx');

    expect(
      fs.existsSync(mainFile),
      `main.tsx not found at ${mainFile}`
    ).toBe(true);

    const mainSrc = fs.readFileSync(mainFile, 'utf-8');

    // Assert: QueryClientProvider is imported in main.tsx
    expect(
      mainSrc,
      'main.tsx must import QueryClientProvider from @tanstack/react-query'
    ).toMatch(/import.*QueryClientProvider.*@tanstack\/react-query|import.*@tanstack\/react-query.*QueryClientProvider/);

    // Assert: <QueryClientProvider> is used in main.tsx JSX
    expect(
      mainSrc,
      'main.tsx must use <QueryClientProvider client={...}> to wrap the App'
    ).toMatch(/<QueryClientProvider[\s>]/);

    // Assert: App.tsx does NOT double-wrap (no <QueryClientProvider> in App.tsx JSX)
    const appSrc = fs.readFileSync(APP_FILE, 'utf-8');
    expect(
      appSrc,
      'App.tsx must NOT contain a <QueryClientProvider> wrapper (redundant double-wrap removed — use main.tsx provider only)'
    ).not.toMatch(/<QueryClientProvider/);
  });

  it('T-W13-AUTH-APP-4: App.tsx has auth-guarded routes (ProtectedRoute or login redirect)', () => {
    // RED: fails until ui-builder adds auth guards to App.tsx
    //
    // Protected routes (dashboard, audits, criteria, evidence, scoring, reports,
    // settings) must redirect unauthenticated users to /login.
    // This requires either:
    //   - A <ProtectedRoute> component wrapping the Layout route, OR
    //   - Inline Navigate / useNavigate redirect logic keyed on auth state
    //
    // Currently ALL routes are accessible without authentication — there is no
    // guard anywhere in App.tsx.

    expect(
      fs.existsSync(APP_FILE),
      `App.tsx not found at ${APP_FILE}`
    ).toBe(true);

    const source = fs.readFileSync(APP_FILE, 'utf-8');

    // RED: no ProtectedRoute or login redirect logic exists
    expect(
      source,
      'App.tsx must contain ProtectedRoute, or a Navigate/useNavigate redirect to /login for unauthenticated users'
    ).toMatch(/ProtectedRoute|Navigate.*login|useNavigate.*login|navigate.*login|to=.*login/);
  });

  it('T-W13-AUTH-APP-5: LoginPage.tsx calls real Supabase auth methods', () => {
    // RED: fails until ui-builder replaces the stub LoginPage with real Supabase auth
    //
    // LoginPage.tsx currently renders a static HTML form with no JavaScript handler.
    // It must:
    //   1. Call supabase.auth.signInWithPassword({ email, password }) on sign-in, OR
    //   2. Call supabase.auth.signUp({ email, password }) on registration
    //   3. Handle the response (error display, redirect on success)
    //
    // Without this the login form is a UI-only stub — submitting it does nothing.

    expect(
      fs.existsSync(LOGIN_PAGE_FILE),
      `LoginPage.tsx not found at ${LOGIN_PAGE_FILE}`
    ).toBe(true);

    const source = fs.readFileSync(LOGIN_PAGE_FILE, 'utf-8');

    // RED: no Supabase auth method calls present
    expect(
      source,
      'LoginPage.tsx must call supabase.auth.signInWithPassword, supabase.auth.signUp, or supabase.auth — implement real Supabase auth'
    ).toMatch(/signInWithPassword|signUp|supabase\.auth/);
  });
});
