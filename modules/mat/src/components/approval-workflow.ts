/**
 * Approval Workflow Component Logic
 * Architecture: modules/mat/02-architecture/ui-component-architecture.md §2 (Criteria Modal TR-047)
 * FRS: FR-008 (Human Approval of Parsed Criteria)
 * TRS: TR-012 (Approval Authority)
 *
 * Implements human approval workflow UI for AI-parsed criteria.
 * Shows parsed criteria with confirm/reject actions, role-based access,
 * and audit trail logging.
 */

import type { Criterion, UserRole } from '../types/index.js';

/**
 * Approval action types
 */
export type ApprovalAction = 'approve' | 'reject' | 'request_changes';

/**
 * Approval item representing a parsed criterion awaiting review
 */
export interface ApprovalItem {
  criterion: {
    number: string;
    title: string;
    description: string;
    source_text: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  reviewerNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

/**
 * Approval queue state
 */
export interface ApprovalQueueState {
  items: ApprovalItem[];
  currentIndex: number;
  totalItems: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
}

/**
 * Roles that can approve criteria
 * Architecture: §3.2 — RBAC
 * FRS: FR-008 — only lead_auditor and admin
 */
export const APPROVAL_AUTHORIZED_ROLES: UserRole[] = ['lead_auditor', 'admin'];

/**
 * Checks if a user role is authorized to approve criteria
 *
 * @param role - User's role
 * @returns true if authorized
 */
export function canApproveCriteria(role: UserRole): boolean {
  return APPROVAL_AUTHORIZED_ROLES.indexOf(role) !== -1;
}

/**
 * Creates an approval queue from parsed criteria
 *
 * @param parsedCriteria - Array of parsed criteria from AI
 * @returns Initial approval queue state
 */
export function createApprovalQueue(
  parsedCriteria: { number: string; title: string; description: string; source_text: string }[]
): ApprovalQueueState {
  return {
    items: parsedCriteria.map(c => ({
      criterion: c,
      status: 'pending'
    })),
    currentIndex: 0,
    totalItems: parsedCriteria.length,
    approvedCount: 0,
    rejectedCount: 0,
    pendingCount: parsedCriteria.length
  };
}

/**
 * Processes an approval action on the current item
 *
 * @param state - Current approval queue state
 * @param action - Approval action
 * @param reviewerId - ID of reviewer
 * @param notes - Optional reviewer notes
 * @returns Updated state
 * @throws Error if no items to review
 */
export function processApprovalAction(
  state: ApprovalQueueState,
  action: ApprovalAction,
  reviewerId: string,
  notes?: string
): ApprovalQueueState {
  if (state.currentIndex >= state.items.length) {
    throw new Error('No more items to review');
  }

  const updatedItems = [...state.items];
  const statusMap: Record<ApprovalAction, ApprovalItem['status']> = {
    approve: 'approved',
    reject: 'rejected',
    request_changes: 'changes_requested'
  };

  updatedItems[state.currentIndex] = {
    ...updatedItems[state.currentIndex],
    status: statusMap[action],
    reviewerNotes: notes,
    reviewedAt: new Date().toISOString(),
    reviewedBy: reviewerId
  };

  const approvedCount = updatedItems.filter(i => i.status === 'approved').length;
  const rejectedCount = updatedItems.filter(i => i.status === 'rejected').length;
  const pendingCount = updatedItems.filter(i => i.status === 'pending' || i.status === 'changes_requested').length;

  return {
    ...state,
    items: updatedItems,
    currentIndex: state.currentIndex + 1,
    approvedCount,
    rejectedCount,
    pendingCount
  };
}

/**
 * Gets the current item for review
 *
 * @param state - Current approval queue state
 * @returns Current approval item or null if queue is complete
 */
export function getCurrentReviewItem(state: ApprovalQueueState): ApprovalItem | null {
  if (state.currentIndex >= state.items.length) {
    return null;
  }
  return state.items[state.currentIndex];
}

/**
 * Checks if the approval queue is complete
 *
 * @param state - Current approval queue state
 * @returns true if all items have been reviewed
 */
export function isApprovalComplete(state: ApprovalQueueState): boolean {
  return state.pendingCount === 0;
}

/**
 * Gets ARIA attributes for the approval workflow
 *
 * @param state - Current approval queue state
 * @returns ARIA attributes object
 */
export function getApprovalAriaAttributes(state: ApprovalQueueState): Record<string, string> {
  return {
    role: 'region',
    'aria-label': `Criteria approval workflow. Reviewing item ${state.currentIndex + 1} of ${state.totalItems}. ${state.approvedCount} approved, ${state.rejectedCount} rejected, ${state.pendingCount} pending.`,
    'aria-live': 'polite'
  };
}

/**
 * Gets summary of the approval queue for display
 *
 * @param state - Current approval queue state
 * @returns Summary object with counts and completion percentage
 */
export function getApprovalSummary(state: ApprovalQueueState): {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  completionPercentage: number;
} {
  const reviewed = state.approvedCount + state.rejectedCount;
  return {
    total: state.totalItems,
    approved: state.approvedCount,
    rejected: state.rejectedCount,
    pending: state.pendingCount,
    completionPercentage: state.totalItems > 0 ? Math.round((reviewed / state.totalItems) * 100) : 0
  };
}
