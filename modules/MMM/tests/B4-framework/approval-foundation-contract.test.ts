import { describe, expect, it } from 'vitest';

type ApprovalFoundationModule = {
  APPROVAL_FUNCTIONS?: Record<string, string>;
  NON_CANONICAL_APPROVAL_ALIASES?: string[];
  buildApprovalRoundCreateRequest?: (input: unknown) => unknown;
  buildApprovalInviteAcceptRequest?: (input: unknown) => unknown;
  buildProposedChangesSubmitRequest?: (input: unknown) => unknown;
  buildApprovalDecisionSubmitRequest?: (input: unknown) => unknown;
  buildLevel1ResponseSubmitRequest?: (input: unknown) => unknown;
  buildApprovalLockTransitionRequest?: (input: unknown) => unknown;
  buildApprovalNotificationEvent?: (input: unknown) => unknown;
  buildApprovalAuditEvent?: (input: unknown) => unknown;
  buildApprovalAiLearningEvent?: (input: unknown) => unknown;
  assertApprovalMutationAllowed?: (input: unknown) => unknown;
};

const EXPECTED_CANONICAL_FUNCTIONS = {
  approvalRoundCreate: 'mmm-approval-round-create',
  approvalInviteAccept: 'mmm-approval-invite-accept',
  approvalProposedChangesSubmit: 'mmm-approval-proposed-changes-submit',
  approvalDecisionSubmit: 'mmm-approval-decision-submit',
  approvalLevel1ResponseSubmit: 'mmm-approval-level1-response-submit',
  approvalLockTransition: 'mmm-approval-lock-transition',
} as const;

const FORBIDDEN_ALIASES = [
  'mmm-approver-invite',
  'mmm-proposed-change-create',
  'mmm-proposed-change-respond',
  'mmm-final-approval-round-create',
  'mmm-final-proposed-change-create',
  'mmm-final-approval-complete',
];

async function loadApprovalFoundation(): Promise<ApprovalFoundationModule> {
  // RED first: this module must be implemented in the build-to-GREEN portion of
  // the wave. Keeping this as a dynamic import makes the test executable while
  // still failing clearly until the runtime contract exists.
  return import('../../../../apps/mmm/src/lib/approval/approvalFoundation');
}

