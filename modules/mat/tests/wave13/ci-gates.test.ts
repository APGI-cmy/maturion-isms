/**
 * Wave 13 — CI Gate Tests (T-W13-CI-1 to T-W13-CI-3)
 *
 * Test IDs : T-W13-CI-1, T-W13-CI-2, T-W13-CI-3
 * Task     : Wave 13 — Red QA Gate for the MAT module
 * Builder  : integration-builder (CI workflow)
 * Wave     : 13 — Live Deployment Wiring Regression
 * Branch   : copilot/fix-live-deployment-wiring-regression
 *
 * RED gate : These tests validate CI gates that MUST be added to deploy-mat-vercel.yml.
 *
 * RCA Reference: MAT-RCA-002
 *   Structural governance improvements WGI-01 through WGI-04:
 *   - WGI-01: Add schema-verification step before Vercel deploy
 *   - WGI-02: Add env var audit step before Vercel deploy
 *   - WGI-03: Add post-deploy auth smoke test
 *   - WGI-04: Block deploy if any gate fails
 *
 * POLC Note: Committed as FAILING (RED) per Wave 13 QA gate mandate.
 *            Do NOT modify these tests to pass — implement the fix instead.
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const WORKFLOW_PATH = path.resolve(process.cwd(), '.github/workflows/deploy-mat-vercel.yml');

describe('T-W13-CI: CI Deploy Pipeline Gates', () => {
  it('T-W13-CI-1: CI workflow has schema-verification step', () => {
    // RED: fails until integration-builder adds a schema-verification job/step to the
    // deploy-mat-vercel.yml workflow. The step must:
    //   1. Connect to Supabase using env secrets
    //   2. Probe public.audits (and optionally criteria, domains)
    //   3. Fail the pipeline if any table is missing from the schema cache
    //
    // This gate prevents the "schema cache miss" production regression (MAT-RCA-002 F-02)
    // from going undetected until a user hits it in production.
    expect(
      fs.existsSync(WORKFLOW_PATH),
      `Workflow file not found at ${WORKFLOW_PATH}`
    ).toBe(true);

    const workflow = fs.readFileSync(WORKFLOW_PATH, 'utf-8');

    // RED: workflow currently does not have a schema-verification step
    expect(
      workflow,
      'deploy-mat-vercel.yml must contain a schema-verification step (WGI-01). ' +
      'Add a job or step named "schema-verification" that probes public.audits.'
    ).toContain('schema-verification');

    // RED: the step must explicitly reference the audits table
    expect(
      workflow,
      'schema-verification step must reference public.audits to confirm it is present'
    ).toContain('public.audits');
  });

  it('T-W13-CI-2: CI workflow has env-var-audit step', () => {
    // RED: fails until integration-builder adds an env-var-audit step to the workflow.
    // The step must:
    //   1. Verify VITE_SUPABASE_URL is set and is not the placeholder value
    //   2. Verify VITE_SUPABASE_ANON_KEY is set and is not the placeholder value
    //   3. Verify any other required env vars (e.g., VITE_LIVE_DEPLOYMENT_URL)
    //   4. Fail the pipeline if any required var is missing or placeholder
    //
    // This gate prevents the "placeholder env var" regression (MAT-RCA-002 F-01)
    // where the frontend builds with placeholder values and silently fails.
    const workflow = fs.readFileSync(WORKFLOW_PATH, 'utf-8');

    // RED: workflow currently does not have an env var audit step
    expect(
      workflow,
      'deploy-mat-vercel.yml must contain an env-var-audit step (WGI-02). ' +
      'Add a step named "env-var-audit" that validates all required env vars.'
    ).toContain('env-var-audit');

    // RED: step must reference the two critical env vars
    expect(
      workflow,
      'env-var-audit step must reference VITE_SUPABASE_URL'
    ).toContain('VITE_SUPABASE_URL');

    expect(
      workflow,
      'env-var-audit step must reference VITE_SUPABASE_ANON_KEY'
    ).toContain('VITE_SUPABASE_ANON_KEY');
  });

  it('T-W13-CI-3: CI workflow has post-deploy auth smoke test step', () => {
    // RED: fails until integration-builder adds a post-deploy smoke test to the workflow.
    // The step must:
    //   1. Run AFTER the Vercel deployment succeeds
    //   2. Hit the deployed URL's auth endpoint to verify auth is wired correctly
    //   3. Run the Wave 13 E2E auth smoke test (T-W13-E2E-3)
    //   4. Fail the pipeline if auth is broken after deploy
    //
    // This gate prevents the "auth not working after deploy" regression (MAT-RCA-002 F-01)
    // from being discovered by users rather than the CI pipeline.
    const workflow = fs.readFileSync(WORKFLOW_PATH, 'utf-8');

    // RED: workflow currently does not have a post-deploy auth smoke test
    expect(
      workflow,
      'deploy-mat-vercel.yml must contain a post-deploy-smoke-test step (WGI-03). ' +
      'Add a step named "post-deploy-smoke-test" that runs after deploy.'
    ).toContain('post-deploy-smoke-test');

    // RED: smoke test must include auth verification
    expect(
      workflow,
      'post-deploy-smoke-test must reference auth-smoke to confirm auth is working'
    ).toContain('auth-smoke');
  });
});
