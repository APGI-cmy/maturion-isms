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

    expect(
      error,
      `Auth API error: ${error?.message} — Supabase auth endpoint must be reachable`
    ).toBeNull();
  });

  it('T-W13-E2E-4: Full audit creation flow — create audit, verify persists, cleanup', async () => {
    const testToken = process.env.MAT_E2E_TEST_TOKEN;
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    expect(
      testToken,
      'MAT_E2E_TEST_TOKEN must be set — integration-builder must add it to CI secrets and local .env.test'
    ).toBeTruthy();

    expect(supabaseUrl, 'VITE_SUPABASE_URL must be set').toBeTruthy();
    expect(supabaseAnonKey, 'VITE_SUPABASE_ANON_KEY must be set').toBeTruthy();

    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(supabaseUrl!, supabaseAnonKey!);

    const { error: authError } = await client.auth.setSession({
      access_token: testToken!,
      refresh_token: process.env.MAT_E2E_REFRESH_TOKEN ?? '',
    });
    expect(authError, `Auth failed: ${authError?.message}`).toBeNull();

    const { data, error } = await client
      .from('audits')
      .insert({ title: 'E2E Test Audit — Wave 13 RED gate', status: 'draft' })
      .select()
      .single();

    expect(error, `Create audit failed: ${error?.message}`).toBeNull();
    expect(data?.id, 'Created audit must have an id').toBeTruthy();

    if (data?.id) {
      await client.from('audits').delete().eq('id', data.id);
    }
  });

  it('T-W13-E2E-5: All major tables are accessible after token auth', async () => {
    const testToken = process.env.MAT_E2E_TEST_TOKEN;
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    expect(
      testToken,
      'MAT_E2E_TEST_TOKEN must be set — integration-builder must configure it'
    ).toBeTruthy();

    expect(supabaseUrl, 'VITE_SUPABASE_URL must be set').toBeTruthy();
    expect(supabaseAnonKey, 'VITE_SUPABASE_ANON_KEY must be set').toBeTruthy();

    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(supabaseUrl!, supabaseAnonKey!);

    await client.auth.setSession({
      access_token: testToken!,
      refresh_token: process.env.MAT_E2E_REFRESH_TOKEN ?? '',
    });

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
