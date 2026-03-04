/**
 * Wave 14 — Onboarding Guard (T-W14-UX-001)
 *
 * Test ID : T-W14-UX-001
 * Wave    : Wave 14 — UX Workflow Gap Remediation
 * Issue   : #909
 * FRS/TRS : FR-089 / TR-089
 *
 * Scenario: A freshly signed-up user with a valid Supabase Auth session but no
 * `profiles.organisation_id` attempts to navigate to the audit dashboard (`/`).
 * The app must redirect to `/onboarding`. The two-step wizard (full name →
 * create organisation) must be present. On completion, `organisations` gains a
 * row and `profiles.organisation_id` is updated.
 *
 * RED STATE (expected before Wave 14 implementation):
 *   - OnboardingPage is missing required `data-testid` attributes for test automation.
 *   - App.tsx OnboardingGuard does not carry a `data-testid="onboarding-guard"` sentinel.
 *   - No Wave 14 migration adds the `onboarding_completions` tracking table or the
 *     `organisations_insert_onboarding` trigger needed for full wiring.
 *   - The target migration file `20260305000000_wave14_onboarding_support.sql` does
 *     not yet exist.
 *
 * All tests are file-based (no live Supabase env required).
 * Tests MUST PASS in CI without env vars.
 *
 * Test summary:
 *   T-W14-UX-001a: OnboardingGuard sentinel is present in App.tsx
 *   T-W14-UX-001b: OnboardingPage has data-testid="onboarding-step-1" marker
 *   T-W14-UX-001c: OnboardingPage has data-testid="onboarding-step-2" marker
 *   T-W14-UX-001d: Wave 14 onboarding support migration file exists
 *   T-W14-UX-001e: Migration defines onboarding_completions table
 *
 * References:
 *   FR-089 (onboarding guard routing)
 *   TR-089 (two-step onboarding wizard with DB wiring)
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const SRC_DIR = path.resolve(process.cwd(), 'modules/mat/frontend/src');
const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');

/**
 * Target Wave 14 onboarding support migration.
 * Does not exist until schema-builder delivers Wave 14 implementation.
 */
const TARGET_MIGRATION_FILE = '20260305000000_wave14_onboarding_support.sql';
const TARGET_MIGRATION_PATH = path.join(MIGRATION_DIR, TARGET_MIGRATION_FILE);

function readTargetMigration(): string {
  const fileExists = fs.existsSync(TARGET_MIGRATION_PATH);
  expect(
    fileExists,
    `[RED STATE — EXPECTED before Wave 14 lands]\n` +
    `Migration file not found: ${TARGET_MIGRATION_PATH}\n` +
    `schema-builder must create this file to turn these tests GREEN.`
  ).toBe(true);
  return fs.readFileSync(TARGET_MIGRATION_PATH, 'utf-8');
}

describe('T-W14-UX-001 — Onboarding Guard blocks unauthenticated users without org (GAP-W01)', () => {

  it('T-W14-UX-001a: App.tsx has data-testid="onboarding-guard" sentinel for test automation', () => {
    // The OnboardingGuard component must expose a data-testid sentinel so that
    // integration tests can assert the guard rendered. Without this attribute,
    // automated routing tests cannot verify the guard is active.
    //
    // RED: App.tsx exists but does not carry data-testid="onboarding-guard".
    const appTsx = path.join(SRC_DIR, 'App.tsx');
    const source = fs.readFileSync(appTsx, 'utf-8');
    expect(
      source,
      'App.tsx OnboardingGuard wrapper must have data-testid="onboarding-guard" for routing tests (FR-089)'
    ).toMatch(/data-testid=["']onboarding-guard["']/);
  });

  it('T-W14-UX-001b: OnboardingPage has data-testid="onboarding-step-1" for Step 1 (name entry)', () => {
    // Step 1 of the two-step wizard collects the user full name.
    // The form element must carry data-testid="onboarding-step-1" so that
    // routing tests can assert the correct step is rendered.
    //
    // RED: OnboardingPage.tsx exists but does not carry this attribute.
    const onboardingPage = path.join(SRC_DIR, 'pages', 'OnboardingPage.tsx');
    const source = fs.readFileSync(onboardingPage, 'utf-8');
    expect(
      source,
      'OnboardingPage must have data-testid="onboarding-step-1" on the Step 1 form (TR-089)'
    ).toMatch(/data-testid=["']onboarding-step-1["']/);
  });

  it('T-W14-UX-001c: OnboardingPage has data-testid="onboarding-step-2" for Step 2 (org creation)', () => {
    // Step 2 collects the organisation name and triggers the organisations INSERT.
    // Must carry data-testid="onboarding-step-2".
    //
    // RED: OnboardingPage.tsx exists but does not carry this attribute.
    const onboardingPage = path.join(SRC_DIR, 'pages', 'OnboardingPage.tsx');
    const source = fs.readFileSync(onboardingPage, 'utf-8');
    expect(
      source,
      'OnboardingPage must have data-testid="onboarding-step-2" on the Step 2 form (TR-089)'
    ).toMatch(/data-testid=["']onboarding-step-2["']/);
  });

  it('T-W14-UX-001d: Wave 14 onboarding support migration file exists', () => {
    // Confirms the schema-builder has delivered the onboarding DB support migration.
    // RED: File does not exist before Wave 14 implementation.
    readTargetMigration();
  });

  it('T-W14-UX-001e: Migration defines onboarding_completions table for tracking completed onboarding', () => {
    // The onboarding_completions table tracks users who have completed onboarding,
    // enabling idempotent re-run protection and analytics.
    // RED: Migration file does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'Wave 14 migration must CREATE TABLE public.onboarding_completions (FR-089)'
    ).toMatch(/CREATE TABLE.*onboarding_completions/i);
  });

});
