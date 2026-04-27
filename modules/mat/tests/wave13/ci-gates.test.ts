/**
 * Wave 13 — CI Gate Tests (T-W13-CI-1 to T-W13-CI-3)
 *
 * Test IDs : T-W13-CI-1, T-W13-CI-2, T-W13-CI-3
 * Task     : Wave 13 — Red QA Gate — reconciled to MMM deployment model (issue #1476)
 * Builder  : integration-builder (CI workflow)
 * Wave     : 13 — Live Deployment Wiring Regression
 * Branch   : copilot/fix-live-deployment-wiring-regression
 *
 * RECONCILIATION NOTE (issue #1476 — MMM deployment validation):
 *   These tests were originally written against deploy-mat-vercel.yml (MAT era).
 *   The MAT deployment has been superseded by the MMM deployment model which splits
 *   concerns across multiple workflows per §7.4 Deployment Execution Contract:
 *     - Schema verification gate   → deploy-mmm-supabase-migrations.yml
 *     - Env-var audit gate         → deploy-mmm-vercel.yml
 *     - Post-deploy auth smoke     → deploy-mmm-vercel.yml
 *
 * RCA Reference: MAT-RCA-002
 *   Structural governance improvements WGI-01 through WGI-04:
 *   - WGI-01: Schema-verification gate before/after DB mutation
 *   - WGI-02: Env var audit step before deploy
 *   - WGI-03: Post-deploy auth smoke test
 *   - WGI-04: Block deploy if any gate fails
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// MMM deployment workflow paths (replaces legacy deploy-mat-vercel.yml)
const MMM_MIGRATION_WORKFLOW = path.resolve(
  process.cwd(),
  '.github/workflows/deploy-mmm-supabase-migrations.yml',
);
const MMM_FRONTEND_WORKFLOW = path.resolve(
  process.cwd(),
  '.github/workflows/deploy-mmm-vercel.yml',
);

describe('T-W13-CI: CI Deploy Pipeline Gates', () => {
  it('T-W13-CI-1: CI migration workflow has schema-verification step (WGI-01)', () => {
    // GREEN: deploy-mmm-supabase-migrations.yml contains a schema-verification job that:
    //   1. Connects to Supabase using Management API secrets
    //   2. Probes public.audits and other required tables
    //   3. Fails the pipeline if any table is missing from the schema
    //
    // Schema verification belongs in the migration workflow per the MMM §7.4
    // Deployment Execution Contract (deploy-mmm-supabase-migrations.yml owns all
    // live DB mutation and schema verification).
    expect(
      fs.existsSync(MMM_MIGRATION_WORKFLOW),
      `MMM migration workflow not found at ${MMM_MIGRATION_WORKFLOW}`,
    ).toBe(true);

    const workflow = fs.readFileSync(MMM_MIGRATION_WORKFLOW, 'utf-8');

    expect(
      workflow,
      'deploy-mmm-supabase-migrations.yml must contain a schema-verification job (WGI-01). ' +
        'The job probes required tables after migration and fails if any are absent.',
    ).toContain('schema-verification');

    // The schema-verification step must explicitly reference public.audits
    expect(
      workflow,
      'schema-verification must reference public.audits to confirm it is present',
    ).toContain('public.audits');
  });

  it('T-W13-CI-2: CI frontend workflow has env-var-audit step (WGI-02)', () => {
    // GREEN: deploy-mmm-vercel.yml contains an env-var-audit step that:
    //   1. Verifies VITE_SUPABASE_URL is set and not a placeholder
    //   2. Verifies VITE_SUPABASE_ANON_KEY is set and not a placeholder
    //   3. Fails the pipeline if any required var is missing or placeholder
    //
    // Env-var validation belongs in the frontend workflow per §7.4.
    expect(
      fs.existsSync(MMM_FRONTEND_WORKFLOW),
      `MMM frontend workflow not found at ${MMM_FRONTEND_WORKFLOW}`,
    ).toBe(true);

    const workflow = fs.readFileSync(MMM_FRONTEND_WORKFLOW, 'utf-8');

    expect(
      workflow,
      'deploy-mmm-vercel.yml must contain an env-var-audit step (WGI-02). ' +
        'Add a step named "env-var-audit" that validates all required env vars.',
    ).toContain('env-var-audit');

    expect(
      workflow,
      'env-var-audit step must reference VITE_SUPABASE_URL',
    ).toContain('VITE_SUPABASE_URL');

    expect(
      workflow,
      'env-var-audit step must reference VITE_SUPABASE_ANON_KEY',
    ).toContain('VITE_SUPABASE_ANON_KEY');
  });

  it('T-W13-CI-3: CI frontend workflow has post-deploy auth smoke test step (WGI-03)', () => {
    // GREEN: deploy-mmm-vercel.yml contains a post-deploy-smoke-test job that:
    //   1. Runs AFTER the Vercel deployment succeeds
    //   2. Verifies the deployed app's auth endpoint is reachable (auth-smoke)
    //   3. Fails the pipeline if auth is broken after deploy
    //
    // Post-deploy smoke test belongs in the frontend workflow per §7.4.
    expect(
      fs.existsSync(MMM_FRONTEND_WORKFLOW),
      `MMM frontend workflow not found at ${MMM_FRONTEND_WORKFLOW}`,
    ).toBe(true);
    const workflow = fs.readFileSync(MMM_FRONTEND_WORKFLOW, 'utf-8');

    expect(
      workflow,
      'deploy-mmm-vercel.yml must contain a post-deploy-smoke-test job (WGI-03). ' +
        'The job runs after deploy and verifies auth endpoint reachability.',
    ).toContain('post-deploy-smoke-test');

    expect(
      workflow,
      'post-deploy-smoke-test must contain an auth-smoke step to confirm auth is working',
    ).toContain('auth-smoke');
  });
});
