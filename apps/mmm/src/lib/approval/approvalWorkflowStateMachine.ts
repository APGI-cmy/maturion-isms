export type DomainApprovalState =
  | 'draft'
  | 'submitted_l1'
  | 'returned_l2'
  | 'resubmitted_l1'
  | 'approved_l2'
  | 'revision_required';

export type FrameworkApprovalState =
  | 'draft'
  | 'ready_for_l3'
  | 'submitted_l3'
  | 'returned_l3'
  | 'approved_l3'
  | 'revision_required';

export type ApprovalAction =
  | 'submit'
  | 'return'
  | 'resubmit'
  | 'approve'
  | 'reassign'
  | 'mark_revision_required';

export interface ApprovalActor {
  userId: string;
  organisationId: string;
  role: string;
}

export interface ApprovalTransitionInput<State extends string> {
  currentState: State;
  expectedState: State;
  currentVersion: number;
  expectedVersion: number;
  action: ApprovalAction;
  actor: ApprovalActor;
  submitterUserId?: string | null;
  assignedReviewerUserId?: string | null;
  assignedApproverUserId?: string | null;
  packageComplete?: boolean;
  allRequiredDomainsApprovedL2?: boolean;
  reason?: string | null;
  idempotencyKey: string;
}

export class ApprovalConflictError extends Error {
  readonly status = 409;
}

export class ApprovalForbiddenError extends Error {
  readonly status = 403;
}

export class ApprovalIncompleteError extends Error {
  readonly status = 422;
}

export const DOMAIN_TRANSITIONS: Record<DomainApprovalState, Partial<Record<ApprovalAction, DomainApprovalState>>> = {
  draft: { submit: 'submitted_l1' },
  submitted_l1: { return: 'returned_l2', approve: 'approved_l2', reassign: 'submitted_l1' },
  returned_l2: { resubmit: 'resubmitted_l1' },
  resubmitted_l1: { return: 'returned_l2', approve: 'approved_l2', reassign: 'resubmitted_l1' },
  approved_l2: { mark_revision_required: 'revision_required' },
  revision_required: { submit: 'submitted_l1' },
};

export const FRAMEWORK_TRANSITIONS: Record<FrameworkApprovalState, Partial<Record<ApprovalAction, FrameworkApprovalState>>> = {
  draft: { submit: 'submitted_l3' },
  ready_for_l3: { submit: 'submitted_l3' },
  submitted_l3: { return: 'returned_l3', approve: 'approved_l3', reassign: 'submitted_l3' },
  returned_l3: { resubmit: 'submitted_l3' },
  approved_l3: { mark_revision_required: 'revision_required' },
  revision_required: { submit: 'submitted_l3' },
};

function requireExpectedStateAndVersion<State extends string>(input: ApprovalTransitionInput<State>): void {
  if (input.currentState !== input.expectedState || input.currentVersion !== input.expectedVersion) {
    throw new ApprovalConflictError('Approval state/version conflict. Reload server truth and retry.');
  }
  if (!input.idempotencyKey?.trim()) {
    throw new ApprovalConflictError('An idempotency key is required for every approval transition.');
  }
}

function requireReason(input: ApprovalTransitionInput<string>): void {
  if (['submit', 'return', 'resubmit', 'approve', 'reassign'].includes(input.action) && !input.reason?.trim()) {
    throw new ApprovalIncompleteError(`A reason or comment is required for ${input.action}.`);
  }
}

function requireNoSelfApproval(input: ApprovalTransitionInput<string>): void {
  if (['approve', 'return'].includes(input.action) && input.submitterUserId === input.actor.userId) {
    throw new ApprovalForbiddenError('Self-approval is prohibited: submitter and approver must differ.');
  }
}

function requireAssignedActor(input: ApprovalTransitionInput<string>, level: 2 | 3): void {
  const assigned = level === 2 ? input.assignedReviewerUserId : input.assignedApproverUserId;
  if (['approve', 'return', 'reassign'].includes(input.action) && assigned && assigned !== input.actor.userId) {
    throw new ApprovalForbiddenError(`Only the assigned ${level === 2 ? 'reviewer' : 'approver'} may perform this action.`);
  }
}

export function resolveDomainTransition(input: ApprovalTransitionInput<DomainApprovalState>): DomainApprovalState {
  requireExpectedStateAndVersion(input);
  requireReason(input);
  requireNoSelfApproval(input);
  requireAssignedActor(input, 2);
  if (['submit', 'resubmit'].includes(input.action) && input.packageComplete !== true) {
    throw new ApprovalIncompleteError('The domain package is incomplete.');
  }
  const next = DOMAIN_TRANSITIONS[input.currentState]?.[input.action];
  if (!next) throw new ApprovalConflictError(`Invalid domain transition: ${input.currentState} -> ${input.action}.`);
  return next;
}

export function resolveFrameworkTransition(input: ApprovalTransitionInput<FrameworkApprovalState>): FrameworkApprovalState {
  requireExpectedStateAndVersion(input);
  requireReason(input);
  requireNoSelfApproval(input);
  requireAssignedActor(input, 3);
  if (input.action === 'submit' && input.allRequiredDomainsApprovedL2 !== true) {
    throw new ApprovalIncompleteError('All required domains must hold current approved_l2 status before Level 3 submission.');
  }
  const next = FRAMEWORK_TRANSITIONS[input.currentState]?.[input.action];
  if (!next) throw new ApprovalConflictError(`Invalid framework transition: ${input.currentState} -> ${input.action}.`);
  return next;
}

export function approvalLockState(state: DomainApprovalState | FrameworkApprovalState): boolean {
  return ['submitted_l1', 'resubmitted_l1', 'approved_l2', 'submitted_l3', 'approved_l3'].includes(state);
}
