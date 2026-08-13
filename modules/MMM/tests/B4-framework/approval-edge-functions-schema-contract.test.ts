/**
 * Edge Function Schema-Contract Tests (Code Analysis)
 * File: modules/MMM/tests/B4-framework/approval-edge-functions-schema-contract.test.ts
 * 
 * Purpose:
 * Validate that Edge Function source code matches frozen schema contract
 * by analyzing code structure without requiring database connection.
 * Tests verify:
 * - Correct enum values (draft not drafted, decision_at not decided_at, etc.)
 * - Correct column names and structure
 * - Error handling for lookup failures (mmm-approval-invite-accept)
 * - No silent failures, no bypasses
 *
 * Coverage:
 * - mmm-approval-round-create
 * - mmm-approval-decision-submit
 * - mmm-approval-proposed-changes-submit
 * - mmm-approval-invite-accept (lookup-failure path FIX)
 * - mmm-approval-level1-response-submit
 * - mmm-approval-lock-transition
 *
 * Issue: #2004
 * Governance: STOP_AND_FIX directive requiring direct Edge Function validation
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = import.meta.url ? join(fileURLToPath(import.meta.url), '..') : __dirname;

// Helper: Read Edge Function source code
function readFunctionCode(functionName: string): string {
  const funcPath = join(__dirname, '../../../../supabase/functions', functionName, 'index.ts');
  try {
    return readFileSync(funcPath, 'utf-8');
  } catch (e) {
    throw new Error(`Cannot read function ${functionName}: ${e}`);
  }
}

// Helper: Assert code contains regex pattern
function assertContains(code: string, regex: RegExp, description: string) {
  if (!regex.test(code)) {
    throw new Error(`${description}\n[Failed to find pattern]`);
  }
}

// Helper: Assert code does NOT contain regex pattern
function assertNotContains(code: string, regex: RegExp, description: string) {
  if (regex.test(code)) {
    throw new Error(`${description}\n[Pattern should not exist]`);
  }
}

describe('Edge Functions Schema-Contract Code Analysis', () => {
  describe('1. mmm-approval-round-create schema compliance', () => {
    const code = readFunctionCode('mmm-approval-round-create');

    it('should use status enum value "draft" (not "drafted")', () => {
      assertContains(code, /status\s*:\s*['"]draft['"]/, 'Round must use status: "draft"');
    });

    it('should create approvers in mmm_approval_approvers table', () => {
      assertContains(code, /from\(\s*['"]mmm_approval_approvers['"]\)/, 'Should use mmm_approval_approvers table');
    });

    it('should create invitations in mmm_approval_invitations table', () => {
      assertContains(code, /from\(\s*['"]mmm_approval_invitations['"]\)/, 'Should use mmm_approval_invitations table');
    });

    it('should create audit events in mmm_approval_audit_events table', () => {
      assertContains(code, /from\(\s*['"]mmm_approval_audit_events['"]\)/, 'Should use mmm_approval_audit_events table');
    });
  });

  describe('2. mmm-approval-decision-submit schema compliance', () => {
    const code = readFunctionCode('mmm-approval-decision-submit');

    it('should use decision_at field (not decided_at)', () => {
      assertContains(code, /decision_at\s*:/, 'Must use decision_at field');
      assertNotContains(code, /decided_at\s*:/, 'Must not use decided_at');
    });

    it('should use audit events with actor_role field', () => {
      assertContains(code, /from\(\s*['"]mmm_approval_audit_events['"]\)/, 'Should use audit events table');
      assertContains(code, /actor_role/, 'Audit events must include actor_role');
    });

    it('should update locks table', () => {
      assertContains(code, /from\(\s*['"]mmm_approval_locks['"]\)/, 'Should use mmm_approval_locks table');
    });
  });

  describe('3. mmm-approval-proposed-changes-submit schema compliance', () => {
    const code = readFunctionCode('mmm-approval-proposed-changes-submit');

    it('should create audit events', () => {
      assertContains(code, /from\(\s*['"]mmm_approval_audit_events['"]\)/, 'Should use audit events table');
    });
  });

  describe('4. mmm-approval-invite-accept schema compliance & error handling', () => {
    const code = readFunctionCode('mmm-approval-invite-accept');

    it('should handle roundForAudit lookup failure before audit insert (STOP_AND_FIX)', () => {
      // Must check for lookup error
      assertContains(code, /roundAuditError/, 'Must check for roundForAudit lookup error');
      // Must return 500 if lookup fails
      assertContains(code, /return.*500/, 'Must return 500 error if lookup fails');
    });

    it('should check roundForAudit exists before using organisation_id', () => {
      // Must verify roundForAudit is not null before using
      assertContains(code, /if\s*\(\s*roundAuditError\s*\|\|\s*!roundForAudit\s*\)/, 'Must check if roundForAudit exists');
    });

    it('should fetch from mmm_approval_rounds table', () => {
      assertContains(code, /from\(\s*['"]mmm_approval_rounds['"]\)/, 'Should query mmm_approval_rounds');
    });

    it('should use notification events table with recipient_email', () => {
      assertContains(code, /from\(\s*['"]mmm_approval_notification_events['"]\)/, 'Should use notification events table');
      assertContains(code, /recipient_email/, 'Must include recipient_email in notification');
    });
  });

  describe('5. mmm-approval-level1-response-submit schema compliance', () => {
    const code = readFunctionCode('mmm-approval-level1-response-submit');

    it('should use learning events table', () => {
      assertContains(code, /from\(\s*['"]mmm_ai_learning_events['"]\)/, 'Should use learning events table');
    });

    it('should create audit events', () => {
      assertContains(code, /from\(\s*['"]mmm_approval_audit_events['"]\)/, 'Should use audit events table');
    });
  });

  describe('6. mmm-approval-lock-transition schema compliance', () => {
    const code = readFunctionCode('mmm-approval-lock-transition');

    it('should use audit events table with actor_role', () => {
      assertContains(code, /from\(\s*['"]mmm_approval_audit_events['"]\)/, 'Should use audit events table');
      assertContains(code, /actor_role/, 'Audit events must include actor_role');
    });
  });

  describe('Enum Conformance', () => {
    it('should use valid actor_role values (level_1, level_2, level_3, system)', () => {
      const code = readFunctionCode('mmm-approval-round-create');
      // Must use one of the valid enum values
      assertContains(code, /actor_role\s*:\s*['"](?:level_[123]|system)['"]/, 'actor_role must be valid enum value');
    });

    it('should not use "drafted" (must be "draft")', () => {
      const code = readFunctionCode('mmm-approval-round-create');
      assertNotContains(code, /status\s*:\s*['"]drafted['"]/, 'Status must be "draft" not "drafted"');
    });
  });

  describe('Error Handling & Safety', () => {
    it('mmm-approval-invite-accept must block audit insert if roundForAudit lookup fails', () => {
      const code = readFunctionCode('mmm-approval-invite-accept');
      // Critical: cannot use optional chaining for NOT NULL field
      assertNotContains(code, /roundForAudit\?\s*\.organisation_id[\s\S]*?mmm_approval_audit_events/, 
        'Cannot use optional chaining for organisation_id (NOT NULL)');
    });

    it('audit events must always include organisation_id from valid source', () => {
      const code = readFunctionCode('mmm-approval-round-create');
      // Must insert organisation_id into audit events
      assertContains(code, /organisation_id\s*,/, 'Audit insert must include organisation_id');
    });
  });
});
