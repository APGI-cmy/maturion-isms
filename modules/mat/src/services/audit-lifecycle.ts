/**
 * Audit Lifecycle Service
 * Architecture: modules/mat/02-architecture/system-architecture.md §3.12
 * Implements audit creation, status transitions, soft deletion, archival, and approvals
 */

import type { 
  Audit, 
  AuditStatus, 
  AuditTrailEntry,
  ApprovalRecord,
  AuditorAssignment,
  UserRole,
  ApprovalAction
} from '../types/index.js';
import { AUDIT_STATUS_TRANSITIONS } from '../types/index.js';

/**
 * Creates a new audit with all required fields
 * Architecture: §3.12 Path 1 — Audit Creation
 * FRS: FR-001
 * 
 * @param params - Audit creation parameters
 * @returns Newly created audit with generated ID and timestamps
 */
export function createAudit(params: {
  title: string;
  org_name: string;
  org_id: string;
  facility: string;
  lead_auditor_id: string;
  audit_period_start: string;
  audit_period_end: string;
}): Audit {
  const now = new Date().toISOString();
  
  return {
    id: generateUniqueId(),
    title: params.title,
    org_name: params.org_name,
    org_id: params.org_id,
    facility: params.facility,
    status: 'not_started',
    audit_period_start: params.audit_period_start,
    audit_period_end: params.audit_period_end,
    lead_auditor_id: params.lead_auditor_id,
    created_at: now,
    updated_at: now,
    deleted_at: null,
    is_archived: false
  };
}

/**
 * Transitions an audit to a new status
 * Architecture: §3.12 Path 1
 * FRS: FR-002
 * 
 * Valid transitions:
 * - not_started → in_progress
 * - in_progress → under_review
 * - under_review → completed | in_progress (back to revision)
 * - completed → archived
 * - archived → (terminal, no further transitions)
 * 
 * @param audit - Current audit object
 * @param newStatus - Target status
 * @returns Updated audit with new status and timestamp
 * @throws Error if transition is invalid
 */
export function transitionAuditStatus(audit: Audit, newStatus: AuditStatus): Audit {
  const allowedTransitions = AUDIT_STATUS_TRANSITIONS[audit.status];
  
  if (allowedTransitions.indexOf(newStatus) === -1) {
    throw new Error(
      `Invalid status transition: ${audit.status} → ${newStatus}. ` +
      `Allowed transitions: ${allowedTransitions.join(', ')}`
    );
  }
  
  return {
    ...audit,
    status: newStatus,
    updated_at: new Date().toISOString()
  };
}

/**
 * Soft deletes an audit by setting deleted_at timestamp
 * Architecture: §3.12 Path 1
 * FRS: FR-003
 * 
 * @param audit - Audit to soft delete
 * @returns Updated audit with deleted_at timestamp
 * @throws Error if audit is already deleted
 */
export function softDeleteAudit(audit: Audit): Audit {
  if (audit.deleted_at !== null) {
    throw new Error('Audit is already deleted');
  }
  
  return {
    ...audit,
    deleted_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

/**
 * Archives a completed audit
 * Architecture: §3.12 Path 1
 * FRS: FR-003
 * 
 * Only completed audits can be archived.
 * Archived audits cannot transition to other states.
 * 
 * @param audit - Audit to archive
 * @returns Updated audit with is_archived=true
 * @throws Error if audit is not completed
 */
export function archiveAudit(audit: Audit): Audit {
  if (audit.status !== 'completed') {
    throw new Error('Only completed audits can be archived');
  }
  
  return {
    ...audit,
    is_archived: true,
    status: 'archived',
    updated_at: new Date().toISOString()
  };
}

/**
 * Approves a report
 * Architecture: §3.12 Path 5
 * FRS: FR-038
 * 
 * Only lead_auditor and admin roles can approve reports.
 * 
 * @param reportId - ID of report to approve
 * @param approverId - ID of user approving
 * @param approverRole - Role of approver
 * @returns Approval record with approval details
 * @throws Error if approver lacks authority
 */
export function approveReport(
  reportId: string,
  approverId: string,
  approverRole: UserRole
): ApprovalRecord {
  if (!validateApprovalAuthority(approverRole, 'approve_report')) {
    throw new Error(`Role ${approverRole} lacks authority to approve reports`);
  }
  
  return {
    approved: true,
    approved_by: approverId,
    approved_at: new Date().toISOString()
  };
}

/**
 * Assigns an auditor to a domain or MPS
 * Architecture: §3.2
 * FRS: FR-045
 * 
 * Only lead_auditor and admin roles can assign auditors.
 * 
 * @param assignerRole - Role of user making assignment
 * @param auditorId - ID of auditor being assigned
 * @param targetType - Type of target ('domain' or 'mps')
 * @param targetId - ID of target domain or MPS
 * @returns Auditor assignment record
 * @throws Error if assigner lacks authority
 */
export function assignAuditor(
  assignerRole: UserRole,
  auditorId: string,
  targetType: 'domain' | 'mps',
  targetId: string
): AuditorAssignment {
  if (!validateApprovalAuthority(assignerRole, 'assign_auditor')) {
    throw new Error(`Role ${assignerRole} lacks authority to assign auditors`);
  }
  
  return {
    auditor_id: auditorId,
    target_type: targetType,
    target_id: targetId,
    assigned_at: new Date().toISOString()
  };
}

/**
 * Validates if a role has authority for a given action
 * Architecture: §3.2
 * FRS: FR-046
 * 
 * Authority matrix:
 * - approve_report: lead_auditor, admin
 * - approve_criteria: lead_auditor, admin
 * - confirm_score: lead_auditor, domain_auditor, admin
 * - assign_auditor: lead_auditor, admin
 * 
 * @param role - User role to check
 * @param action - Action to validate
 * @returns true if role has authority, false otherwise
 */
export function validateApprovalAuthority(
  role: UserRole,
  action: ApprovalAction
): boolean {
  const authorityMatrix: Record<ApprovalAction, UserRole[]> = {
    approve_report: ['lead_auditor', 'admin'],
    approve_criteria: ['lead_auditor', 'admin'],
    confirm_score: ['lead_auditor', 'domain_auditor', 'admin'],
    assign_auditor: ['lead_auditor', 'admin']
  };
  
  return authorityMatrix[action].indexOf(role) !== -1;
}

/**
 * Creates an immutable audit trail entry
 * 
 * @param params - Audit trail entry parameters
 * @returns Created audit trail entry
 */
export function createAuditTrailEntry(params: {
  entity_type: string;
  entity_id: string;
  action: string;
  actor_id: string;
  changes: Record<string, unknown>;
}): AuditTrailEntry {
  return {
    id: generateUniqueId(),
    entity_type: params.entity_type,
    entity_id: params.entity_id,
    action: params.action,
    actor_id: params.actor_id,
    changes: params.changes,
    timestamp: new Date().toISOString(),
    is_immutable: true
  };
}

/**
 * Generates a unique ID for entities
 * In production, this would use a UUID library or database sequence
 * 
 * @returns Unique identifier string
 */
function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}
