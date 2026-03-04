/**
 * Wave postbuild-fails-03 — current_setting RLS Fix Guard + Storage Path Guard
 *
 * Test IDs : T-PBF3-001 to T-PBF3-007
 * Wave     : postbuild-fails-03 — MAT App: current_setting RLS Fix + Storage Path Prefix
 * Issue    : TASK-PBF3-004
 *
 * RED STATE (expected before schema-builder migration and ui-builder hook fixes land):
 *   T-PBF3-001 to T-PBF3-005: All tests fail because the target migration file
 *   `apps/maturion-maturity-legacy/supabase/migrations/20260305000000_fix_rls_current_setting_policies.sql`
 *   does not yet exist. schema-builder (TASK-PBF3-005) will create the migration and turn
 *   these tests GREEN.
 *
 *   T-PBF3-006: Fails because useEvidence.ts still uses bare path `evidence/${criterionId}`
 *   without an org prefix. ui-builder (TASK-PBF3-006) must fix this.
 *
 *   T-PBF3-007: Fails because useCriteria.ts still uses bare path `criteria/${auditId}`
 *   without an org prefix. ui-builder (TASK-PBF3-006) must fix this.
 *
 * POLC NOTE: All tests are file-based. No live Supabase environment required.
 *   Tests MUST PASS in CI without env vars.
 *
 * Test summary:
 *   T-PBF3-001: audits_org_isolation dropped/replaced — no current_setting in audits policy
 *   T-PBF3-002: audits_select_org_isolation SELECT policy with auth.uid() added
 *   T-PBF3-003: domains_select_org_isolation SELECT policy with auth.uid() added
 *   T-PBF3-004: criteria_select_org_isolation SELECT policy with auth.uid() added
 *   T-PBF3-005: organisations_select_own SELECT policy with auth.uid() added
 *   T-PBF3-006: useEvidence.ts uses org-prefixed upload path (storage path guard)
 *   T-PBF3-007: useCriteria.ts uses org-prefixed upload path (storage path guard)
 *
 * References:
 *   iaa-prebrief-wave-postbuild-fails-03.md
 *   supabase-sync-audit-20260304.md (RLS gap register)
 *   Prior waves: wave-postbuild-fails-01.test.ts, wave-postbuild-fails-02.test.ts
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');
const HOOKS_DIR = path.resolve(process.cwd(), 'modules/mat/frontend/src/lib/hooks');

/**
 * Target migration file for Wave postbuild-fails-03.
 * Created by schema-builder AFTER these RED gate tests are submitted.
 * All migration tests assert file existence first — absent file = RED state (expected at PR time).
 */
const TARGET_MIGRATION_FILE = '20260305000000_fix_rls_current_setting_policies.sql';
const TARGET_MIGRATION_PATH = path.join(MIGRATION_DIR, TARGET_MIGRATION_FILE);

/**
 * Read the target wave migration SQL.
 * Fails immediately (RED) if the migration file does not yet exist.
 */
function readWaveMigrationSql(): string {
  const fileExists = fs.existsSync(TARGET_MIGRATION_PATH);
  expect(
    fileExists,
    `[RED STATE — EXPECTED before schema-builder migration lands]\n` +
    `Migration file not found: ${TARGET_MIGRATION_PATH}\n` +
    `schema-builder must create this file (TASK-PBF3-005) to turn these tests GREEN.`
  ).toBe(true);
  return fs.readFileSync(TARGET_MIGRATION_PATH, 'utf-8');
}

