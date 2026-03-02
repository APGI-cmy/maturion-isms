/**
 * Wave 13 — Auth Session Wiring Tests (T-W13-AUTH-1 to T-W13-AUTH-4)
 *
 * Test IDs : T-W13-AUTH-1, T-W13-AUTH-2, T-W13-AUTH-3, T-W13-AUTH-4
 * Task     : Wave 13 — Red QA Gate for the MAT module
 * Builder  : api-builder
 * Wave     : 13 — Live Deployment Wiring Regression
 * Branch   : copilot/fix-live-deployment-wiring-regression
 *
 * RED gate : These tests MUST FAIL until api-builder fixes auth session forwarding.
 *
 * RCA Reference: MAT-RCA-002
 *   F-01: User Not Authenticated when calling audit APIs
 *   F-10: Settings Not Authenticated — profile update silently fails
 *
 * POLC Note: Committed as FAILING (RED) per Wave 13 QA gate mandate.
 *            Do NOT modify these tests to pass — implement the fix instead.
 */
import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import * as fs from 'node:fs';

// Resolve paths relative to repo root (modules/mat/frontend/src/lib/)
const LIB_DIR = path.resolve(process.cwd(), 'modules/mat/frontend/src/lib');
const SUPABASE_FILE = path.join(LIB_DIR, 'supabase.ts');
const API_DIR = path.join(LIB_DIR, 'api');
const AUDITS_API_FILE = path.join(API_DIR, 'audits.ts');
const PROFILE_API_FILE = path.join(API_DIR, 'profile.ts');

describe('T-W13-AUTH: Auth Session Wiring', () => {
  it('T-W13-AUTH-1: getAuthenticatedClient is exported from lib/supabase.ts', () => {
    // RED: fails until api-builder adds getAuthenticatedClient to supabase.ts
    //
    // The function getAuthenticatedClient must be exported from the supabase module.
    // It retrieves the active session and returns an authenticated Supabase client.
    // Currently supabase.ts only exports `supabase` (the anonymous client) — no
    // authenticated session forwarding exists.
    expect(fs.existsSync(SUPABASE_FILE), `supabase.ts not found at ${SUPABASE_FILE}`).toBe(true);

    const source = fs.readFileSync(SUPABASE_FILE, 'utf-8');

    // RED: this export does not exist yet
    expect(
      source,
      'supabase.ts must export getAuthenticatedClient — add: export async function getAuthenticatedClient()'
    ).toMatch(/export\s+(async\s+)?function\s+getAuthenticatedClient/);
  });

  it('T-W13-AUTH-2: getSessionToken is exported from lib/supabase.ts', () => {
    // RED: fails until api-builder adds getSessionToken to supabase.ts
    //
    // The function getSessionToken must retrieve the current JWT access token
    // from the active session and return it as a string (or null if not authenticated).
    // This token must be forwarded as a Bearer header in authenticated API calls.
    expect(fs.existsSync(SUPABASE_FILE), `supabase.ts not found at ${SUPABASE_FILE}`).toBe(true);

    const source = fs.readFileSync(SUPABASE_FILE, 'utf-8');

    // RED: this export does not exist yet
    expect(
      source,
      'supabase.ts must export getSessionToken — add: export async function getSessionToken()'
    ).toMatch(/export\s+(async\s+)?function\s+getSessionToken/);
  });

  it('T-W13-AUTH-3: lib/api/audits.ts exists and exports createAudit with auth header', () => {
    // RED: fails until api-builder creates lib/api/audits.ts with auth-wired createAudit
    //
    // createAudit must use getSessionToken() to obtain the JWT and forward it
    // via the Authorization: Bearer <token> header (or via an authenticated client).
    // The function signature must accept at minimum: { title, organisation_id, status }.

    // RED: api/ directory doesn't exist yet
    expect(
      fs.existsSync(API_DIR),
      `lib/api/ directory not found at ${API_DIR} — api-builder must create it`
    ).toBe(true);

    expect(
      fs.existsSync(AUDITS_API_FILE),
      `lib/api/audits.ts not found at ${AUDITS_API_FILE} — api-builder must create it`
    ).toBe(true);

    const source = fs.readFileSync(AUDITS_API_FILE, 'utf-8');

    // RED: createAudit function doesn't exist
    expect(
      source,
      'lib/api/audits.ts must export createAudit'
    ).toMatch(/export\s+(async\s+)?function\s+createAudit/);

    // RED: auth header / authenticated client not wired
    expect(
      source,
      'createAudit must use getAuthenticatedClient or getSessionToken for auth'
    ).toMatch(/getAuthenticatedClient|getSessionToken|Authorization.*Bearer/);
  });

  it('T-W13-AUTH-4: lib/api/profile.ts exists and exports updateProfile with auth header', () => {
    // RED: fails until api-builder creates lib/api/profile.ts with auth-wired updateProfile
    //
    // updateProfile must use getSessionToken() / getAuthenticatedClient() to forward
    // the session JWT so the RLS policy on the profiles table allows the update.
    // Without auth, the profile update silently fails (RLS rejects unauthenticated writes).

    // RED: api/ directory doesn't exist yet
    expect(
      fs.existsSync(API_DIR),
      `lib/api/ directory not found at ${API_DIR} — api-builder must create it`
    ).toBe(true);

    expect(
      fs.existsSync(PROFILE_API_FILE),
      `lib/api/profile.ts not found at ${PROFILE_API_FILE} — api-builder must create it`
    ).toBe(true);

    const source = fs.readFileSync(PROFILE_API_FILE, 'utf-8');

    // RED: updateProfile function doesn't exist
    expect(
      source,
      'lib/api/profile.ts must export updateProfile'
    ).toMatch(/export\s+(async\s+)?function\s+updateProfile/);

    // RED: auth header / authenticated client not wired
    expect(
      source,
      'updateProfile must use getAuthenticatedClient or getSessionToken for auth'
    ).toMatch(/getAuthenticatedClient|getSessionToken|Authorization.*Bearer/);
  });
});
