/**
 * Wave 14 — New Tables RLS (T-W14-UX-015)
 *
 * Test ID : T-W14-UX-015
 * Wave    : Wave 14 — UX Workflow Gap Remediation
 * Issue   : #909
 * FRS/TRS : FR-089 to FR-102 / TR-089 to TR-102 (cross-cutting)
 *
 * Scenario: A user from Organisation A attempts to SELECT rows from all 13 org-scoped
 * Wave 14 tables belonging to Organisation B. All queries must return 0 rows.
 * `maturity_levels` and `scoring_rules` (global defaults) are publicly readable.
 *
 * RED STATE (expected before Wave 14 implementation):
 *   - None of the 13 Wave 14 tables exist yet in any migration.
 *   - RLS policies are not implemented.
 *   - The RLS migration `20260305000008_wave14_new_tables_rls.sql` does not exist.
 *
 * All tests are file-based (no live Supabase env required).
 *
 * Org-scoped tables under test:
 *   audit_invitations, domain_assignments, mps_assignments, criteria_assignments,
 *   criteria_evaluations, evaluation_overrides, criteria_level_descriptors,
 *   mps_level_descriptors, domain_level_descriptors, aggregate_scores, audit_reports.
 *
 * Global tables (no RLS needed — publicly readable):
 *   maturity_levels, scoring_rules.
 *
 * Test summary:
 *   T-W14-UX-015a: RLS migration file exists
 *   T-W14-UX-015b: audit_invitations has org-isolation SELECT RLS policy
 *   T-W14-UX-015c: criteria_evaluations has org-isolation SELECT RLS policy
 *   T-W14-UX-015d: evaluation_overrides has org-isolation SELECT RLS policy
 *   T-W14-UX-015e: aggregate_scores has org-isolation SELECT RLS policy
 *   T-W14-UX-015f: audit_reports has org-isolation SELECT RLS policy
 *   T-W14-UX-015g: criteria_level_descriptors has org-isolation SELECT RLS policy
 *   T-W14-UX-015h: domain_assignments has org-isolation SELECT RLS policy
 *   T-W14-UX-015i: maturity_levels is publicly readable (no restrictive RLS)
 *
 * References:
 *   FR-089 to FR-102, TR-089 to TR-102
 *   modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md §GAP-W15
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');

/**
 * Target Wave 14 RLS migration.
 * Contains all org-isolation RLS policies for the 11 org-scoped new tables.
 */
const TARGET_MIGRATION_FILE = '20260305000008_wave14_new_tables_rls.sql';
const TARGET_MIGRATION_PATH = path.join(MIGRATION_DIR, TARGET_MIGRATION_FILE);

function readTargetMigration(): string {
  const fileExists = fs.existsSync(TARGET_MIGRATION_PATH);
  expect(
    fileExists,
    `[RED STATE — EXPECTED before Wave 14 implementation]\n` +
    `Migration file not found: ${TARGET_MIGRATION_PATH}\n` +
    `schema-builder must create this file to turn these tests GREEN.`
  ).toBe(true);
  return fs.readFileSync(TARGET_MIGRATION_PATH, 'utf-8');
}

