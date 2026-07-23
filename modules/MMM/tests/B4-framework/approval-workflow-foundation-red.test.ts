import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(__dirname, '../../../..');

function fileExists(relPath: string): boolean {
  return existsSync(resolve(ROOT, relPath));
}

function readFile(relPath: string): string {
  const absolutePath = resolve(ROOT, relPath);
  if (!existsSync(absolutePath)) throw new Error(`File not found: ${relPath}`);
  return readFileSync(absolutePath, 'utf-8');
}

const STATE_MACHINE_PATH = 'apps/mmm/src/lib/approvalWorkflowStateMachine.ts';
const DOMAIN_ACTION_PATH = 'supabase/functions/mmm-domain-approval-action/index.ts';
const FRAMEWORK_ACTION_PATH = 'supabase/functions/mmm-framework-approval-action/index.ts';

describe('MMM Approval Workflow Foundation QA-to-RED — issue #1961', () => {
  it('T-MMM-AWF-001/002/014: central state machine declares actors, completeness and expected-version conflict handling', () => {
    expect(fileExists(STATE_MACHINE_PATH)).toBe(true);
    const source = readFile(STATE_MACHINE_PATH);
    expect(source).toMatch(/draft/);
    expect(source).toMatch(/submitted_l1/);
    expect(source).toMatch(/returned_l2/);
    expect(source).toMatch(/approved_l2/);
    expect(source).toMatch(/expected(?:State|_state)/);
    expect(source).toMatch(/expected(?:Version|_version)/);
    expect(source).toMatch(/complete|completeness/);
  });

  it('T-MMM-AWF-003/006/007/008: domain action enforces immutable, reasoned and idempotent transitions', () => {
    expect(fileExists(DOMAIN_ACTION_PATH)).toBe(true);
    const source = readFile(DOMAIN_ACTION_PATH);
    expect(source).toMatch(/submit/);
    expect(source).toMatch(/return/);
    expect(source).toMatch(/resubmit/);
    expect(source).toMatch(/approve/);
    expect(source).toMatch(/idempotency|correlation/i);
    expect(source).toMatch(/reason|comment/i);
    expect(source).toMatch(/transition|audit/i);
    expect(source).toMatch(/409|conflict/i);
  });

  it('T-MMM-AWF-004/005/013: domain action enforces no self-approval, assignment and tenant scope server-side', () => {
    expect(fileExists(DOMAIN_ACTION_PATH)).toBe(true);
    const source = readFile(DOMAIN_ACTION_PATH);
    expect(source).toMatch(/self.?approv|submitter.*approver|approver.*submitter/i);
    expect(source).toMatch(/assigned_reviewer|assignedReviewer/);
    expect(source).toMatch(/organisation_id|orgId/);
    expect(source).toMatch(/403/);
  });

  it('T-MMM-AWF-009/010/011: Level 3 function exists and gates on current Level 2 approvals', () => {
    expect(fileExists(FRAMEWORK_ACTION_PATH)).toBe(true);
    const source = readFile(FRAMEWORK_ACTION_PATH);
    expect(source).toMatch(/submitted_l3/);
    expect(source).toMatch(/returned_l3/);
    expect(source).toMatch(/approved_l3/);
    expect(source).toMatch(/approved_l2/);
    expect(source).toMatch(/assigned_approver|assignedApprover|executive/i);
    expect(source).toMatch(/idempotency|correlation/i);
  });

  it('T-MMM-AWF-012/015: signed mutation and reviewer reassignment require explicit audited transitions', () => {
    expect(fileExists(STATE_MACHINE_PATH)).toBe(true);
    const source = readFile(STATE_MACHINE_PATH);
    expect(source).toMatch(/revision_required/);
    expect(source).toMatch(/reassign/i);
    expect(source).toMatch(/audit|transition/i);
  });

  it('T-MMM-AWF-016: UI projects server lock/status truth for Level 1, 2 and 3', () => {
    const domainUi = readFile('apps/mmm/src/components/assessment/DomainAuditBuilder.tsx');
    const frameworkUi = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(domainUi).toMatch(/submitted_l1/);
    expect(domainUi).toMatch(/returned_l2/);
    expect(domainUi).toMatch(/approved_l2/);
    expect(domainUi).toMatch(/locked/);
    expect(frameworkUi).toMatch(/submitted_l3/);
    expect(frameworkUi).toMatch(/returned_l3/);
    expect(frameworkUi).toMatch(/approved_l3/);
  });

  it('T-MMM-AWF-017: migration grants minimum helper execute permission without RLS bypass', () => {
    const migrationPath = 'supabase/migrations/20260723000001_mmm_rls_helper_execute_grants.sql';
    expect(fileExists(migrationPath)).toBe(true);
    const migration = readFile(migrationPath);
    expect(migration).toMatch(/GRANT EXECUTE ON FUNCTION public\.mmm_current_user_org_id/i);
    expect(migration).toMatch(/authenticated/i);
    expect(migration).not.toMatch(/DISABLE ROW LEVEL SECURITY/i);
    expect(migration).not.toMatch(/GRANT .*service_role.*authenticated/i);
  });

  it('T-MMM-AWF-018: descriptor regression authority remains present', () => {
    expect(fileExists('modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx')).toBe(true);
    expect(fileExists('scripts/mmm-live-dashboard-diagnosis/verify-descriptor-closure.mjs')).toBe(true);
    expect(fileExists('.github/workflows/mmm-descriptor-live-closure.yml')).toBe(true);
  });
});
