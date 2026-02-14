/**
 * Human Approval Workflow UI Component Logic
 * Architecture: modules/mat/02-architecture/ui-component-architecture.md §2
 * Implements approval workflow for AI-parsed criteria with confirm/reject actions.
 * TR-012: Role-based approval
 */

import type { ParsedCriterion, UserRole, Criterion, CriterionStatus } from '../types/index.js';

/** Approval action types */
export type ApprovalAction = 'approve' | 'reject' | 'request_changes';

/** Individual criterion approval state */
export interface CriterionApprovalState {
  criterionNumber: string;
  criterionTitle: string;
  description: string;
  sourceText: string;
  action: ApprovalAction | null;
  rejectionReason?: string;
  reviewedAt?: string;
}

/** Overall approval workflow state */
export interface ApprovalWorkflowState {
  mpsId: string;
  approverRole: UserRole;
  criteria: CriterionApprovalState[];
  totalCriteria: number;
  reviewedCount: number;
  approvedCount: number;
  rejectedCount: number;
  isComplete: boolean;
  canSubmit: boolean;
  accessibilityAttributes: ApprovalAccessibilityAttributes;
}

/** Accessibility attributes for approval UI */
export interface ApprovalAccessibilityAttributes {
  role: string;
  ariaLabel: string;
  ariaLive: string;
  tabIndex: number;
  keyboardShortcuts: Record<string, string>;
}

/** Approval summary result */
export interface ApprovalSummary {
  totalCriteria: number;
  approved: number;
  rejected: number;
  pending: number;
  completionPercentage: number;
}

/**
 * Validates if a user role can approve criteria
 * TR-012: Role-based approval — only lead_auditor and admin
 */
export function canApprove(role: UserRole): boolean {
  return role === 'lead_auditor' || role === 'admin';
}

/**
 * Creates initial approval workflow state from parsed criteria
 */
export function createApprovalWorkflow(
  parsedCriteria: ParsedCriterion[],
  mpsId: string,
  approverRole: UserRole
): ApprovalWorkflowState {
  if (!canApprove(approverRole)) {
    throw new Error(`Role ${approverRole} is not authorized to approve criteria`);
  }

  const criteriaStates: CriterionApprovalState[] = parsedCriteria.map(c => ({
    criterionNumber: c.number,
    criterionTitle: c.title,
    description: c.description,
    sourceText: c.source_text,
    action: null,
  }));

  return {
    mpsId,
    approverRole,
    criteria: criteriaStates,
    totalCriteria: parsedCriteria.length,
    reviewedCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    isComplete: false,
    canSubmit: false,
    accessibilityAttributes: generateApprovalAccessibility(),
  };
}

/**
 * Applies an approval action to a specific criterion
 */
export function applyCriterionAction(
  state: ApprovalWorkflowState,
  criterionNumber: string,
  action: ApprovalAction,
  rejectionReason?: string
): ApprovalWorkflowState {
  if (action === 'reject' && (!rejectionReason || rejectionReason.trim() === '')) {
    throw new Error('Rejection reason is required when rejecting a criterion');
  }

  const updatedCriteria = state.criteria.map(c => {
    if (c.criterionNumber === criterionNumber) {
      return {
        ...c,
        action,
        rejectionReason: action === 'reject' ? rejectionReason : undefined,
        reviewedAt: new Date().toISOString(),
      };
    }
    return c;
  });

  const reviewedCount = updatedCriteria.filter(c => c.action !== null).length;
  const approvedCount = updatedCriteria.filter(c => c.action === 'approve').length;
  const rejectedCount = updatedCriteria.filter(c => c.action === 'reject').length;
  const isComplete = reviewedCount === state.totalCriteria;

  return {
    ...state,
    criteria: updatedCriteria,
    reviewedCount,
    approvedCount,
    rejectedCount,
    isComplete,
    canSubmit: isComplete,
  };
}

/**
 * Calculates approval summary
 */
export function calculateApprovalSummary(state: ApprovalWorkflowState): ApprovalSummary {
  return {
    totalCriteria: state.totalCriteria,
    approved: state.approvedCount,
    rejected: state.rejectedCount,
    pending: state.totalCriteria - state.reviewedCount,
    completionPercentage: state.totalCriteria > 0
      ? Math.round((state.reviewedCount / state.totalCriteria) * 100)
      : 0,
  };
}

/**
 * Generates WCAG 2.1 AA accessibility attributes for approval UI
 * TR-033: Accessibility
 */
export function generateApprovalAccessibility(): ApprovalAccessibilityAttributes {
  return {
    role: 'form',
    ariaLabel: 'Criteria Approval Workflow',
    ariaLive: 'polite',
    tabIndex: 0,
    keyboardShortcuts: {
      'Enter': 'Confirm action',
      'Escape': 'Cancel/Close',
      'Tab': 'Next criterion',
      'Shift+Tab': 'Previous criterion',
      'a': 'Approve criterion',
      'r': 'Reject criterion',
    },
  };
}