describe('MMM approval foundation contract', () => {
  it('T-MMM-APPROVAL-FOUNDATION-001 exposes the canonical approval function names only', async () => {
    const approvalFoundation = await loadApprovalFoundation();

    expect(approvalFoundation.APPROVAL_FUNCTIONS).toMatchObject(EXPECTED_CANONICAL_FUNCTIONS);

    for (const forbiddenAlias of FORBIDDEN_ALIASES) {
      expect(Object.values(approvalFoundation.APPROVAL_FUNCTIONS ?? {})).not.toContain(forbiddenAlias);
    }
  });

  it('T-MMM-APPROVAL-FOUNDATION-002 declares non-canonical aliases as prohibited', async () => {
    const approvalFoundation = await loadApprovalFoundation();

    expect(approvalFoundation.NON_CANONICAL_APPROVAL_ALIASES).toEqual(expect.arrayContaining(FORBIDDEN_ALIASES));
  });

  it('T-MMM-APPROVAL-FOUNDATION-003 builds the approval round create request contract', async () => {
    const approvalFoundation = await loadApprovalFoundation();

    const request = approvalFoundation.buildApprovalRoundCreateRequest?.({
      organisationId: 'org-1',
      frameworkId: 'framework-1',
      domainId: 'domain-1',
      approvalLevel: 'level_2',
      submittedByUserId: 'user-1',
      approvers: [
        {
          fullName: 'Jane Approver',
          email: 'jane@example.com',
          designation: 'Operations Executive',
          message: 'Please review this domain.',
          dueDate: '2026-07-15',
        },
      ],
    });

    expect(request).toEqual({
      functionName: 'mmm-approval-round-create',
      body: {
        organisation_id: 'org-1',
        framework_id: 'framework-1',
        domain_id: 'domain-1',
        approval_level: 'level_2',
        submitted_by_user_id: 'user-1',
        approvers: [
          {
            full_name: 'Jane Approver',
            email: 'jane@example.com',
            designation: 'Operations Executive',
            message: 'Please review this domain.',
            due_date: '2026-07-15',
          },
        ],
      },
    });
  });

  it('T-MMM-APPROVAL-FOUNDATION-004 builds the approval invitation acceptance request contract', async () => {
    const approvalFoundation = await loadApprovalFoundation();

    const request = approvalFoundation.buildApprovalInviteAcceptRequest?.({
      token: 'invite-token',
      userId: 'user-2',
      signupProfile: {
        fullName: 'Jane Approver',
        email: 'jane@example.com',
      },
    });

    expect(request).toEqual({
      functionName: 'mmm-approval-invite-accept',
      body: {
        token: 'invite-token',
        user_id: 'user-2',
        signup_profile: {
          full_name: 'Jane Approver',
          email: 'jane@example.com',
        },
      },
    });
  });

  it('T-MMM-APPROVAL-FOUNDATION-005 builds the proposed changes submit request contract', async () => {
    const approvalFoundation = await loadApprovalFoundation();

    const request = approvalFoundation.buildProposedChangesSubmitRequest?.({
      approvalRoundId: 'round-1',
      approverId: 'approver-1',
      changes: [
        {
          objectType: 'criterion',
          objectId: 'criterion-1',
          fieldName: 'statement',
          displayReference: 'MPS 4 / Criteria 7 / statement',
          originalValue: 'Current criterion text',
          proposedValue: 'Proposed criterion text',
          comment: 'Please clarify ownership.',
        },
      ],
      roundComment: 'I have proposed one change.',
    });

    expect(request).toEqual({
      functionName: 'mmm-approval-proposed-changes-submit',
      body: {
        approval_round_id: 'round-1',
        approver_id: 'approver-1',
        changes: [
          {
            object_type: 'criterion',
            object_id: 'criterion-1',
            field_name: 'statement',
            display_reference: 'MPS 4 / Criteria 7 / statement',
            original_value: 'Current criterion text',
            proposed_value: 'Proposed criterion text',
            comment: 'Please clarify ownership.',
          },
        ],
        round_comment: 'I have proposed one change.',
      },
    });
  });

  it('T-MMM-APPROVAL-FOUNDATION-006 builds the approval decision submit request contract', async () => {
    const approvalFoundation = await loadApprovalFoundation();

    const request = approvalFoundation.buildApprovalDecisionSubmitRequest?.({
      approvalRoundId: 'round-1',
      approverId: 'approver-1',
      decision: 'approved',
      decisionComment: 'Approved with no further changes.',
    });

    expect(request).toEqual({
      functionName: 'mmm-approval-decision-submit',
      body: {
        approval_round_id: 'round-1',
        approver_id: 'approver-1',
        decision: 'approved',
        decision_comment: 'Approved with no further changes.',
      },
    });
  });

  it('T-MMM-APPROVAL-FOUNDATION-007 builds the Level 1 response submit request contract', async () => {
    const approvalFoundation = await loadApprovalFoundation();

    const request = approvalFoundation.buildLevel1ResponseSubmitRequest?.({
      approvalRoundId: 'round-1',
      level1UserId: 'user-1',
      responses: [
        {
          proposedChangeId: 'change-1',
          action: 'edited_by_level_1',
          finalValue: 'Accepted wording with Level 1 edits.',
          responseComment: 'Accepted but tightened language.',
        },
      ],
      resubmit: true,
    });

    expect(request).toEqual({
      functionName: 'mmm-approval-level1-response-submit',
      body: {
        approval_round_id: 'round-1',
        level_1_user_id: 'user-1',
        responses: [
          {
            proposed_change_id: 'change-1',
            action: 'edited_by_level_1',
            final_value: 'Accepted wording with Level 1 edits.',
            response_comment: 'Accepted but tightened language.',
          },
        ],
        resubmit: true,
      },
    });
  });

  it('T-MMM-APPROVAL-FOUNDATION-008 builds the approval lock transition request contract', async () => {
    const approvalFoundation = await loadApprovalFoundation();

    const request = approvalFoundation.buildApprovalLockTransitionRequest?.({
      approvalRoundId: 'round-1',
      lockScope: {
        frameworkId: 'framework-1',
        domainId: 'domain-1',
        objectType: 'domain',
        objectId: 'domain-1',
      },
      targetLockState: 'locked_by_level_2',
      reason: 'All Level 2 approvers approved.',
    });

    expect(request).toEqual({
      functionName: 'mmm-approval-lock-transition',
      body: {
        approval_round_id: 'round-1',
        lock_scope: {
          framework_id: 'framework-1',
          domain_id: 'domain-1',
          object_type: 'domain',
          object_id: 'domain-1',
        },
        target_lock_state: 'locked_by_level_2',
        reason: 'All Level 2 approvers approved.',
      },
    });
  });

  it('T-MMM-APPROVAL-FOUNDATION-009 creates notification, audit, and AI learning event shapes for Level 1 actions', async () => {
    const approvalFoundation = await loadApprovalFoundation();

    expect(approvalFoundation.buildApprovalNotificationEvent?.({
      organisationId: 'org-1',
      frameworkId: 'framework-1',
      approvalRoundId: 'round-1',
      eventType: 'level_1_response_submitted',
      recipientUserId: 'approver-user-1',
    })).toMatchObject({
      organisation_id: 'org-1',
      framework_id: 'framework-1',
      approval_round_id: 'round-1',
      event_type: 'level_1_response_submitted',
      recipient_user_id: 'approver-user-1',
    });

    expect(approvalFoundation.buildApprovalAuditEvent?.({
      organisationId: 'org-1',
      frameworkId: 'framework-1',
      approvalRoundId: 'round-1',
      actorUserId: 'user-1',
      actorRole: 'level_1',
      action: 'edited_by_level_1',
      objectType: 'criterion',
      objectId: 'criterion-1',
    })).toMatchObject({
      organisation_id: 'org-1',
      framework_id: 'framework-1',
      approval_round_id: 'round-1',
      actor_user_id: 'user-1',
      actor_role: 'level_1',
      action: 'edited_by_level_1',
      object_type: 'criterion',
      object_id: 'criterion-1',
    });

    expect(approvalFoundation.buildApprovalAiLearningEvent?.({
      organisationId: 'org-1',
      frameworkId: 'framework-1',
      approvalRoundId: 'round-1',
      proposedChangeId: 'change-1',
      approvalLevel: 'level_2',
      objectType: 'criterion',
      objectId: 'criterion-1',
      originalValue: 'Current text',
      proposedValue: 'Proposed text',
      finalValue: 'Accepted edited text',
      decision: 'edited',
      reason: 'Tightened wording.',
      actorRole: 'level_1',
    })).toMatchObject({
      organisation_id: 'org-1',
      framework_id: 'framework-1',
      approval_round_id: 'round-1',
      proposed_change_id: 'change-1',
      approval_level: 'level_2',
      object_type: 'criterion',
      object_id: 'criterion-1',
      original_value: 'Current text',
      proposed_value: 'Proposed text',
      final_value: 'Accepted edited text',
      decision: 'edited',
      reason: 'Tightened wording.',
      actor_role: 'level_1',
    });
  });

  it('T-MMM-APPROVAL-FOUNDATION-010 blocks mutation when target content is final locked', async () => {
    const approvalFoundation = await loadApprovalFoundation();

    expect(() => approvalFoundation.assertApprovalMutationAllowed?.({
      lockState: 'locked_by_final_approval',
      action: 'apply_level_1_response',
      objectType: 'criterion',
      objectId: 'criterion-1',
    })).toThrow(/final locked/i);
  });
});
