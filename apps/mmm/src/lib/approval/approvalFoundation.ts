export const APPROVAL_FUNCTIONS = {
  approvalRoundCreate: 'mmm-approval-round-create',
  approvalInviteAccept: 'mmm-approval-invite-accept',
  approvalProposedChangesSubmit: 'mmm-approval-proposed-changes-submit',
  approvalDecisionSubmit: 'mmm-approval-decision-submit',
  approvalLevel1ResponseSubmit: 'mmm-approval-level1-response-submit',
  approvalLockTransition: 'mmm-approval-lock-transition',
} as const;

export const NON_CANONICAL_APPROVAL_ALIASES = [
  'mmm-approver-invite',
  'mmm-proposed-change-create',
  'mmm-proposed-change-respond',
  'mmm-final-approval-round-create',
  'mmm-final-proposed-change-create',
  'mmm-final-approval-complete',
] as const;

type RecordInput = Record<string, any>;

const toApproverPayload = (approver: RecordInput) => ({
  full_name: approver.fullName,
  email: approver.email,
  designation: approver.designation,
  message: approver.message,
  due_date: approver.dueDate,
});

const toChangePayload = (change: RecordInput) => ({
  object_type: change.objectType,
  object_id: change.objectId,
  field_name: change.fieldName,
  display_reference: change.displayReference,
  original_value: change.originalValue,
  proposed_value: change.proposedValue,
  comment: change.comment,
});

const toLevel1ResponsePayload = (response: RecordInput) => ({
  proposed_change_id: response.proposedChangeId,
  action: response.action,
  final_value: response.finalValue,
  response_comment: response.responseComment,
});

export function buildApprovalRoundCreateRequest(input: RecordInput) {
  return {
    functionName: APPROVAL_FUNCTIONS.approvalRoundCreate,
    body: {
      organisation_id: input.organisationId,
      framework_id: input.frameworkId,
      domain_id: input.domainId ?? null,
      approval_level: input.approvalLevel,
      submitted_by_user_id: input.submittedByUserId,
      approvers: (input.approvers ?? []).map(toApproverPayload),
    },
  };
}

export function buildApprovalInviteAcceptRequest(input: RecordInput) {
  return {
    functionName: APPROVAL_FUNCTIONS.approvalInviteAccept,
    body: {
      token: input.token,
      user_id: input.userId ?? null,
      signup_profile: {
        full_name: input.signupProfile?.fullName,
        email: input.signupProfile?.email,
      },
    },
  };
}

export function buildProposedChangesSubmitRequest(input: RecordInput) {
  return {
    functionName: APPROVAL_FUNCTIONS.approvalProposedChangesSubmit,
    body: {
      approval_round_id: input.approvalRoundId,
      approver_id: input.approverId,
      changes: (input.changes ?? []).map(toChangePayload),
      round_comment: input.roundComment,
    },
  };
}

export function buildApprovalDecisionSubmitRequest(input: RecordInput) {
  return {
    functionName: APPROVAL_FUNCTIONS.approvalDecisionSubmit,
    body: {
      approval_round_id: input.approvalRoundId,
      approver_id: input.approverId,
      decision: input.decision,
      decision_comment: input.decisionComment,
    },
  };
}

export function buildLevel1ResponseSubmitRequest(input: RecordInput) {
  return {
    functionName: APPROVAL_FUNCTIONS.approvalLevel1ResponseSubmit,
    body: {
      approval_round_id: input.approvalRoundId,
      level_1_user_id: input.level1UserId,
      responses: (input.responses ?? []).map(toLevel1ResponsePayload),
      resubmit: input.resubmit,
    },
  };
}

export function buildApprovalLockTransitionRequest(input: RecordInput) {
  return {
    functionName: APPROVAL_FUNCTIONS.approvalLockTransition,
    body: {
      approval_round_id: input.approvalRoundId,
      lock_scope: {
        framework_id: input.lockScope?.frameworkId,
        domain_id: input.lockScope?.domainId ?? null,
        object_type: input.lockScope?.objectType,
        object_id: input.lockScope?.objectId,
      },
      target_lock_state: input.targetLockState,
      reason: input.reason,
    },
  };
}

export function buildApprovalNotificationEvent(input: RecordInput) {
  return {
    organisation_id: input.organisationId,
    framework_id: input.frameworkId,
    approval_round_id: input.approvalRoundId,
    event_type: input.eventType,
    recipient_user_id: input.recipientUserId,
  };
}

export function buildApprovalAuditEvent(input: RecordInput) {
  return {
    organisation_id: input.organisationId,
    framework_id: input.frameworkId,
    approval_round_id: input.approvalRoundId,
    actor_user_id: input.actorUserId,
    actor_role: input.actorRole,
    action: input.action,
    object_type: input.objectType,
    object_id: input.objectId,
  };
}

export function buildApprovalAiLearningEvent(input: RecordInput) {
  return {
    organisation_id: input.organisationId,
    framework_id: input.frameworkId,
    approval_round_id: input.approvalRoundId,
    proposed_change_id: input.proposedChangeId,
    approval_level: input.approvalLevel,
    object_type: input.objectType,
    object_id: input.objectId,
    original_value: input.originalValue,
    proposed_value: input.proposedValue,
    final_value: input.finalValue,
    decision: input.decision,
    reason: input.reason,
    actor_role: input.actorRole,
  };
}

export function assertApprovalMutationAllowed(input: RecordInput) {
  if (input.lockState === 'locked_by_final_approval') {
    throw new Error(`Cannot ${input.action ?? 'mutate'} ${input.objectType ?? 'object'} ${input.objectId ?? ''}: target content is final locked.`);
  }
}