describe('Wave postbuild-fails-03 — current_setting RLS Fix Guard + Storage Path Guard', () => {

  it('T-PBF3-001: audits_org_isolation policy dropped/replaced — no current_setting in audits policy', () => {
    // The existing audits_org_isolation policy uses current_setting('app.current_org_id') which
    // is unreliable in serverless contexts. The migration must drop this policy and/or replace it
    // with a new SELECT policy that uses auth.uid() instead of current_setting.
    //
    // Assert: migration contains DROP POLICY targeting audits_org_isolation OR
    //   adds a new SELECT policy for audits.
    // Assert: migration SQL does NOT contain current_setting in any audits CREATE POLICY block.
    //
    // RED state: migration file does not yet exist → readWaveMigrationSql() fails.
    // GREEN state: migration drops old policy and adds auth.uid()-based replacement.
    const sql = readWaveMigrationSql();

    // Positive assertion: migration must address the audits_org_isolation policy
    const dropsAuditsOrgIsolation =
      /DROP\s+POLICY\s+(?:IF\s+EXISTS\s+)?["']?audits_org_isolation["']?\s+ON\s+(?:public\.)?audits/i.test(sql);
    const addsNewAuditsSelectPolicy =
      /CREATE\s+POLICY\s+["']?\w*audits?\w*["']?\s+ON\s+(?:public\.)?audits\s+AS\s+PERMISSIVE\s+FOR\s+SELECT/i.test(sql);

    expect(
      dropsAuditsOrgIsolation || addsNewAuditsSelectPolicy,
      'Migration must DROP audits_org_isolation policy ON audits OR add a new PERMISSIVE FOR SELECT ' +
      'policy on the audits table to replace the current_setting-based policy. Neither was found.'
    ).toBe(true);

    // Negative assertion (security guard): no CREATE POLICY for audits must use current_setting
    const currentSettingInAuditsPolicy =
      /CREATE\s+POLICY\s+["']?\w*["']?\s+ON\s+(?:public\.)?audits[^;]*current_setting/i.test(sql);
    expect(
      currentSettingInAuditsPolicy,
      'Migration MUST NOT introduce current_setting in any CREATE POLICY...ON audits block. ' +
      'current_setting is unreliable in serverless/edge contexts and must be replaced with auth.uid(). ' +
      'The old audits_org_isolation policy that uses current_setting must be dropped.'
    ).toBe(false);
  });

  it('T-PBF3-002: audits_select_org_isolation SELECT policy with auth.uid() exists in migration', () => {
    // The migration must add a new SELECT policy named audits_select_org_isolation on the audits
    // table using auth.uid() for org isolation (e.g. via profiles or organisations JOIN),
    // replacing the deprecated current_setting-based audits_org_isolation policy.
    // Reference: TASK-PBF3-004, iaa-prebrief-wave-postbuild-fails-03.md
    //
    // RED state: migration file does not yet exist.
    // GREEN state: migration defines audits_select_org_isolation with auth.uid().
    const sql = readWaveMigrationSql();

    expect(
      sql,
      'Migration must define the audits_select_org_isolation policy (CREATE POLICY audits_select_org_isolation)'
    ).toMatch(/audits_select_org_isolation/i);

    expect(
      sql,
      'audits_select_org_isolation policy must use auth.uid() for user identity — ' +
      'not current_setting which is deprecated for serverless contexts'
    ).toMatch(/auth\.uid\(\)/i);
  });

  it('T-PBF3-003: domains_select_org_isolation SELECT policy with auth.uid() added, old policy replaced', () => {
    // The existing domains_org_isolation policy uses current_setting. The migration must either
    // drop that policy and/or replace it with a new SELECT policy using auth.uid().
    // Reference: TASK-PBF3-004, iaa-prebrief-wave-postbuild-fails-03.md
    //
    // RED state: migration file does not yet exist.
    // GREEN state: migration defines domains_select_org_isolation with auth.uid().
    const sql = readWaveMigrationSql();

    expect(
      sql,
      'Migration must define the domains_select_org_isolation policy'
    ).toMatch(/domains_select_org_isolation/i);

    expect(
      sql,
      'domains_select_org_isolation policy must use auth.uid() for user identity'
    ).toMatch(/auth\.uid\(\)/i);

    // Old policy must be dropped OR the new policy is present (replaces it)
    const dropsOldDomains =
      /DROP\s+POLICY\s+(?:IF\s+EXISTS\s+)?["']?domains_org_isolation["']?/i.test(sql);
    const addsNewDomainsPolicy =
      /domains_select_org_isolation/i.test(sql);
    expect(
      dropsOldDomains || addsNewDomainsPolicy,
      'Migration must DROP domains_org_isolation OR add domains_select_org_isolation to replace it. ' +
      'The current_setting-based domains_org_isolation policy must be superseded.'
    ).toBe(true);
  });

  it('T-PBF3-004: criteria_select_org_isolation SELECT policy with auth.uid() added, old policy replaced', () => {
    // The existing criteria_org_isolation policy uses current_setting. The migration must either
    // drop that policy and/or replace it with a new SELECT policy using auth.uid().
    // Reference: TASK-PBF3-004, iaa-prebrief-wave-postbuild-fails-03.md
    //
    // RED state: migration file does not yet exist.
    // GREEN state: migration defines criteria_select_org_isolation with auth.uid().
    const sql = readWaveMigrationSql();

    expect(
      sql,
      'Migration must define the criteria_select_org_isolation policy'
    ).toMatch(/criteria_select_org_isolation/i);

    expect(
      sql,
      'criteria_select_org_isolation policy must use auth.uid() for user identity'
    ).toMatch(/auth\.uid\(\)/i);

    // Old policy must be dropped OR the new policy is present (replaces it)
    const dropsOldCriteria =
      /DROP\s+POLICY\s+(?:IF\s+EXISTS\s+)?["']?criteria_org_isolation["']?/i.test(sql);
    const addsNewCriteriaPolicy =
      /criteria_select_org_isolation/i.test(sql);
    expect(
      dropsOldCriteria || addsNewCriteriaPolicy,
      'Migration must DROP criteria_org_isolation OR add criteria_select_org_isolation to replace it. ' +
      'The current_setting-based criteria_org_isolation policy must be superseded.'
    ).toBe(true);
  });

  it('T-PBF3-005: organisations_select_own SELECT policy on organisations table exists in migration', () => {
    // The migration must add a SELECT policy named organisations_select_own on the organisations
    // table using FOR SELECT and auth.uid() so that users can only read their own organisation.
    // Reference: TASK-PBF3-004, iaa-prebrief-wave-postbuild-fails-03.md
    //
    // RED state: migration file does not yet exist.
    // GREEN state: migration defines organisations_select_own FOR SELECT with auth.uid().
    const sql = readWaveMigrationSql();

    expect(
      sql,
      'Migration must define the organisations_select_own policy ' +
      '(CREATE POLICY organisations_select_own)'
    ).toMatch(/organisations_select_own/i);

    expect(
      sql,
      'organisations_select_own policy must use FOR SELECT to restrict to read operations only'
    ).toMatch(/FOR\s+SELECT/i);

    expect(
      sql,
      'organisations_select_own policy must use auth.uid() so each user sees only their own organisation'
    ).toMatch(/auth\.uid\(\)/i);
  });

  it('T-PBF3-006: useEvidence.ts uses org-prefixed upload path (storage path guard)', () => {
    // useEvidence.ts currently constructs storage upload paths as:
    //   `evidence/${criterionId}/${storageFolder}/...`
    // This bare path lacks the organisationId prefix, enabling cross-tenant storage path collisions
    // where two users from different orgs could share or overwrite each other's storage objects.
    //
    // The fix must prepend the organisationId:
    //   `${organisationId}/evidence/${criterionId}/...`  (or similar org-scoped prefix)
    //
    // RED state: useEvidence.ts still uses the old bare path (missing org prefix).
    // GREEN state: useEvidence.ts uses organisationId in the upload path.
    //
    // Reference: TASK-PBF3-004, iaa-prebrief-wave-postbuild-fails-03.md storage path spec
    const hookPath = path.join(HOOKS_DIR, 'useEvidence.ts');
    const hookExists = fs.existsSync(hookPath);
    expect(
      hookExists,
      `useEvidence.ts hook file must exist at: ${hookPath}`
    ).toBe(true);
    const source = fs.readFileSync(hookPath, 'utf-8');

    // Negative assertion (RED guard): old bare path WITHOUT org prefix must NOT be present
    const hasBareEvidencePath = source.includes('`evidence/${criterionId}');
    expect(
      hasBareEvidencePath,
      'useEvidence.ts MUST NOT use the bare upload path `evidence/${criterionId} — ' +
      'this path is missing the organisationId prefix and enables cross-org storage path collisions. ' +
      'ui-builder must prepend organisationId, e.g. `${organisationId}/evidence/${criterionId}/...`'
    ).toBe(false);

    // Positive assertion (RED guard): new org-prefixed path must include organisationId
    const hasOrgPrefixedPath = source.includes('organisationId');
    expect(
      hasOrgPrefixedPath,
      'useEvidence.ts MUST reference organisationId in the upload path context to produce an ' +
      'org-scoped storage key. Expected pattern: `${organisationId}/evidence/${criterionId}/...`'
    ).toBe(true);
  });

  it('T-PBF3-007: useCriteria.ts uses org-prefixed upload path (storage path guard)', () => {
    // useCriteria.ts currently constructs storage upload paths as:
    //   `criteria/${auditId}/...`
    // This bare path lacks the organisationId prefix, enabling cross-tenant storage path collisions
    // where two users from different orgs could share or overwrite each other's storage objects.
    //
    // The fix must prepend the organisationId:
    //   `${organisationId}/criteria/${auditId}/...`  (or similar org-scoped prefix)
    //
    // RED state: useCriteria.ts still uses the old bare path (missing org prefix).
    // GREEN state: useCriteria.ts uses organisationId in the upload path.
    //
    // Reference: TASK-PBF3-004, iaa-prebrief-wave-postbuild-fails-03.md storage path spec
    const hookPath = path.join(HOOKS_DIR, 'useCriteria.ts');
    const hookExists = fs.existsSync(hookPath);
    expect(
      hookExists,
      `useCriteria.ts hook file must exist at: ${hookPath}`
    ).toBe(true);
    const source = fs.readFileSync(hookPath, 'utf-8');

    // Negative assertion (RED guard): old bare path WITHOUT org prefix must NOT be present
    const hasBarecriteriaPath = source.includes('`criteria/${auditId}');
    expect(
      hasBarecriteriaPath,
      'useCriteria.ts MUST NOT use the bare upload path `criteria/${auditId} — ' +
      'this path is missing the organisationId prefix and enables cross-org storage path collisions. ' +
      'ui-builder must prepend organisationId, e.g. `${organisationId}/criteria/${auditId}/...`'
    ).toBe(false);

    // Positive assertion (RED guard): new org-prefixed path must include organisationId
    const hasOrgPrefixedPath = source.includes('organisationId');
    expect(
      hasOrgPrefixedPath,
      'useCriteria.ts MUST reference organisationId in the upload path context to produce an ' +
      'org-scoped storage key. Expected pattern: `${organisationId}/criteria/${auditId}/...`'
    ).toBe(true);
  });

});
