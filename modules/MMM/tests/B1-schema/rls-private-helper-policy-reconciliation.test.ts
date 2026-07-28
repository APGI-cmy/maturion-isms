import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(__dirname, '../../../..');
const HARDENING = 'supabase/migrations/20260530000003_mmm_function_search_path_hardening.sql';
const RECONCILIATION = 'supabase/migrations/20260724000001_mmm_rls_private_helper_policy_reconciliation.sql';

function read(path: string): string {
  const absolute = resolve(ROOT, path);
  if (!existsSync(absolute)) throw new Error(`File not found: ${path}`);
  return readFileSync(absolute, 'utf8');
}

describe('MMM #1959 RLS private helper policy parity', () => {
  it('preserves private organisation and role helpers and public RPC revocation', () => {
    const source = read(HARDENING);
    expect(source).toMatch(/CREATE OR REPLACE FUNCTION app_private\.mmm_current_user_org_id/i);
    expect(source).toMatch(/CREATE OR REPLACE FUNCTION app_private\.mmm_current_user_role/i);
    expect(source).toMatch(/GRANT EXECUTE ON FUNCTION app_private\.mmm_current_user_org_id\(\) TO authenticated, service_role/i);
    expect(source).toMatch(/GRANT EXECUTE ON FUNCTION app_private\.mmm_current_user_role\(\) TO authenticated, service_role/i);
    expect(source).toMatch(/REVOKE EXECUTE ON FUNCTION public\.mmm_current_user_org_id\(\) FROM PUBLIC, anon, authenticated/i);
    expect(source).toMatch(/REVOKE EXECUTE ON FUNCTION public\.mmm_current_user_role\(\) FROM PUBLIC, anon, authenticated/i);
  });

  it('provides an idempotent migration that rewrites stale policies to app_private helpers', () => {
    const source = read(RECONCILIATION);
    expect(source).toMatch(/FROM pg_policies/i);
    expect(source).toMatch(/ALTER POLICY/i);
    expect(source).toMatch(/app_private\.mmm_current_user_org_id\(\)/i);
    expect(source).toMatch(/app_private\.mmm_current_user_role\(\)/i);
    expect(source).toMatch(/REVOKE EXECUTE ON FUNCTION public\.mmm_current_user_org_id/i);
    expect(source).toMatch(/REVOKE EXECUTE ON FUNCTION public\.mmm_current_user_role/i);
    expect(source).not.toMatch(/DISABLE ROW LEVEL SECURITY/i);
    expect(source).not.toMatch(/GRANT .*service_role.*authenticated/i);
  });
});
