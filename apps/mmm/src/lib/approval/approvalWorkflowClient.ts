import { getEdgeInvokeHeaders, supabase } from '../supabase';
import type { DomainApprovalState, FrameworkApprovalState } from './approvalWorkflowStateMachine';

export interface ApprovalServerTruth<State extends string> {
  id: string;
  status: State;
  locked: boolean;
  version: number;
  assigned_reviewer?: string | null;
  assigned_approver?: string | null;
  updated_at?: string | null;
}

export const DOMAIN_APPROVAL_STATES: DomainApprovalState[] = [
  'draft', 'submitted_l1', 'returned_l2', 'resubmitted_l1', 'approved_l2', 'revision_required',
];

export const FRAMEWORK_APPROVAL_STATES: FrameworkApprovalState[] = [
  'draft', 'ready_for_l3', 'submitted_l3', 'returned_l3', 'approved_l3', 'revision_required',
];

export async function readDomainApproval(domainId: string): Promise<ApprovalServerTruth<DomainApprovalState> | null> {
  const { data, error } = await supabase.from('mmm_domain_approval_requests')
    .select('id,status,locked,version,assigned_reviewer,updated_at')
    .eq('domain_id', domainId).maybeSingle();
  if (error) throw error;
  return data as ApprovalServerTruth<DomainApprovalState> | null;
}

export async function readFrameworkApproval(frameworkId: string): Promise<ApprovalServerTruth<FrameworkApprovalState> | null> {
  const { data, error } = await supabase.from('mmm_framework_approval_requests')
    .select('id,status,locked,version,assigned_approver,updated_at')
    .eq('framework_id', frameworkId).maybeSingle();
  if (error) throw error;
  return data as ApprovalServerTruth<FrameworkApprovalState> | null;
}

export async function submitDomainApprovalAction(input: {
  domainId: string;
  actionType: 'submit' | 'return' | 'resubmit' | 'approve' | 'reassign' | 'mark_revision_required';
  expectedState: DomainApprovalState;
  expectedVersion: number;
  idempotencyKey: string;
  reason: string;
  assignedReviewer?: string | null;
}) {
  const headers = await getEdgeInvokeHeaders();
  const { data, error } = await supabase.functions.invoke('mmm-domain-approval-action', {
    headers,
    body: {
      domain_id: input.domainId,
      action_type: input.actionType,
      expected_state: input.expectedState,
      expected_version: input.expectedVersion,
      idempotency_key: input.idempotencyKey,
      reason: input.reason,
      assigned_reviewer: input.assignedReviewer,
    },
  });
  if (error) throw new Error(error.message || 'Domain approval action failed.');
  return data as ApprovalServerTruth<DomainApprovalState>;
}

export async function submitFrameworkApprovalAction(input: {
  frameworkId: string;
  actionType: 'submit' | 'return' | 'resubmit' | 'approve' | 'reassign' | 'mark_revision_required';
  expectedState: FrameworkApprovalState;
  expectedVersion: number;
  idempotencyKey: string;
  reason: string;
  assignedApprover?: string | null;
}) {
  const headers = await getEdgeInvokeHeaders();
  const { data, error } = await supabase.functions.invoke('mmm-framework-approval-action', {
    headers,
    body: {
      framework_id: input.frameworkId,
      action_type: input.actionType,
      expected_state: input.expectedState,
      expected_version: input.expectedVersion,
      idempotency_key: input.idempotencyKey,
      reason: input.reason,
      assigned_approver: input.assignedApprover,
    },
  });
  if (error) throw new Error(error.message || 'Framework approval action failed.');
  return data as ApprovalServerTruth<FrameworkApprovalState>;
}

export function approvalStatusLabel(status: DomainApprovalState | FrameworkApprovalState): string {
  return status.replace(/_/g, ' ').toUpperCase();
}
