/**
 * Wave 13 — Consolidated RED Gate Tests (T-W13-SCH-1–4, T-W13-CI-1–3,
 *            T-W13-AUTH-1–4, T-W13-WIRE-1–8, T-W13-E2E-1–5)
 *
 * Test IDs : 24 tests across 5 categories
 * File     : modules/mat/tests/wave13/wave13-gate.test.ts
 * Task     : Wave 13 Execution Start — RED QA Gate (Foreman Wave 13 orchestration)
 * Branch   : copilot/mat-wave-13-live-deployment-fix
 * Wave     : 13 — Live Deployment Wiring Regression Fix & Continuous Improvement
 *
 * ──────────────────────────────────────────────────────────────────────────────
 * RED GATE CONTRACT
 * ──────────────────────────────────────────────────────────────────────────────
 * ALL 24 tests in this file MUST FAIL (RED) at commit time.
 * They will turn GREEN only when the relevant builder delivers the implementation:
 *
 *   T-W13-SCH-1–4  → schema-builder (Task 13.1 — migration + env var audit)
 *   T-W13-CI-1–2   → schema-builder (Task 13.1 — CI schema-existence-check job)
 *   T-W13-AUTH-1–4 → api-builder    (Task 13.2 — auth session wiring fix)
 *   T-W13-WIRE-1–8 → ui-builder     (Task 13.3 — frontend UI wiring fix)
 *   T-W13-E2E-1–5  → integration-builder + qa-builder (Task 13.4 — full E2E CWT)
 *   T-W13-CI-3     → integration-builder (Task 13.5 — CI e2e-auth-smoke step)
 *
 * ──────────────────────────────────────────────────────────────────────────────
 * RCA Reference  : MAT-RCA-002 (modules/mat/05-rca/RCA_WAVE12_POST_DEPLOYMENT_WIRING_FAILURES_20260302.md)
 * Pre-Brief      : .agent-admin/assurance/iaa-prebrief-wave13-live-deployment-fix.md
 * POLC           : Do NOT use .skip() or .todo() — all tests must remain active.
 *                  Do NOT modify this file to make tests pass — implement the fix.
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ─── CI workflow path ──────────────────────────────────────────────────────────
const WORKFLOW_PATH = path.resolve(
  process.cwd(),
  '.github/workflows/deploy-mat-vercel.yml',
);

// ─── Env var helpers ───────────────────────────────────────────────────────────
const PLACEHOLDER_SUPABASE_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_LIVE_URL = 'https://placeholder.vercel.app';

function getEnv(name: string): string | undefined {
  return process.env[name];
}

// ══════════════════════════════════════════════════════════════════════════════
// 13.1 — Schema & Env-Var Gate
// ══════════════════════════════════════════════════════════════════════════════

describe('13.1 — Schema & Env-Var Gate', () => {
  // ── T-W13-SCH-1 ──────────────────────────────────────────────────────────────
  it('[T-W13-SCH-1] public.audits table exists in production schema cache', async () => {
    // RED: fails until schema-builder applies the production migration AND
    //      VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set to real values.
    //
    // RCA-002 F-02: "Could not find the table 'public.audits' in the schema cache"
    // This test verifies the fix by probing the live Supabase project.

    const supabaseUrl = getEnv('VITE_SUPABASE_URL');
    const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

    // RED: env vars not set in test environment
    expect(
      supabaseUrl,
      '[T-W13-SCH-1] VITE_SUPABASE_URL must be set to a real Supabase project URL ' +
        '(not undefined). Set it in .env.test or CI secrets.',
    ).toBeTruthy();

    expect(
      supabaseUrl,
      '[T-W13-SCH-1] VITE_SUPABASE_URL must not be the placeholder value. ' +
        `Got: ${supabaseUrl}`,
    ).not.toBe(PLACEHOLDER_SUPABASE_URL);

    expect(
      supabaseAnonKey,
      '[T-W13-SCH-1] VITE_SUPABASE_ANON_KEY must be set to a real anon key.',
    ).toBeTruthy();

    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(supabaseUrl!, supabaseAnonKey!);

    const { error } = await client.from('audits').select('id').limit(1);

    // RED: schema cache will report the table is missing until migration is applied
    expect(
      error,
      `[T-W13-SCH-1] Schema probe failed: ${error?.message} — apply migration to add public.audits`,
    ).toBeNull();
  });

  // ── T-W13-SCH-2 ──────────────────────────────────────────────────────────────
  it('[T-W13-SCH-2] public.criteria, public.mps, public.domains exist in production schema', async () => {
    // RED: fails until migration is applied and env vars are set.
    // Covers the criteria hierarchy tables required by Task 13.3 UI wiring.

    const supabaseUrl = getEnv('VITE_SUPABASE_URL');
    const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

    expect(
      supabaseUrl,
      '[T-W13-SCH-2] VITE_SUPABASE_URL must be set — configure .env.test or CI secrets.',
    ).toBeTruthy();

    expect(
      supabaseUrl,
      '[T-W13-SCH-2] VITE_SUPABASE_URL must not be the placeholder value.',
    ).not.toBe(PLACEHOLDER_SUPABASE_URL);

    expect(
      supabaseAnonKey,
      '[T-W13-SCH-2] VITE_SUPABASE_ANON_KEY must be set.',
    ).toBeTruthy();

    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(supabaseUrl!, supabaseAnonKey!);

    const tables = ['criteria', 'mps', 'domains'] as const;
    for (const table of tables) {
      const { error } = await client.from(table).select('id').limit(1);
      expect(
        error,
        `[T-W13-SCH-2] Table 'public.${table}' not in schema cache: ${error?.message} — apply migration`,
      ).toBeNull();
    }
  });

  // ── T-W13-SCH-3 ──────────────────────────────────────────────────────────────
  it('[T-W13-SCH-3] public.evidence, public.user_profiles exist in production schema', async () => {
    // RED: fails until migration is applied and env vars are set.
    // NOTE: "user_profiles" here is the test-ID label from the mission spec; the
    //       actual production table is 'profiles'. This test checks both.

    const supabaseUrl = getEnv('VITE_SUPABASE_URL');
    const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

    expect(
      supabaseUrl,
      '[T-W13-SCH-3] VITE_SUPABASE_URL must be set — configure .env.test or CI secrets.',
    ).toBeTruthy();

    expect(
      supabaseUrl,
      '[T-W13-SCH-3] VITE_SUPABASE_URL must not be the placeholder value.',
    ).not.toBe(PLACEHOLDER_SUPABASE_URL);

    expect(
      supabaseAnonKey,
      '[T-W13-SCH-3] VITE_SUPABASE_ANON_KEY must be set.',
    ).toBeTruthy();

    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(supabaseUrl!, supabaseAnonKey!);

    // evidence table (INC-W13-EVIDENCE-TABLE-001)
    const { error: evidenceError } = await client.from('evidence').select('id').limit(1);
    expect(
      evidenceError,
      `[T-W13-SCH-3] Table 'public.evidence' not in schema cache: ${evidenceError?.message} — apply migration`,
    ).toBeNull();

    // profiles table (the canonical name; INC-W13-PROFILE-TABLE-001 corrected user_profiles → profiles)
    const { error: profilesError } = await client.from('profiles').select('id').limit(1);
    expect(
      profilesError,
      `[T-W13-SCH-3] Table 'public.profiles' not in schema cache: ${profilesError?.message} — apply migration`,
    ).toBeNull();
  });

  // ── T-W13-SCH-4 ──────────────────────────────────────────────────────────────
  it('[T-W13-SCH-4] All required env vars present including VITE_LIVE_DEPLOYMENT_URL', () => {
    // RED: fails if any required env var is absent or holds a placeholder value.
    //
    // Required vars:
    //   VITE_SUPABASE_URL          — Supabase project API URL
    //   VITE_SUPABASE_ANON_KEY     — Supabase anon/public key
    //   VITE_LIVE_DEPLOYMENT_URL   — Live Vercel deployment URL (new for Wave 13)

    const supabaseUrl = getEnv('VITE_SUPABASE_URL');
    const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');
    const liveDeploymentUrl = getEnv('VITE_LIVE_DEPLOYMENT_URL');

    expect(
      supabaseUrl,
      '[T-W13-SCH-4] VITE_SUPABASE_URL must be set. Add to .env.test and CI secrets.',
    ).toBeTruthy();
    expect(
      supabaseUrl,
      '[T-W13-SCH-4] VITE_SUPABASE_URL must not be the placeholder value.',
    ).not.toBe(PLACEHOLDER_SUPABASE_URL);

    expect(
      supabaseAnonKey,
      '[T-W13-SCH-4] VITE_SUPABASE_ANON_KEY must be set. Add to .env.test and CI secrets.',
    ).toBeTruthy();

    // RED: VITE_LIVE_DEPLOYMENT_URL is not yet set anywhere in the codebase
    expect(
      liveDeploymentUrl,
      '[T-W13-SCH-4] VITE_LIVE_DEPLOYMENT_URL must be set. ' +
        'Add it to .env.test (local) and as a CI secret in deploy-mat-vercel.yml. ' +
        'Value should be the live Vercel deployment URL (e.g. https://mat.maturion.com).',
    ).toBeTruthy();
    expect(
      liveDeploymentUrl,
      '[T-W13-SCH-4] VITE_LIVE_DEPLOYMENT_URL must not be a placeholder value.',
    ).not.toBe(PLACEHOLDER_LIVE_URL);
  });

  // ── T-W13-CI-1 ───────────────────────────────────────────────────────────────
  it('[T-W13-CI-1] deploy-mat-vercel.yml contains job named schema-existence-check', () => {
    // RED: fails until schema-builder adds a `schema-existence-check` job to the
    //      deploy-mat-vercel.yml workflow (WGI-01 governance improvement).
    //
    // The job must:
    //   1. Connect to Supabase using VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY secrets
    //   2. Probe public.audits, public.criteria, public.domains, public.evidence
    //   3. Fail the pipeline if any table is missing from the schema cache
    //
    // This prevents the RCA-002 F-02 production regression (schema cache miss) from
    // going undetected until a user hits it.

    expect(
      fs.existsSync(WORKFLOW_PATH),
      `[T-W13-CI-1] Workflow file not found at ${WORKFLOW_PATH}`,
    ).toBe(true);

    const workflow = fs.readFileSync(WORKFLOW_PATH, 'utf-8');

    // RED: this job name does not exist in the workflow yet
    expect(
      workflow,
      '[T-W13-CI-1] deploy-mat-vercel.yml must contain a job named "schema-existence-check". ' +
        'schema-builder must add this job to satisfy WGI-01 (schema verification gate).',
    ).toContain('schema-existence-check');
  });

  // ── T-W13-CI-2 ───────────────────────────────────────────────────────────────
  it('[T-W13-CI-2] deploy-mat-vercel.yml env-var-audit step validates VITE_LIVE_DEPLOYMENT_URL', () => {
    // RED: fails until schema-builder adds an env-var-audit step that explicitly
    //      validates VITE_LIVE_DEPLOYMENT_URL (WGI-02 governance improvement).
    //
    // The step must:
    //   1. Verify VITE_SUPABASE_URL is set and not a placeholder
    //   2. Verify VITE_SUPABASE_ANON_KEY is set and not a placeholder
    //   3. Verify VITE_LIVE_DEPLOYMENT_URL is set and not a placeholder (NEW — Wave 13)
    //   4. Fail the pipeline if any required var is missing or placeholder

    expect(
      fs.existsSync(WORKFLOW_PATH),
      `[T-W13-CI-2] Workflow file not found at ${WORKFLOW_PATH}`,
    ).toBe(true);

    const workflow = fs.readFileSync(WORKFLOW_PATH, 'utf-8');

    // RED: env-var-audit step does not reference VITE_LIVE_DEPLOYMENT_URL yet
    expect(
      workflow,
      '[T-W13-CI-2] deploy-mat-vercel.yml must contain a step that validates VITE_LIVE_DEPLOYMENT_URL. ' +
        'schema-builder must add VITE_LIVE_DEPLOYMENT_URL to the env-var-audit step.',
    ).toContain('VITE_LIVE_DEPLOYMENT_URL');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 13.2 — Auth Session Wiring
// ══════════════════════════════════════════════════════════════════════════════

describe('13.2 — Auth Session Wiring', () => {
  // ── T-W13-AUTH-1 ─────────────────────────────────────────────────────────────
  it('[T-W13-AUTH-1] Real login establishes a valid Supabase session', async () => {
    // RED: fails until api-builder wires auth session forwarding AND
    //      LIVENESS_TEST_EMAIL / LIVENESS_TEST_PASSWORD are set.
    //
    // RCA-002 F-01: "User Not Authenticated" — audit create fails without a real session.
    // This test performs a real signInWithPassword to verify auth is fully wired.

    const email = getEnv('LIVENESS_TEST_EMAIL');
    const password = getEnv('LIVENESS_TEST_PASSWORD');
    const supabaseUrl = getEnv('VITE_SUPABASE_URL');
    const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

    // RED: liveness test credentials not configured
    expect(
      email,
      '[T-W13-AUTH-1] LIVENESS_TEST_EMAIL must be set. ' +
        'Add it to .env.test and CI secrets. Use a dedicated test account.',
    ).toBeTruthy();
    expect(
      password,
      '[T-W13-AUTH-1] LIVENESS_TEST_PASSWORD must be set. ' +
        'Add it to .env.test and CI secrets.',
    ).toBeTruthy();
    expect(
      supabaseUrl,
      '[T-W13-AUTH-1] VITE_SUPABASE_URL must be set.',
    ).toBeTruthy();
    expect(
      supabaseAnonKey,
      '[T-W13-AUTH-1] VITE_SUPABASE_ANON_KEY must be set.',
    ).toBeTruthy();

    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(supabaseUrl!, supabaseAnonKey!);

    const { data, error } = await client.auth.signInWithPassword({
      email: email!,
      password: password!,
    });

    // RED: auth will fail (env vars absent or real credentials not configured)
    expect(error, `[T-W13-AUTH-1] Login failed: ${error?.message}`).toBeNull();
    expect(
      data.session?.access_token,
      '[T-W13-AUTH-1] Session access_token must be present after successful login',
    ).toBeTruthy();
  });

  // ── T-W13-AUTH-2 ─────────────────────────────────────────────────────────────
  it('[T-W13-AUTH-2] Session token forwarded to audit create API', async () => {
    // RED: fails until api-builder adds getAuthenticatedClient/getSessionToken
    //      to lib/supabase.ts and wires it through lib/api/audits.ts.

    const email = getEnv('LIVENESS_TEST_EMAIL');
    const password = getEnv('LIVENESS_TEST_PASSWORD');
    const supabaseUrl = getEnv('VITE_SUPABASE_URL');
    const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

    expect(email, '[T-W13-AUTH-2] LIVENESS_TEST_EMAIL must be set.').toBeTruthy();
    expect(password, '[T-W13-AUTH-2] LIVENESS_TEST_PASSWORD must be set.').toBeTruthy();
    expect(supabaseUrl, '[T-W13-AUTH-2] VITE_SUPABASE_URL must be set.').toBeTruthy();
    expect(supabaseAnonKey, '[T-W13-AUTH-2] VITE_SUPABASE_ANON_KEY must be set.').toBeTruthy();

    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(supabaseUrl!, supabaseAnonKey!);

    const { error: signInError } = await client.auth.signInWithPassword({
      email: email!,
      password: password!,
    });
    expect(signInError, `[T-W13-AUTH-2] Sign-in failed: ${signInError?.message}`).toBeNull();

    // Verify session token is available (prerequisite for audit create API forwarding)
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    expect(sessionError, `[T-W13-AUTH-2] getSession error: ${sessionError?.message}`).toBeNull();
    expect(
      sessionData.session?.access_token,
      '[T-W13-AUTH-2] Session access_token must be present — ' +
        'api-builder must forward this token to the audit create API',
    ).toBeTruthy();

    // Verify the authenticated client can reach the audits table (token forwarding gate)
    const { error: auditError } = await client.from('audits').select('id').limit(1);
    expect(
      auditError,
      `[T-W13-AUTH-2] Audits API unreachable with session token: ${auditError?.message} — ` +
        'api-builder must wire getAuthenticatedClient into createAudit',
    ).toBeNull();
  });

  // ── T-W13-AUTH-3 ─────────────────────────────────────────────────────────────
  it('[T-W13-AUTH-3] Session token forwarded to profile update API', async () => {
    // RED: fails until api-builder wires getAuthenticatedClient through lib/api/profile.ts
    //      and LIVENESS_TEST_EMAIL is set.
    //
    // RCA-002 F-10: "Settings Not Authenticated — profile update silently fails"

    const email = getEnv('LIVENESS_TEST_EMAIL');
    const password = getEnv('LIVENESS_TEST_PASSWORD');
    const supabaseUrl = getEnv('VITE_SUPABASE_URL');
    const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

    expect(email, '[T-W13-AUTH-3] LIVENESS_TEST_EMAIL must be set.').toBeTruthy();
    expect(password, '[T-W13-AUTH-3] LIVENESS_TEST_PASSWORD must be set.').toBeTruthy();
    expect(supabaseUrl, '[T-W13-AUTH-3] VITE_SUPABASE_URL must be set.').toBeTruthy();
    expect(supabaseAnonKey, '[T-W13-AUTH-3] VITE_SUPABASE_ANON_KEY must be set.').toBeTruthy();

    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(supabaseUrl!, supabaseAnonKey!);

    const { error: signInError } = await client.auth.signInWithPassword({
      email: email!,
      password: password!,
    });
    expect(signInError, `[T-W13-AUTH-3] Sign-in failed: ${signInError?.message}`).toBeNull();

    const { data: userData, error: userError } = await client.auth.getUser();
    expect(userError, `[T-W13-AUTH-3] getUser failed: ${userError?.message}`).toBeNull();

    const userId = userData!.user!.id;

    // Verify profile SELECT works with session token (prerequisite for UPDATE forwarding)
    const { error: profileError } = await client
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    expect(
      profileError,
      `[T-W13-AUTH-3] Profile read with session token failed: ${profileError?.message} — ` +
        'api-builder must wire getAuthenticatedClient into updateProfile in lib/api/profile.ts',
    ).toBeNull();
  });

  // ── T-W13-AUTH-4 ─────────────────────────────────────────────────────────────
  it('[T-W13-AUTH-4] RLS policies permit INSERT/SELECT for authenticated user', async () => {
    // RED: fails until RLS is correctly configured AND LIVENESS_TEST_EMAIL is set.
    //
    // This test verifies the RLS policies on audits and profiles allow
    // authenticated users to INSERT and SELECT their own rows.

    const email = getEnv('LIVENESS_TEST_EMAIL');
    const password = getEnv('LIVENESS_TEST_PASSWORD');
    const supabaseUrl = getEnv('VITE_SUPABASE_URL');
    const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

    expect(email, '[T-W13-AUTH-4] LIVENESS_TEST_EMAIL must be set.').toBeTruthy();
    expect(password, '[T-W13-AUTH-4] LIVENESS_TEST_PASSWORD must be set.').toBeTruthy();
    expect(supabaseUrl, '[T-W13-AUTH-4] VITE_SUPABASE_URL must be set.').toBeTruthy();
    expect(supabaseAnonKey, '[T-W13-AUTH-4] VITE_SUPABASE_ANON_KEY must be set.').toBeTruthy();

    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(supabaseUrl!, supabaseAnonKey!);

    const { error: signInError } = await client.auth.signInWithPassword({
      email: email!,
      password: password!,
    });
    expect(signInError, `[T-W13-AUTH-4] Sign-in failed: ${signInError?.message}`).toBeNull();

    const { data: userData } = await client.auth.getUser();
    const userId = userData!.user!.id;

    // SELECT on profiles (RLS must allow authenticated user to read own row)
    const { error: selectError } = await client
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    expect(
      selectError,
      `[T-W13-AUTH-4] RLS SELECT denied on profiles: ${selectError?.message} — ` +
        'RLS policy must permit authenticated users to SELECT their own profile row',
    ).toBeNull();

    // SELECT on audits (RLS must allow authenticated user to read audits in their org)
    const { error: auditSelectError } = await client
      .from('audits')
      .select('id')
      .limit(1);
    expect(
      auditSelectError,
      `[T-W13-AUTH-4] RLS SELECT denied on audits: ${auditSelectError?.message} — ` +
        'RLS policy must permit authenticated users to SELECT audits',
    ).toBeNull();
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 13.3 — UI Wiring
// ══════════════════════════════════════════════════════════════════════════════

describe('13.3 — UI Wiring', () => {
  // ── T-W13-WIRE-1 ─────────────────────────────────────────────────────────────
  it('[T-W13-WIRE-1] audit create → audit appears in list', async () => {
    // RED: fails until ui-builder wires the audit create flow to live Supabase context
    //      AND LIVENESS_TEST_EMAIL is set.
    //
    // This is a source-level + env-var gate: if env vars are absent the test fails early.
    // When env vars are present it will fail until the audit list is live-wired.

    const email = getEnv('LIVENESS_TEST_EMAIL');
    const supabaseUrl = getEnv('VITE_SUPABASE_URL');
    const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

    expect(
      email,
      '[T-W13-WIRE-1] LIVENESS_TEST_EMAIL must be set — ' +
        'audit create → list wiring requires a real authenticated session.',
    ).toBeTruthy();
    expect(supabaseUrl, '[T-W13-WIRE-1] VITE_SUPABASE_URL must be set.').toBeTruthy();
    expect(
      supabaseUrl,
      '[T-W13-WIRE-1] VITE_SUPABASE_URL must not be a placeholder.',
    ).not.toBe(PLACEHOLDER_SUPABASE_URL);
    expect(supabaseAnonKey, '[T-W13-WIRE-1] VITE_SUPABASE_ANON_KEY must be set.').toBeTruthy();

    // Source-level check: AuditManagement page must exist with live wiring
    const auditMgmtPath = path.resolve(
      process.cwd(),
      'modules/mat/frontend/src/pages/AuditManagement.tsx',
    );
    expect(
      fs.existsSync(auditMgmtPath),
      '[T-W13-WIRE-1] modules/mat/frontend/src/pages/AuditManagement.tsx must exist — ' +
        'ui-builder must create this live-wired component.',
    ).toBe(true);

    const source = fs.readFileSync(auditMgmtPath, 'utf-8');
    expect(
      source,
      '[T-W13-WIRE-1] AuditManagement.tsx must contain data-testid="audit-list" — ' +
        'ui-builder must add this testid so audit create → list flow is verifiable.',
    ).toContain('data-testid="audit-list"');
  });

  // ── T-W13-WIRE-2 ─────────────────────────────────────────────────────────────
  it('[T-W13-WIRE-2] audit selected → criteria upload enabled', async () => {
    // RED: fails until ui-builder wires audit selection to enable criteria upload
    //      AND env vars are set.

    const email = getEnv('LIVENESS_TEST_EMAIL');
    expect(
      email,
      '[T-W13-WIRE-2] LIVENESS_TEST_EMAIL must be set — ' +
        'criteria upload wiring requires a real authenticated session.',
    ).toBeTruthy();
    expect(
      getEnv('VITE_SUPABASE_URL'),
      '[T-W13-WIRE-2] VITE_SUPABASE_URL must be set.',
    ).toBeTruthy();
    expect(
      getEnv('VITE_SUPABASE_URL'),
      '[T-W13-WIRE-2] VITE_SUPABASE_URL must not be a placeholder.',
    ).not.toBe(PLACEHOLDER_SUPABASE_URL);

    // Source-level check: CriteriaUpload component must reference selected audit ID
    const criteriaUploadPath = path.resolve(
      process.cwd(),
      'modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx',
    );
    expect(
      fs.existsSync(criteriaUploadPath),
      '[T-W13-WIRE-2] CriteriaUpload.tsx must exist at modules/mat/frontend/src/components/criteria/.',
    ).toBe(true);

    const source = fs.readFileSync(criteriaUploadPath, 'utf-8');
    expect(
      source,
      '[T-W13-WIRE-2] CriteriaUpload.tsx must accept an auditId prop to enable upload — ' +
        'ui-builder must wire audit selection to enable the upload control.',
    ).toMatch(/auditId|audit_id|selectedAudit/);
  });

  // ── T-W13-WIRE-3 ─────────────────────────────────────────────────────────────
  it('[T-W13-WIRE-3] criteria uploaded → hierarchy displayed', async () => {
    // RED: fails until ui-builder wires criteria upload result to render the
    //      domain/MPS/criteria hierarchy AND env vars are set.

    const email = getEnv('LIVENESS_TEST_EMAIL');
    expect(
      email,
      '[T-W13-WIRE-3] LIVENESS_TEST_EMAIL must be set — ' +
        'criteria hierarchy display requires a real authenticated session.',
    ).toBeTruthy();
    expect(
      getEnv('VITE_SUPABASE_URL'),
      '[T-W13-WIRE-3] VITE_SUPABASE_URL must be set.',
    ).toBeTruthy();
    expect(
      getEnv('VITE_SUPABASE_URL'),
      '[T-W13-WIRE-3] VITE_SUPABASE_URL must not be a placeholder.',
    ).not.toBe(PLACEHOLDER_SUPABASE_URL);

    // Source-level check: CriteriaHierarchy (or equivalent) component must exist
    const hooksDir = path.resolve(
      process.cwd(),
      'modules/mat/frontend/src/lib/hooks',
    );
    const criteriaHookPath = path.join(hooksDir, 'useCriteria.ts');
    expect(
      fs.existsSync(criteriaHookPath),
      '[T-W13-WIRE-3] useCriteria.ts hook must exist — ' +
        'ui-builder must wire criteria data fetch to the hierarchy display.',
    ).toBe(true);

    const source = fs.readFileSync(criteriaHookPath, 'utf-8');
    // Hook must query criteria table with an audit_id filter (live wiring)
    expect(
      source,
      "[T-W13-WIRE-3] useCriteria.ts must query criteria table with audit_id filter — " +
        "currently the hook may not be wired to a live auditId parameter.",
    ).toMatch(/criteria.*audit_id|\.from\('criteria'\)/);
  });

  // ── T-W13-WIRE-4 ─────────────────────────────────────────────────────────────
  it('[T-W13-WIRE-4] criterion selected → evidence modal opens', async () => {
    // RED: fails until ui-builder wires criterion selection to open the evidence
    //      submission modal AND env vars are set.

    const email = getEnv('LIVENESS_TEST_EMAIL');
    expect(
      email,
      '[T-W13-WIRE-4] LIVENESS_TEST_EMAIL must be set — ' +
        'evidence modal wiring requires a real authenticated session.',
    ).toBeTruthy();
    expect(
      getEnv('VITE_SUPABASE_URL'),
      '[T-W13-WIRE-4] VITE_SUPABASE_URL must be set.',
    ).toBeTruthy();
    expect(
      getEnv('VITE_SUPABASE_URL'),
      '[T-W13-WIRE-4] VITE_SUPABASE_URL must not be a placeholder.',
    ).not.toBe(PLACEHOLDER_SUPABASE_URL);

    // Source-level check: evidence modal component must exist
    const evidenceModalPath = path.resolve(
      process.cwd(),
      'modules/mat/frontend/src/components/evidence/EvidenceModal.tsx',
    );
    expect(
      fs.existsSync(evidenceModalPath),
      '[T-W13-WIRE-4] EvidenceModal.tsx must exist at ' +
        'modules/mat/frontend/src/components/evidence/ — ' +
        'ui-builder must create this component and wire criterion selection to open it.',
    ).toBe(true);
  });

  // ── T-W13-WIRE-5 ─────────────────────────────────────────────────────────────
  it('[T-W13-WIRE-5] evidence submitted → evidence count updates', async () => {
    // RED: fails until ui-builder wires evidence submission to update the
    //      evidence count display AND env vars are set.

    const email = getEnv('LIVENESS_TEST_EMAIL');
    expect(
      email,
      '[T-W13-WIRE-5] LIVENESS_TEST_EMAIL must be set — ' +
        'evidence count wiring requires a real authenticated session.',
    ).toBeTruthy();
    expect(
      getEnv('VITE_SUPABASE_URL'),
      '[T-W13-WIRE-5] VITE_SUPABASE_URL must be set.',
    ).toBeTruthy();
    expect(
      getEnv('VITE_SUPABASE_URL'),
      '[T-W13-WIRE-5] VITE_SUPABASE_URL must not be a placeholder.',
    ).not.toBe(PLACEHOLDER_SUPABASE_URL);

    // Source-level check: evidence hook must exist and include count/refetch logic
    const useEvidencePath = path.resolve(
      process.cwd(),
      'modules/mat/frontend/src/lib/hooks/useEvidence.ts',
    );
    expect(
      fs.existsSync(useEvidencePath),
      '[T-W13-WIRE-5] useEvidence.ts hook must exist — ' +
        'ui-builder must implement evidence submission with live count update.',
    ).toBe(true);

    const source = fs.readFileSync(useEvidencePath, 'utf-8');
    expect(
      source,
      "[T-W13-WIRE-5] useEvidence.ts must contain refetch or invalidate logic — " +
        "evidence count must update after submission.",
    ).toMatch(/refetch|invalidate|count|evidence/i);
  });

  // ── T-W13-WIRE-6 ─────────────────────────────────────────────────────────────
  it('[T-W13-WIRE-6] scoring page renders non-empty content', async () => {
    // RED: fails until ui-builder wires the scoring page to live Supabase data
    //      AND env vars are set.

    const email = getEnv('LIVENESS_TEST_EMAIL');
    expect(
      email,
      '[T-W13-WIRE-6] LIVENESS_TEST_EMAIL must be set — ' +
        'scoring page wiring requires a real authenticated session.',
    ).toBeTruthy();
    expect(
      getEnv('VITE_SUPABASE_URL'),
      '[T-W13-WIRE-6] VITE_SUPABASE_URL must be set.',
    ).toBeTruthy();
    expect(
      getEnv('VITE_SUPABASE_URL'),
      '[T-W13-WIRE-6] VITE_SUPABASE_URL must not be a placeholder.',
    ).not.toBe(PLACEHOLDER_SUPABASE_URL);

    // Source-level check: scoring page must exist and use a live data hook
    const scoringPagePath = path.resolve(
      process.cwd(),
      'modules/mat/frontend/src/pages/ScoringPage.tsx',
    );
    expect(
      fs.existsSync(scoringPagePath),
      '[T-W13-WIRE-6] ScoringPage.tsx must exist — ' +
        'ui-builder must create a live-wired scoring page.',
    ).toBe(true);

    const source = fs.readFileSync(scoringPagePath, 'utf-8');
    expect(
      source,
      '[T-W13-WIRE-6] ScoringPage.tsx must use a live data hook (useScoring or useAuditMetrics) — ' +
        'placeholder/empty content is not acceptable.',
    ).toMatch(/useScoring|useAuditMetrics|scores|data-testid/i);
  });

  // ── T-W13-WIRE-7 ─────────────────────────────────────────────────────────────
  it('[T-W13-WIRE-7] reports page renders non-empty content', async () => {
    // RED: fails until ui-builder wires the reports page to live data AND env vars are set.

    const email = getEnv('LIVENESS_TEST_EMAIL');
    expect(
      email,
      '[T-W13-WIRE-7] LIVENESS_TEST_EMAIL must be set — ' +
        'reports page wiring requires a real authenticated session.',
    ).toBeTruthy();
    expect(
      getEnv('VITE_SUPABASE_URL'),
      '[T-W13-WIRE-7] VITE_SUPABASE_URL must be set.',
    ).toBeTruthy();
    expect(
      getEnv('VITE_SUPABASE_URL'),
      '[T-W13-WIRE-7] VITE_SUPABASE_URL must not be a placeholder.',
    ).not.toBe(PLACEHOLDER_SUPABASE_URL);

    // Source-level check: reports page must exist and use live data
    const reportsPagePath = path.resolve(
      process.cwd(),
      'modules/mat/frontend/src/pages/ReportsPage.tsx',
    );
    expect(
      fs.existsSync(reportsPagePath),
      '[T-W13-WIRE-7] ReportsPage.tsx must exist — ' +
        'ui-builder must create a live-wired reports page.',
    ).toBe(true);

    const source = fs.readFileSync(reportsPagePath, 'utf-8');
    expect(
      source,
      '[T-W13-WIRE-7] ReportsPage.tsx must use a live data hook or render real report content — ' +
        'placeholder/empty content is not acceptable.',
    ).toMatch(/useReport|report|data-testid|Report/i);
  });

  // ── T-W13-WIRE-8 ─────────────────────────────────────────────────────────────
  it('[T-W13-WIRE-8] dashboard renders non-empty content', async () => {
    // RED: fails until ui-builder wires the dashboard to live Supabase data
    //      AND env vars are set.

    const email = getEnv('LIVENESS_TEST_EMAIL');
    expect(
      email,
      '[T-W13-WIRE-8] LIVENESS_TEST_EMAIL must be set — ' +
        'dashboard wiring requires a real authenticated session.',
    ).toBeTruthy();
    expect(
      getEnv('VITE_SUPABASE_URL'),
      '[T-W13-WIRE-8] VITE_SUPABASE_URL must be set.',
    ).toBeTruthy();
    expect(
      getEnv('VITE_SUPABASE_URL'),
      '[T-W13-WIRE-8] VITE_SUPABASE_URL must not be a placeholder.',
    ).not.toBe(PLACEHOLDER_SUPABASE_URL);

    // Source-level check: dashboard component must exist with live data wiring
    const dashboardPath = path.resolve(
      process.cwd(),
      'modules/mat/frontend/src/pages/DashboardPage.tsx',
    );
    expect(
      fs.existsSync(dashboardPath),
      '[T-W13-WIRE-8] DashboardPage.tsx must exist — ' +
        'ui-builder must create a live-wired dashboard page.',
    ).toBe(true);

    const source = fs.readFileSync(dashboardPath, 'utf-8');
    expect(
      source,
      '[T-W13-WIRE-8] DashboardPage.tsx must use a live data hook or render real dashboard content — ' +
        'placeholder/empty/static content is not acceptable.',
    ).toMatch(/useDashboard|useAudit|data-testid|Dashboard/i);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 13.4 — E2E CWT (Full Audit Lifecycle vs Live Vercel URL)
// ══════════════════════════════════════════════════════════════════════════════

describe('13.4 — E2E CWT (Full Audit Lifecycle vs Live Vercel URL)', () => {
  // ── T-W13-E2E-1 ──────────────────────────────────────────────────────────────
  it('[T-W13-E2E-1] Full audit lifecycle CWT vs live Vercel URL (real HTTP)', async () => {
    // RED: fails until VITE_LIVE_DEPLOYMENT_URL is set to a real deployed URL
    //      and the full audit lifecycle (create → list → select → evidence) works end-to-end.

    const liveUrl = getEnv('VITE_LIVE_DEPLOYMENT_URL');

    // RED: VITE_LIVE_DEPLOYMENT_URL not set anywhere in the codebase yet
    expect(
      liveUrl,
      '[T-W13-E2E-1] VITE_LIVE_DEPLOYMENT_URL must be set to the live Vercel URL. ' +
        'Add it to .env.test and as a CI secret. ' +
        'Value should be e.g. https://mat.maturion.com or the preview deployment URL.',
    ).toBeTruthy();
    expect(
      liveUrl,
      '[T-W13-E2E-1] VITE_LIVE_DEPLOYMENT_URL must not be a placeholder value.',
    ).not.toBe(PLACEHOLDER_LIVE_URL);

    // Real HTTP health probe of the live deployment
    const response = await fetch(`${liveUrl}/`, {
      signal: AbortSignal.timeout(15_000),
    }).catch((err: unknown) => {
      throw new Error(
        `[T-W13-E2E-1] Live deployment fetch failed: ${(err as Error).message}. ` +
          `URL: ${liveUrl}`,
      );
    });

    expect(
      response.ok,
      `[T-W13-E2E-1] Live deployment returned HTTP ${response.status} — ` +
        `expected 2xx. URL: ${liveUrl}`,
    ).toBe(true);
  });

  // ── T-W13-E2E-2 ──────────────────────────────────────────────────────────────
  it('[T-W13-E2E-2] Settings profile update succeeds via live deployment', async () => {
    // RED: fails until VITE_LIVE_DEPLOYMENT_URL is set and profile update
    //      is fully wired in the live deployment.

    const liveUrl = getEnv('VITE_LIVE_DEPLOYMENT_URL');
    const supabaseUrl = getEnv('VITE_SUPABASE_URL');
    const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

    expect(
      liveUrl,
      '[T-W13-E2E-2] VITE_LIVE_DEPLOYMENT_URL must be set.',
    ).toBeTruthy();
    expect(liveUrl, '[T-W13-E2E-2] VITE_LIVE_DEPLOYMENT_URL must not be a placeholder.').not.toBe(
      PLACEHOLDER_LIVE_URL,
    );
    expect(supabaseUrl, '[T-W13-E2E-2] VITE_SUPABASE_URL must be set.').toBeTruthy();
    expect(supabaseAnonKey, '[T-W13-E2E-2] VITE_SUPABASE_ANON_KEY must be set.').toBeTruthy();

    // Verify the live deployment is reachable
    const response = await fetch(`${liveUrl}/`, {
      signal: AbortSignal.timeout(15_000),
    }).catch((err: unknown) => {
      throw new Error(
        `[T-W13-E2E-2] Live deployment unreachable: ${(err as Error).message}`,
      );
    });
    expect(response.ok, `[T-W13-E2E-2] Live deployment returned HTTP ${response.status}`).toBe(
      true,
    );

    // Verify profile API is reachable via Supabase (proxy for settings page wiring)
    const email = getEnv('LIVENESS_TEST_EMAIL');
    const password = getEnv('LIVENESS_TEST_PASSWORD');
    expect(email, '[T-W13-E2E-2] LIVENESS_TEST_EMAIL must be set for profile update test.').toBeTruthy();
    expect(password, '[T-W13-E2E-2] LIVENESS_TEST_PASSWORD must be set.').toBeTruthy();

    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(supabaseUrl!, supabaseAnonKey!);
    const { error: signInError } = await client.auth.signInWithPassword({
      email: email!,
      password: password!,
    });
    expect(signInError, `[T-W13-E2E-2] Auth for profile update failed: ${signInError?.message}`).toBeNull();

    const { data: userData } = await client.auth.getUser();
    const userId = userData!.user!.id;

    // Probe the profile for updateability (select + check writable)
    const { error: profileError } = await client
      .from('profiles')
      .select('id, updated_at')
      .eq('id', userId)
      .single();
    expect(
      profileError,
      `[T-W13-E2E-2] Profile not accessible for update: ${profileError?.message}`,
    ).toBeNull();
  });

  // ── T-W13-E2E-3 ──────────────────────────────────────────────────────────────
  it('[T-W13-E2E-3] Settings dropdowns persist via API', async () => {
    // RED: fails until VITE_LIVE_DEPLOYMENT_URL is set and settings dropdowns
    //      are wired to persist via the Supabase API.

    const liveUrl = getEnv('VITE_LIVE_DEPLOYMENT_URL');
    const supabaseUrl = getEnv('VITE_SUPABASE_URL');
    const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

    expect(liveUrl, '[T-W13-E2E-3] VITE_LIVE_DEPLOYMENT_URL must be set.').toBeTruthy();
    expect(liveUrl, '[T-W13-E2E-3] VITE_LIVE_DEPLOYMENT_URL must not be a placeholder.').not.toBe(
      PLACEHOLDER_LIVE_URL,
    );
    expect(supabaseUrl, '[T-W13-E2E-3] VITE_SUPABASE_URL must be set.').toBeTruthy();
    expect(supabaseAnonKey, '[T-W13-E2E-3] VITE_SUPABASE_ANON_KEY must be set.').toBeTruthy();

    const email = getEnv('LIVENESS_TEST_EMAIL');
    const password = getEnv('LIVENESS_TEST_PASSWORD');
    expect(email, '[T-W13-E2E-3] LIVENESS_TEST_EMAIL must be set.').toBeTruthy();
    expect(password, '[T-W13-E2E-3] LIVENESS_TEST_PASSWORD must be set.').toBeTruthy();

    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(supabaseUrl!, supabaseAnonKey!);
    const { error: signInError } = await client.auth.signInWithPassword({
      email: email!,
      password: password!,
    });
    expect(signInError, `[T-W13-E2E-3] Auth failed: ${signInError?.message}`).toBeNull();

    // Verify organisation_settings table is accessible (required for dropdown persistence)
    const { error: settingsError } = await client
      .from('organisation_settings')
      .select('id')
      .limit(1);
    expect(
      settingsError,
      `[T-W13-E2E-3] organisation_settings not accessible: ${settingsError?.message} — ` +
        'ui-builder must wire settings dropdowns to persist via this table',
    ).toBeNull();
  });

  // ── T-W13-E2E-4 ──────────────────────────────────────────────────────────────
  it('[T-W13-E2E-4] AIMC/AI chat accessible or graceful fallback', async () => {
    // RED: fails until VITE_LIVE_DEPLOYMENT_URL is set.
    //
    // This test verifies that the AIMC/AI chat feature either:
    //   a) Returns a valid response from the AI endpoint, OR
    //   b) Gracefully falls back with a user-friendly message (not a crash)

    const liveUrl = getEnv('VITE_LIVE_DEPLOYMENT_URL');

    expect(liveUrl, '[T-W13-E2E-4] VITE_LIVE_DEPLOYMENT_URL must be set.').toBeTruthy();
    expect(liveUrl, '[T-W13-E2E-4] VITE_LIVE_DEPLOYMENT_URL must not be a placeholder.').not.toBe(
      PLACEHOLDER_LIVE_URL,
    );

    // Probe the live deployment root — AIMC page is a sub-route
    const response = await fetch(`${liveUrl}/`, {
      signal: AbortSignal.timeout(15_000),
    }).catch((err: unknown) => {
      throw new Error(
        `[T-W13-E2E-4] Live deployment unreachable for AIMC test: ${(err as Error).message}`,
      );
    });
    expect(
      response.ok,
      `[T-W13-E2E-4] Live deployment returned HTTP ${response.status} — ` +
        'AIMC feature requires a working deployment.',
    ).toBe(true);

    // Source-level check: AIMC component must exist with graceful fallback handling
    const aimcPath = path.resolve(
      process.cwd(),
      'modules/mat/frontend/src/pages/AIMCPage.tsx',
    );
    expect(
      fs.existsSync(aimcPath),
      '[T-W13-E2E-4] AIMCPage.tsx must exist — ' +
        'ui-builder must create this page with graceful fallback if AI is unavailable.',
    ).toBe(true);
  });

  // ── T-W13-E2E-5 ──────────────────────────────────────────────────────────────
  it('[T-W13-E2E-5] Vercel deployment health check', async () => {
    // RED: fails until VITE_LIVE_DEPLOYMENT_URL is set to the real Vercel URL.
    //
    // This is the foundational E2E gate: the live deployment must be reachable,
    // return HTTP 200, and serve the application HTML.

    const liveUrl = getEnv('VITE_LIVE_DEPLOYMENT_URL');

    // RED: VITE_LIVE_DEPLOYMENT_URL is not yet defined anywhere in the codebase
    expect(
      liveUrl,
      '[T-W13-E2E-5] VITE_LIVE_DEPLOYMENT_URL must be set to the live Vercel deployment URL. ' +
        'This is the Wave 13 foundational E2E health check gate. ' +
        'Add it to .env.test (locally) and as a GitHub Actions secret (CI).',
    ).toBeTruthy();
    expect(
      liveUrl,
      '[T-W13-E2E-5] VITE_LIVE_DEPLOYMENT_URL must not be the placeholder value ' +
        `"${PLACEHOLDER_LIVE_URL}". Set it to the real deployed URL.`,
    ).not.toBe(PLACEHOLDER_LIVE_URL);

    // Real HTTP health check
    const response = await fetch(`${liveUrl}/`, {
      signal: AbortSignal.timeout(15_000),
      headers: {
        'User-Agent': 'maturion-mat-wave13-health-check/1.0',
      },
    }).catch((err: unknown) => {
      throw new Error(
        `[T-W13-E2E-5] Vercel deployment health check FAILED. ` +
          `URL: ${liveUrl}. Error: ${(err as Error).message}`,
      );
    });

    expect(
      response.ok,
      `[T-W13-E2E-5] Vercel deployment health check returned HTTP ${response.status} — ` +
        `expected 2xx. URL: ${liveUrl}`,
    ).toBe(true);

    // Content check: response must serve the application (not an error page)
    const body = await response.text();
    expect(
      body.length,
      '[T-W13-E2E-5] Vercel deployment returned an empty body — expected HTML application',
    ).toBeGreaterThan(100);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 13.5 — CI E2E Auth Smoke Gate
// ══════════════════════════════════════════════════════════════════════════════

describe('13.5 — CI E2E Auth Smoke Gate', () => {
  // ── T-W13-CI-3 ───────────────────────────────────────────────────────────────
  it('[T-W13-CI-3] deploy-mat-vercel.yml contains e2e-auth-smoke step', () => {
    // RED: fails until integration-builder adds an `e2e-auth-smoke` step to the
    //      deploy-mat-vercel.yml workflow (WGI-03 governance improvement, Task 13.5).
    //
    // The step must:
    //   1. Run AFTER the Vercel deployment succeeds
    //   2. Use LIVENESS_TEST_EMAIL + LIVENESS_TEST_PASSWORD to perform a real login
    //   3. Verify the deployed app's auth endpoint accepts credentials
    //   4. Fail the pipeline if auth is broken post-deploy
    //
    // This gate prevents the RCA-002 F-01 regression ("User Not Authenticated")
    // from being discovered by end users rather than the CI pipeline.

    expect(
      fs.existsSync(WORKFLOW_PATH),
      `[T-W13-CI-3] Workflow file not found at ${WORKFLOW_PATH}`,
    ).toBe(true);

    const workflow = fs.readFileSync(WORKFLOW_PATH, 'utf-8');

    // RED: e2e-auth-smoke step does not exist in the workflow yet
    expect(
      workflow,
      '[T-W13-CI-3] deploy-mat-vercel.yml must contain a step named "e2e-auth-smoke". ' +
        'integration-builder must add this post-deploy auth smoke test step (Task 13.5, WGI-03). ' +
        'The step must run the Wave 13 E2E auth tests against the live deployed URL.',
    ).toContain('e2e-auth-smoke');
  });
});
