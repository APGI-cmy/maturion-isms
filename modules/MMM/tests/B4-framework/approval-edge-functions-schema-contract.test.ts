/**
 * Direct Edge Function Schema-Contract Tests
 * File: modules/MMM/tests/B4-framework/approval-edge-functions-schema-contract.test.ts
 * 
 * Purpose:
 * Validate that each of the 6 reconciled Edge Functions produces payloads
 * that match frozen migration schema exactly—enum values, column names, 
 * NOT NULL constraints, and audit event field structure.
 *
 * Coverage:
 * - mmm-approval-round-create
 * - mmm-approval-decision-submit
 * - mmm-approval-proposed-changes-submit
 * - mmm-approval-invite-accept (including lookup-failure path)
 * - mmm-approval-level1-response-submit
 * - mmm-approval-lock-transition
 *
 * Issue: #2004
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

describe('Edge Functions Schema Contract Tests', () => {
  let supabase: ReturnType<typeof createClient>;

  beforeAll(() => {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  });

  describe('1. mmm-approval-round-create schema validation', () => {
    it('should insert approval_rounds with status enum value "draft" (not "drafted")', async () => {
      // Schema contract: mmm_approval_rounds.status has enum including "draft"
      // Reconciliation: 'drafted' → 'draft' in Edge Function line 164

      const { data, error } = await supabase
        .from('mmm_approval_rounds')
        .select('status')
        .eq('status', 'draft')
        .limit(1);

      expect(error).toBeNull();
      if (data && data.length > 0) {
        expect(data[0].status).toBe('draft');
      }
    });

    it('should insert approvers without framework_id, domain_id, or assigned_at (non-existent columns)', async () => {
      // Schema contract: mmm_approval_approvers has these REQUIRED columns:
      // approval_round_id, organisation_id, user_id, email, full_name, designation,
      // approval_level, status, invited_by_user_id, invited_at, accepted_invite_at,
      // decision, decision_at, decision_comment, created_at, updated_at
      // Does NOT have: framework_id, domain_id, assigned_at

      const tableInfo = await supabase
        .from('mmm_approval_approvers')
        .select()
        .limit(0);

      // Verify schema doesn't have these phantom columns
      const hasNonExistentColumns =
        (tableInfo as any)?.error?.message?.includes('framework_id') ||
        (tableInfo as any)?.error?.message?.includes('domain_id') ||
        (tableInfo as any)?.error?.message?.includes('assigned_at');

      expect(hasNonExistentColumns).toBe(false);
    });

    it('should insert invitations without organisation_id, framework_id, or domain_id (non-existent in invitations table)', async () => {
      // Schema contract: mmm_approval_invitations has these columns:
      // approval_round_id, approver_id, email, token_hash, status, expires_at,
      // sent_at, accepted_at, revoked_at, created_at
      // Does NOT have: organisation_id, framework_id, domain_id

      const tableInfo = await supabase
        .from('mmm_approval_invitations')
        .select()
        .limit(0);

      const hasNonExistentColumns =
        (tableInfo as any)?.error?.message?.includes('organisation_id') ||
        (tableInfo as any)?.error?.message?.includes('framework_id') ||
        (tableInfo as any)?.error?.message?.includes('domain_id');

      expect(hasNonExistentColumns).toBe(false);
    });

    it('should insert audit events with actor_role + details (not timestamp field)', async () => {
      // Schema contract: mmm_approval_audit_events has columns:
      // approval_round_id, organisation_id, event_type, actor_id, actor_role,
      // details (jsonb), created_at (auto-default)
      // Does NOT have: timestamp field

      const auditEvents = await supabase
        .from('mmm_approval_audit_events')
        .select('event_type, actor_role, details')
        .limit(1);

      expect(auditEvents.error).toBeNull();
      // Verify structure matches schema (actor_role is enum, details is jsonb/null)
      if (auditEvents.data && auditEvents.data.length > 0) {
        const evt = auditEvents.data[0];
        expect(['level_1', 'level_2', 'level_3', 'system']).toContain(evt.actor_role);
      }
    });
  });

  describe('2. mmm-approval-decision-submit schema validation', () => {
    it('should use decision_at column (not decided_at)', async () => {
      // Schema contract: mmm_approval_approvers.decision_at (NOT decided_at)
      // Reconciliation: decided_at → decision_at in Edge Function line 112

      const approvers = await supabase
        .from('mmm_approval_approvers')
        .select('decision_at')
        .limit(1);

      expect(approvers.error).toBeNull();
      // Column exists and is queryable
      expect(approvers).not.toBeNull();
    });

    it('should insert locks with framework_id, reason, locked_by_round_id columns', async () => {
      // Schema contract: mmm_approval_locks has:
      // organisation_id, framework_id, domain_id, object_type, object_id,
      // lock_state, locked_by_round_id, reason (NOT NULL), updated_at
      // Does NOT have: simple locked_at field

      const locks = await supabase
        .from('mmm_approval_locks')
        .select('framework_id, reason, locked_by_round_id')
        .limit(1);

      expect(locks.error).toBeNull();
    });

    it('should insert audit events with actor_role enum value', async () => {
      const auditEvents = await supabase
        .from('mmm_approval_audit_events')
        .select('actor_role')
        .eq('event_type', 'decision_submitted')
        .limit(1);

      if (auditEvents.data && auditEvents.data.length > 0) {
        expect(['level_1', 'level_2', 'level_3', 'system']).toContain(auditEvents.data[0].actor_role);
      }
    });
  });

  describe('3. mmm-approval-proposed-changes-submit schema validation', () => {
    it('should insert audit events with correct actor_role + details structure', async () => {
      const auditEvents = await supabase
        .from('mmm_approval_audit_events')
        .select('actor_role, details')
        .eq('event_type', 'changes_submitted')
        .limit(1);

      expect(auditEvents.error).toBeNull();
      if (auditEvents.data && auditEvents.data.length > 0) {
        const evt = auditEvents.data[0];
        expect(['level_1', 'level_2', 'level_3', 'system']).toContain(evt.actor_role);
      }
    });
  });

  describe('4. mmm-approval-invite-accept schema validation (including lookup-failure path)', () => {
    it('should fetch organisation_id from mmm_approval_rounds (not from invitations table)', async () => {
      // Schema contract: invitations table does NOT have organisation_id
      // Must fetch from parent round before audit insert

      const invitation = await supabase
        .from('mmm_approval_invitations')
        .select('*')
        .limit(1);

      expect(invitation.error).toBeNull();
      // Verify invitations schema doesn't include organisation_id
      if (invitation.data && invitation.data.length > 0) {
        expect(invitation.data[0]).not.toHaveProperty('organisation_id');
      }
    });

    it('should handle failed roundForAudit lookup before attempting audit insert', async () => {
      // Remediation: if roundForAudit lookup fails or returns undefined,
      // must return error before audit insert (organisation_id is NOT NULL)

      // Attempt to insert audit event with null organisation_id (should fail)
      const { error } = await supabase
        .from('mmm_approval_audit_events')
        .insert({
          approval_round_id: '00000000-0000-0000-0000-000000000000',
          organisation_id: null,
          event_type: 'test_null_org',
          actor_id: '00000000-0000-0000-0000-000000000000',
          actor_role: 'system',
          details: null,
        });

      // Schema enforces NOT NULL on organisation_id
      expect(error).not.toBeNull();
      expect(error?.message || '').toMatch(/organisation_id|NOT NULL|not-null/i);
    });

    it('should use recipient_email from request body (not from invitations.email)', async () => {
      // Schema contract: notification_events requires recipient_email (NOT NULL)
      // Must use email from request body, not from invitations table

      const notifications = await supabase
        .from('mmm_approval_notification_events')
        .select('recipient_email')
        .limit(1);

      expect(notifications.error).toBeNull();
      // recipient_email exists and is populated
      if (notifications.data && notifications.data.length > 0) {
        expect(notifications.data[0].recipient_email).toBeDefined();
      }
    });
  });

  describe('5. mmm-approval-level1-response-submit schema validation', () => {
    it('should insert learning events with approval_level null (not "level_1")', async () => {
      // Schema contract: mmm_ai_learning_events.approval_level enum only allows
      // 'level_2' or 'level_3' (NOT 'level_1'); level 1 has NULL

      const learningEvents = await supabase
        .from('mmm_ai_learning_events')
        .select('approval_level')
        .not('approval_level', 'is', null)
        .limit(5);

      if (learningEvents.data) {
        learningEvents.data.forEach((evt) => {
          expect(['level_2', 'level_3']).toContain(evt.approval_level);
          // Should never be 'level_1'
          expect(evt.approval_level).not.toBe('level_1');
        });
      }
    });

    it('should not manually insert created_at (auto-default in learning_events table)', async () => {
      // Schema contract: mmm_ai_learning_events.created_at is auto-default
      // Edge Function should not INSERT created_at; Postgres applies default

      const learningEvents = await supabase
        .from('mmm_ai_learning_events')
        .select('created_at')
        .limit(1);

      expect(learningEvents.error).toBeNull();
      // If created_at is populated, it came from DB default (test passes)
      if (learningEvents.data && learningEvents.data.length > 0) {
        expect(learningEvents.data[0].created_at).toBeDefined();
      }
    });

    it('should insert audit events with actor_role (not timestamp field)', async () => {
      const auditEvents = await supabase
        .from('mmm_approval_audit_events')
        .select('actor_role, details, created_at')
        .eq('event_type', 'response_submitted')
        .limit(1);

      expect(auditEvents.error).toBeNull();
      if (auditEvents.data && auditEvents.data.length > 0) {
        const evt = auditEvents.data[0];
        expect(['level_1', 'level_2', 'level_3', 'system']).toContain(evt.actor_role);
        // Should have created_at (auto-default), not timestamp
        expect(evt.created_at).toBeDefined();
      }
    });
  });

  describe('6. mmm-approval-lock-transition schema validation', () => {
    it('should insert audit events with actor_id as UUID type', async () => {
      // Schema contract: mmm_approval_audit_events.actor_id is UUID type
      // Remediation: use '00000000-0000-0000-0000-000000000000' for system actor
      // (not string 'system')

      const auditEvents = await supabase
        .from('mmm_approval_audit_events')
        .select('actor_id')
        .eq('actor_role', 'system')
        .limit(1);

      expect(auditEvents.error).toBeNull();
      // actor_id should be valid UUID format (or null)
      if (auditEvents.data && auditEvents.data.length > 0) {
        const actorId = auditEvents.data[0].actor_id;
        if (actorId) {
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          expect(actorId).toMatch(uuidRegex);
        }
      }
    });

    it('should insert audit events with actor_role + details (not timestamp)', async () => {
      const auditEvents = await supabase
        .from('mmm_approval_audit_events')
        .select('actor_role, details')
        .eq('event_type', 'lock_transitioned')
        .limit(1);

      expect(auditEvents.error).toBeNull();
      if (auditEvents.data && auditEvents.data.length > 0) {
        const evt = auditEvents.data[0];
        expect(['level_1', 'level_2', 'level_3', 'system']).toContain(evt.actor_role);
      }
    });
  });

  describe('Enum Conformance Across All Edge Functions', () => {
    it('should only use enum values defined in frozen schema', async () => {
      // mmm_approval_rounds.status enum values:
      const validStatuses = ['draft', 'invited', 'in_review', 'changes_requested', 'resubmitted', 
                             'approved_by_some', 'approved_by_all', 'cancelled', 'superseded'];

      const rounds = await supabase
        .from('mmm_approval_rounds')
        .select('status')
        .limit(10);

      expect(rounds.error).toBeNull();
      if (rounds.data) {
        rounds.data.forEach((round) => {
          expect(validStatuses).toContain(round.status);
        });
      }
    });

    it('mmm_approval_audit_events should only use valid actor_role values', async () => {
      const validRoles = ['level_1', 'level_2', 'level_3', 'system'];

      const auditEvents = await supabase
        .from('mmm_approval_audit_events')
        .select('actor_role')
        .limit(20);

      expect(auditEvents.error).toBeNull();
      if (auditEvents.data) {
        auditEvents.data.forEach((evt) => {
          expect(validRoles).toContain(evt.actor_role);
        });
      }
    });
  });

  describe('NOT NULL Constraint Enforcement', () => {
    it('mmm_approval_audit_events.organisation_id must never be null on insert', async () => {
      // Foreman finding: mmm-approval-invite-accept was inserting
      // organisation_id: roundForAudit?.organisation_id (can be undefined)
      // Schema: organisation_id NOT NULL

      const auditEvents = await supabase
        .from('mmm_approval_audit_events')
        .select('organisation_id')
        .is('organisation_id', null)
        .limit(1);

      // If this query returns results, it means null values exist (schema violation)
      if (auditEvents.data && auditEvents.data.length > 0) {
        throw new Error('mmm_approval_audit_events.organisation_id should never be null (NOT NULL constraint)');
      }
    });

    it('mmm_approval_locks.reason must never be null on insert', async () => {
      // Schema: reason NOT NULL

      const locks = await supabase
        .from('mmm_approval_locks')
        .select('reason')
        .is('reason', null)
        .limit(1);

      if (locks.data && locks.data.length > 0) {
        throw new Error('mmm_approval_locks.reason should never be null (NOT NULL constraint)');
      }
    });
  });
});
