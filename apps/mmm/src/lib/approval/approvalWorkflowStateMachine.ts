export type DomainApprovalState =
  | 'draft'
  | 'submitted_l1'
  | 'submitted_l2'
  | 'returned_l2'
  | 'approved_l2';

export type FrameworkApprovalState =
  | 'submitted_l3'
  | 'returned_l3'
  | 'approved_l3'
  | 'approved_l2';

export type ApprovalState = DomainApprovalState | FrameworkApprovalState;

export interface ApprovalTransitionInput {
  currentState: ApprovalState;
  action: 'submit' | 'return' | 'resubmit' | 'approve' | 'reassign' | 'revision_required';
  expectedState?: ApprovalState;
  expectedVersion?: number;
  complete?: boolean;
  completeness?: number;
}

export interface ApprovalTransitionResult {
  nextState: ApprovalState;
  expected_state: ApprovalState;
  expected_version?: number;
  transition: string;
  audit: {
    action: string;
    from: ApprovalState;
    to: ApprovalState;
    revision_required: boolean;
  };
}

const ACTION_TO_STATE: Record<ApprovalTransitionInput['action'], ApprovalState> = {
  submit: 'submitted_l2',
  return: 'returned_l2',
  resubmit: 'submitted_l2',
  approve: 'approved_l2',
  reassign: 'submitted_l2',
  revision_required: 'returned_l2',
};

export function resolveApprovalTransition(input: ApprovalTransitionInput): ApprovalTransitionResult {
  const nextState = ACTION_TO_STATE[input.action] ?? input.currentState;
  const expected_state = input.expectedState ?? input.currentState;
  const expected_version = input.expectedVersion;
  const revisionRequired = input.action === 'revision_required';

  return {
    nextState,
    expected_state,
    expected_version,
    transition: `${input.currentState}->${nextState}`,
    audit: {
      action: input.action,
      from: input.currentState,
      to: nextState,
      revision_required: revisionRequired,
    },
  };
}
