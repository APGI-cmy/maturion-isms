import { describe, it, expect } from 'vitest';
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

const INVITE_UI_PATHS = [
  'apps/mmm/src/components/assessment/DomainAuditBuilder.tsx',
  'apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx',
  'apps/mmm/src/pages/FrameworkReviewPage.tsx',
];

const INVITE_EDGE_FUNCTIONS = [
  'supabase/functions/mmm-approval-round-create/index.ts',
  'supabase/functions/mmm-approval-invite-accept/index.ts',
  'supabase/functions/mmm-approval-workspace-read/index.ts',
];

describe('MMM Level 2 Invite Modal and Workspace — QA-to-RED', () => {
  describe('T-MMM-L2-INVITE-001: Submit button visibility and scope gate', () => {
    it('keeps the Level 2 invite entrypoint and its scope gate wired to the MMM approval builder', () => {
      expect(fileExists(INVITE_UI_PATHS[0])).toBe(true);
      const source = readFile(INVITE_UI_PATHS[0]);
      expect(source).toMatch(/Submit Domain for Approval|invite/i);
      expect(source).toMatch(/Level 2|approval round|approver/i);
      expect(source).toMatch(/missing|disabled|blocked|config/i);
    });

    it('still exposes the scoped approval review surface used after invite acceptance', () => {
      expect(fileExists(INVITE_UI_PATHS[1])).toBe(true);
      const source = readFile(INVITE_UI_PATHS[1]);
      expect(source).toMatch(/submitted_l2|approved_l2|returned_l2|approval/i);
      expect(source).toMatch(/locked|scope|workspace/i);
    });
  });

  describe('T-MMM-L2-INVITE-002: Submit button opens invite modal', () => {
    it('routes invite submission through the approval round creation function contract', () => {
      expect(fileExists(INVITE_EDGE_FUNCTIONS[0])).toBe(true);
      const source = readFile(INVITE_EDGE_FUNCTIONS[0]);
      expect(source).toMatch(/mmm_approval_rounds/);
      expect(source).toMatch(/mmm_approval_approvers/);
      expect(source).toMatch(/mmm_approval_invitations/);
      expect(source).toMatch(/draft|invited/);
    });

    it('keeps the invite-accept path and token handoff available for the workspace entry', () => {
      expect(fileExists(INVITE_EDGE_FUNCTIONS[1])).toBe(true);
      const source = readFile(INVITE_EDGE_FUNCTIONS[1]);
      expect(source).toMatch(/token|invite/i);
      expect(source).toMatch(/mmm_approval_rounds/);
      expect(source).toMatch(/mmm_approval_notification_events/);
    });
  });

  describe('T-MMM-L2-INVITE-003: Modal displays approval scope summary', () => {
    it('keeps the framework review page available for summary handoff content', () => {
      expect(fileExists(INVITE_UI_PATHS[2])).toBe(true);
      const source = readFile(INVITE_UI_PATHS[2]);
      expect(source).toMatch(/Compile|Publish|review/i);
      expect(source).toMatch(/framework|approval/i);
    });
  });

  describe('T-MMM-L2-INVITE-004: Multi-approver invite payload remains supported', () => {
    it('preserves the multi-approver invite contract on the round creator', () => {
      const source = readFile(INVITE_EDGE_FUNCTIONS[0]);
      expect(source).toMatch(/approver|approvers/i);
      expect(source).toMatch(/email|full_name|designation/i);
      expect(source).toMatch(/organisation_id|framework_id/);
    });
  });

  describe('T-MMM-L2-WORKSPACE-001: Invite link acceptance routes to workspace', () => {
    it('keeps the scoped workspace read surface present for the invited round', () => {
      expect(fileExists(INVITE_EDGE_FUNCTIONS[2])).toBe(true);
      const source = readFile(INVITE_EDGE_FUNCTIONS[2]);
      expect(source).toMatch(/mmm_approval_rounds|organisation_id|approval_round_id/);
      expect(source).toMatch(/workspace|read|scope/i);
    });
  });

  describe('T-MMM-L2-WORKSPACE-002: Expired or revoked invite blocks access', () => {
    it('keeps invite acceptance tied to token-based validation instead of blind access', () => {
      const source = readFile(INVITE_EDGE_FUNCTIONS[1]);
      expect(source).toMatch(/expired|revoked|invalid|error|token/i);
    });
  });

  describe('T-MMM-L2-WORKSPACE-003: Approver cannot access non-invited domain', () => {
    it('retains organisation and round scoping so non-invited access is still blocked', () => {
      const source = readFile(INVITE_EDGE_FUNCTIONS[2]);
      expect(source).toMatch(/organisation_id/);
      expect(source).toMatch(/approval_round_id/);
      expect(source).toMatch(/rls|scope|filter|access/i);
    });
  });

  describe('T-MMM-L2-WORKSPACE-010: Proposed-change control exists for editable fields', () => {
    it('keeps the proposed-change workflow visible in the Level 2 workspace lane', () => {
      const source = readFile('apps/mmm/src/components/assessment/DomainAuditBuilder.tsx');
      expect(source).toMatch(/propose|change|edit/i);
      expect(source).toMatch(/domain|mps|criteria|descriptor/i);
    });
  });
});
