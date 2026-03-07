/**
 * Wave 13 — E2E Live Deployment Tests (T-W13-E2E-1 to T-W13-E2E-5)
 *
 * Test IDs : T-W13-E2E-1, T-W13-E2E-2, T-W13-E2E-3, T-W13-E2E-4, T-W13-E2E-5
 * Task     : Wave 13 — Red QA Gate for the MAT module
 * Builder  : integration-builder
 * Wave     : 13 — Live Deployment Wiring Regression
 * Branch   : copilot/fix-live-deployment-wiring-regression
 *
 * RED gate : These tests MUST FAIL until integration-builder wires full E2E CWT.
 *
 * RCA Reference: MAT-RCA-002
 *   Cross-cutting: no E2E tests verify production stack end-to-end
 *
 * POLC Note: Committed as FAILING (RED) per Wave 13 QA gate mandate.
 *            Do NOT modify these tests to pass — implement the fix instead.
 */
import { describe, it, expect } from 'vitest';

const LIVE_URL =
  process.env.VITE_LIVE_DEPLOYMENT_URL ||
  'https://matfrontend-93ooodm29-rassie-ras-projects.vercel.app';

describe('T-W13-E2E: Full E2E CWT Against Live Deployment', () => {
  it('T-W13-E2E-1: Live deployment health check — app loads and responds', async () => {
    // RED: fails until integration-builder implements /health endpoint in the deployment.
    // Currently there is no /health route — the fetch will return 404 or fail to connect.
    //
    // What integration-builder must do:
    //   1. Add a /health route to the Vercel deployment (or a Vercel function)
    //   2. Return JSON { status: 'healthy' } with HTTP 200
    //   3. Ensure the route is accessible without authentication
    const response = await fetch(`${LIVE_URL}/health`, {
      signal: AbortSignal.timeout(10000),
    }).catch((err: unknown) => {
      throw new Error(`Health check fetch failed: ${(err as Error).message}`);
    });

    expect(response.ok, `Health endpoint returned ${response.status} — add /health route`).toBe(true);
    const data = (await response.json()) as { status?: string };
    expect(data.status, 'Health response must include { status: "healthy" }').toBe('healthy');
  });

  it('T-W13-E2E-2: Schema probe — audits table reachable via API', async () => {
    // RED: fails until schema-builder applies the production migration so that
    // public.audits is present in the Supabase schema cache.
    //
    // Without env vars this fails immediately: "VITE_SUPABASE_URL env var required"
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    expect(
      supabaseUrl,
      'VITE_SUPABASE_URL env var required — set it in CI secrets and local .env'
    ).toBeTruthy();
    expect(
      supabaseAnonKey,
      'VITE_SUPABASE_ANON_KEY env var required — set it in CI secrets and local .env'
    ).toBeTruthy();

    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(supabaseUrl!, supabaseAnonKey!);

    const { error } = await client.from('audits').select('id').limit(1);
    expect(
      error,
      `Schema probe failed: ${error?.message} — apply migration to add public.audits`
    ).toBeNull();
  });

  it('T-W13-E2E-3: Auth flow — Supabase auth API is reachable and returns no error', async () => {
    // RED: fails until api-builder implements auth session wiring AND env vars are set.
    //
    // This is a smoke test verifying the auth endpoint is reachable.
    // Session may be null in an unauthenticated state — but the API call must not error.
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    expect(
      supabaseUrl,
      'VITE_SUPABASE_URL env var required for auth smoke test'
    ).toBeTruthy();
    expect(
      supabaseAnonKey,
      'VITE_SUPABASE_ANON_KEY env var required for auth smoke test'
    ).toBeTruthy();

    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(supabaseUrl!, supabaseAnonKey!);

    const { error } = await client.auth.getSession();

    // Session may be null — but no error from the API itself
    expect(
      error,
      `Auth API error: ${error?.message} — Supabase auth endpoint must be reachable`
    ).toBeNull();
  });

  it('T-W13-E2E-4: Full audit creation flow — create audit, verify persists, cleanup', async () => {
    // RED: fails until ALL of the following are fixed:
    //   1. schema-builder applies production migration (public.audits exists)
    //   2. api-builder wires auth session so RLS allows writes
    //   3. integration-builder configures MAT_E2E_TEST_TOKEN in CI environment
    //
    // Without MAT_E2E_TEST_TOKEN this test fails immediately with a clear error.
    const testToken = process.env.MAT_E2E_TEST_TOKEN;
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    // RED: test token env var not set until integration-builder configures E2E environment
    expect(
      testToken,
      'MAT_E2E_TEST_TOKEN must be set — integration-builder must add it to CI secrets and local .env.test'
    ).toBeTruthy();

    expect(supabaseUrl, 'VITE_SUPABASE_URL must be set').toBeTruthy();
    expect(supabaseAnonKey, 'VITE_SUPABASE_ANON_KEY must be set').toBeTruthy();

    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(supabaseUrl!, supabaseAnonKey!);

    // Auth with test token
    const { error: authError } = await client.auth.setSession({
      access_token: testToken!,
      refresh_token: process.env.MAT_E2E_REFRESH_TOKEN ?? '',
    });
    expect(authError, `Auth failed: ${authError?.message}`).toBeNull();

    // Create a test audit — RED if schema missing or RLS blocks the write
    const { data, error } = await client
      .from('audits')
      .insert({ title: 'E2E Test Audit — Wave 13 RED gate', status: 'draft' })
      .select()
      .single();

    expect(error, `Create audit failed: ${error?.message}`).toBeNull();
    expect(data?.id, 'Created audit must have an id').toBeTruthy();

    // Cleanup — delete the test row so runs are idempotent
    if (data?.id) {
      await client.from('audits').delete().eq('id', data.id);
    }
  });

  it('T-W13-E2E-5: All major tables are accessible after token auth', async () => {
    // RED: fails until schema-builder + api-builder + schema-builder all resolve their tasks.
    //
    // Verifies that audits, domains, and criteria are all accessible — the three tables
    // most likely to be missing from the schema cache (MAT-RCA-002 F-02).
    const testToken = process.env.MAT_E2E_TEST_TOKEN;
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    // RED: test token not configured until integration-builder sets up E2E environment
    expect(
      testToken,
      'MAT_E2E_TEST_TOKEN must be set — integration-builder must configure it'
    ).toBeTruthy();

    expect(supabaseUrl, 'VITE_SUPABASE_URL must be set').toBeTruthy();
    expect(supabaseAnonKey, 'VITE_SUPABASE_ANON_KEY must be set').toBeTruthy();

    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(supabaseUrl!, supabaseAnonKey!);

    await client.auth.setSession({ access_token: testToken!, refresh_token: '' });

    // Verify each major data endpoint returns data (not schema errors)
    const tables = ['audits', 'domains', 'criteria'] as const;
    for (const table of tables) {
      const { error } = await client.from(table).select('id').limit(1);
      expect(
        error,
        `Table '${table}' not accessible: ${error?.message} — apply migration`
      ).toBeNull();
    }
  });
});
