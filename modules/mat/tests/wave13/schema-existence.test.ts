/**
 * Wave 13 — Schema Existence Tests (T-W13-SCH-1 to T-W13-SCH-4)
 *
 * Test IDs : T-W13-SCH-1, T-W13-SCH-2, T-W13-SCH-3, T-W13-SCH-4
 * Task     : Wave 13 — Red QA Gate for the MAT module
 * Builder  : schema-builder
 * Wave     : 13 — Live Deployment Wiring Regression
 * Branch   : copilot/fix-live-deployment-wiring-regression
 *
 * RED gate : These tests MUST FAIL until schema-builder applies production migration.
 *
 * RCA Reference: MAT-RCA-002
 *   F-02: "Could not find the table 'public.audits' in the schema cache"
 *
 * POLC Note: Committed as FAILING (RED) per Wave 13 QA gate mandate.
 *            Do NOT modify these tests to pass — implement the fix instead.
 */
import { describe, it, expect } from 'vitest';

describe('T-W13-SCH: Schema Existence and Env Var Audit', () => {
  it('T-W13-SCH-1: public.audits table exists in production schema', async () => {
    // RED: fails until migration is applied to production Supabase
    // The test verifies the audits table is accessible via Supabase client.
    // Without the env vars pointing to a real Supabase project with the migration
    // applied, this will fail with "VITE_SUPABASE_URL must be set".
    const { createClient } = await import('@supabase/supabase-js');
    // @ts-expect-error — import.meta.env is Vite-specific; vitest exposes it
    const supabaseUrl: string | undefined = (import.meta as Record<string, unknown> & { env: Record<string, string> }).env?.VITE_SUPABASE_URL;
    // @ts-expect-error — import.meta.env is Vite-specific; vitest exposes it
    const supabaseAnonKey: string | undefined = (import.meta as Record<string, unknown> & { env: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY;

    // RED: env vars not configured in test environment
    expect(supabaseUrl, 'VITE_SUPABASE_URL must be set').toBeTruthy();
    expect(supabaseAnonKey, 'VITE_SUPABASE_ANON_KEY must be set').toBeTruthy();

    const client = createClient(supabaseUrl!, supabaseAnonKey!);
    const { error } = await client.from('audits').select('id').limit(1);

    // RED: Error will be "Could not find the table 'public.audits' in the schema cache"
    expect(error, `Schema error: ${error?.message}`).toBeNull();
  });

  it('T-W13-SCH-2: public.criteria table exists in production schema', async () => {
    // RED: fails until schema-builder applies production migration
    const { createClient } = await import('@supabase/supabase-js');
    // @ts-expect-error — import.meta.env
    const supabaseUrl: string | undefined = (import.meta as Record<string, unknown> & { env: Record<string, string> }).env?.VITE_SUPABASE_URL;
    // @ts-expect-error — import.meta.env
    const supabaseAnonKey: string | undefined = (import.meta as Record<string, unknown> & { env: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY;

    expect(supabaseUrl, 'VITE_SUPABASE_URL must be set').toBeTruthy();
    expect(supabaseAnonKey, 'VITE_SUPABASE_ANON_KEY must be set').toBeTruthy();

    const client = createClient(supabaseUrl!, supabaseAnonKey!);
    const { error } = await client.from('criteria').select('id').limit(1);

    expect(error, `Schema error: ${error?.message}`).toBeNull();
  });

  it('T-W13-SCH-3: public.domains table exists in production schema', async () => {
    // RED: fails until schema-builder applies production migration
    const { createClient } = await import('@supabase/supabase-js');
    // @ts-expect-error — import.meta.env
    const supabaseUrl: string | undefined = (import.meta as Record<string, unknown> & { env: Record<string, string> }).env?.VITE_SUPABASE_URL;
    // @ts-expect-error — import.meta.env
    const supabaseAnonKey: string | undefined = (import.meta as Record<string, unknown> & { env: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY;

    expect(supabaseUrl, 'VITE_SUPABASE_URL must be set').toBeTruthy();
    expect(supabaseAnonKey, 'VITE_SUPABASE_ANON_KEY must be set').toBeTruthy();

    const client = createClient(supabaseUrl!, supabaseAnonKey!);
    const { error } = await client.from('domains').select('id').limit(1);

    expect(error, `Schema error: ${error?.message}`).toBeNull();
  });

  it('T-W13-SCH-4: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY env vars are set', () => {
    // RED: fails in environments where env vars are not configured (CI / dev without .env)
    // This is the foundational env var audit — must pass before any Supabase call.
    // @ts-expect-error — import.meta.env
    const supabaseUrl: string | undefined = (import.meta as Record<string, unknown> & { env: Record<string, string> }).env?.VITE_SUPABASE_URL;
    // @ts-expect-error — import.meta.env
    const supabaseAnonKey: string | undefined = (import.meta as Record<string, unknown> & { env: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY;

    expect(supabaseUrl, 'VITE_SUPABASE_URL must be set and non-empty').toBeTruthy();
    expect(supabaseAnonKey, 'VITE_SUPABASE_ANON_KEY must be set and non-empty').toBeTruthy();
    expect(supabaseUrl).not.toBe('https://placeholder.supabase.co');
    expect(supabaseAnonKey).not.toBe('placeholder-key');
  });
});