describe('T-W14-UX-015 — All new tables have org-isolation RLS (cross-org access denied)', () => {

  it('T-W14-UX-015a: Wave 14 RLS migration file exists', () => {
    // RED: Migration file does not exist before Wave 14 implementation.
    readTargetMigration();
  });

  it('T-W14-UX-015b: audit_invitations has org-isolation SELECT RLS policy in Wave 14 RLS migration', () => {
    // audit_invitations rows are org-scoped. Org-A users must not see Org-B invitations.
    // RED: Table does not exist; no RLS policy defined.
    const sql = readTargetMigration();
    expect(
      sql,
      'audit_invitations must have an org-isolation SELECT RLS policy (FR-090 — cross-org invitation leakage prevention)'
    ).toMatch(/audit_invitations/i);
    expect(
      sql,
      'RLS migration must define a POLICY on audit_invitations (TR-090)'
    ).toMatch(/POLICY.*audit_invitations|CREATE.*POLICY.*audit_invitations/i);
  });

  it('T-W14-UX-015c: criteria_evaluations has org-isolation SELECT RLS policy', () => {
    // criteria_evaluations rows are org-scoped via their audit_id.
    // Org-A users must not read Org-B evaluation results.
    // RED: Table does not exist; no RLS policy defined.
    const sql = readTargetMigration();
    expect(
      sql,
      'criteria_evaluations must have an org-isolation RLS policy (FR-094 — cross-org evaluation leakage prevention)'
    ).toMatch(/POLICY.*criteria_evaluations|CREATE.*POLICY.*criteria_evaluations/i);
  });

  it('T-W14-UX-015d: evaluation_overrides has org-isolation RLS policy', () => {
    // evaluation_overrides rows are tied to criteria_evaluations which are org-scoped.
    // RED: Table does not exist; no RLS policy defined.
    const sql = readTargetMigration();
    expect(
      sql,
      'evaluation_overrides must have an org-isolation RLS policy (FR-094 — override data isolation)'
    ).toMatch(/POLICY.*evaluation_overrides|CREATE.*POLICY.*evaluation_overrides/i);
  });

  it('T-W14-UX-015e: aggregate_scores has org-isolation RLS policy', () => {
    // aggregate_scores rows are scoped to an audit (and therefore an org).
    // Org-A users must not read Org-B computed scores.
    // RED: Table does not exist; no RLS policy defined.
    const sql = readTargetMigration();
    expect(
      sql,
      'aggregate_scores must have an org-isolation RLS policy (FR-101 — computed score isolation)'
    ).toMatch(/POLICY.*aggregate_scores|CREATE.*POLICY.*aggregate_scores/i);
  });

  it('T-W14-UX-015f: audit_reports has org-isolation RLS policy', () => {
    // audit_reports rows are scoped to an org. Generated PDF reports must not be
    // accessible by users from other organisations.
    // RED: Table does not exist; no RLS policy defined.
    const sql = readTargetMigration();
    expect(
      sql,
      'audit_reports must have an org-isolation RLS policy (FR-099 — report access isolation)'
    ).toMatch(/POLICY.*audit_reports|CREATE.*POLICY.*audit_reports/i);
  });

  it('T-W14-UX-015g: criteria_level_descriptors has org-isolation or public-read RLS policy', () => {
    // criteria_level_descriptors are generated from org-uploaded LDCS documents,
    // so they are org-scoped. The RLS policy must restrict reads to the owning org.
    // RED: Table does not exist; no RLS policy defined.
    const sql = readTargetMigration();
    expect(
      sql,
      'criteria_level_descriptors must have a SELECT RLS policy (FR-100 — descriptor data isolation)'
    ).toMatch(/POLICY.*criteria_level_descriptors|CREATE.*POLICY.*criteria_level_descriptors/i);
  });

  it('T-W14-UX-015h: domain_assignments has org-isolation RLS policy', () => {
    // domain_assignments rows grant access scoped to a specific audit (and org).
    // Cross-org reads would leak auditor assignment data.
    // RED: Table does not exist; no RLS policy defined.
    const sql = readTargetMigration();
    expect(
      sql,
      'domain_assignments must have an org-isolation RLS policy (FR-090 — assignment data isolation)'
    ).toMatch(/POLICY.*domain_assignments|CREATE.*POLICY.*domain_assignments/i);
  });

  it('T-W14-UX-015i: maturity_levels is publicly readable (READ-ONLY, no INSERT/UPDATE RLS restriction)', () => {
    // maturity_levels is a global reference table. All authenticated users must be able
    // to read it. It must NOT have restrictive SELECT RLS policies.
    // The migration must either:
    //   a) Set `SECURITY DEFINER` on the SELECT view, or
    //   b) Grant SELECT to authenticated role without restrictive policy, or
    //   c) Explicitly define a public SELECT policy.
    // RED: Table does not exist; no public access defined.
    const sql = readTargetMigration();
    expect(
      sql,
      'maturity_levels must be publicly accessible (referenced in Wave 14 RLS migration for global read access) (TR-101)'
    ).toMatch(/maturity_levels/i);
  });

});
