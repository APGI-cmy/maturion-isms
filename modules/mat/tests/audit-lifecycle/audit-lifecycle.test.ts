/**
 * MAT Red Test Suite — CAT-01: audit lifecycle
 *
 * QA-to-Red: All tests MUST fail with NOT_IMPLEMENTED.
 * These tests define expected behavior before implementation exists.
 *
 * Registry: governance/TEST_REGISTRY.json
 * Strategy: Maturion/strategy/MAT_RED_TEST_SUITE_STRATEGY.md
 */
import { describe, it, expect } from 'vitest';
import {
  createAudit,
  transitionAuditStatus,
  softDeleteAudit,
  archiveAudit,
  approveReport,
  assignAuditor,
  validateApprovalAuthority
} from '../../src/services/audit-lifecycle.js';

describe('CAT-01: audit lifecycle', () => {
  it('MAT-T-0001: Audit Creation', () => {
    // Architecture: §3.12 Path 1 — Audit Creation
    // FRS: FR-001
    // TRS: TR-012
    // Type: integration | Priority: P0
    
    const audit = createAudit({
      title: 'Test Audit 2024',
      org_name: 'Test Organization',
      org_id: 'org-123',
      facility: 'Main Campus',
      lead_auditor_id: 'auditor-001',
      audit_period_start: '2024-01-01',
      audit_period_end: '2024-12-31'
    });
    
    // Verify audit has valid ID
    expect(audit.id).toBeTruthy();
    expect(typeof audit.id).toBe('string');
    
    // Verify status is 'not_started'
    expect(audit.status).toBe('not_started');
    
    // Verify required fields
    expect(audit.org_name).toBe('Test Organization');
    expect(audit.org_id).toBe('org-123');
    expect(audit.facility).toBe('Main Campus');
    expect(audit.audit_period_start).toBe('2024-01-01');
    expect(audit.audit_period_end).toBe('2024-12-31');
    
    // Verify timestamps
    expect(audit.created_at).toBeTruthy();
    expect(audit.updated_at).toBeTruthy();
    
    // Verify nullable fields
    expect(audit.deleted_at).toBeNull();
    expect(audit.is_archived).toBe(false);
  });

  it('MAT-T-0002: Audit Status Lifecycle', () => {
    // Architecture: §3.12 Path 1
    // FRS: FR-002
    // TRS: TR-012
    // Type: integration | Priority: P0
    
    // Create audit with initial status
    let audit = createAudit({
      title: 'Lifecycle Test',
      org_name: 'Test Org',
      org_id: 'org-456',
      facility: 'Facility A',
      lead_auditor_id: 'auditor-002',
      audit_period_start: '2024-01-01',
      audit_period_end: '2024-12-31'
    });
    
    expect(audit.status).toBe('not_started');
    
    // Valid transition: not_started → in_progress
    audit = transitionAuditStatus(audit, 'in_progress');
    expect(audit.status).toBe('in_progress');
    
    // Valid transition: in_progress → under_review
    audit = transitionAuditStatus(audit, 'under_review');
    expect(audit.status).toBe('under_review');
    
    // Valid transition: under_review → in_progress (back to revision)
    audit = transitionAuditStatus(audit, 'in_progress');
    expect(audit.status).toBe('in_progress');
    
    // Return to under_review
    audit = transitionAuditStatus(audit, 'under_review');
    
    // Valid transition: under_review → completed
    audit = transitionAuditStatus(audit, 'completed');
    expect(audit.status).toBe('completed');
    
    // Valid transition: completed → archived
    audit = transitionAuditStatus(audit, 'archived');
    expect(audit.status).toBe('archived');
    
    // Invalid transition from archived (terminal state)
    expect(() => {
      transitionAuditStatus(audit, 'in_progress');
    }).toThrow();
    
    // Test invalid direct transition: not_started → completed (should fail)
    const newAudit = createAudit({
      title: 'Invalid Transition Test',
      org_name: 'Test Org',
      org_id: 'org-789',
      facility: 'Facility B',
      lead_auditor_id: 'auditor-003',
      audit_period_start: '2024-01-01',
      audit_period_end: '2024-12-31'
    });
    
    expect(() => {
      transitionAuditStatus(newAudit, 'completed');
    }).toThrow(/Invalid status transition/);
  });

  it('MAT-T-0003: Audit Soft Deletion and Archival', () => {
    // Architecture: §3.12 Path 1
    // FRS: FR-003
    // TRS: TR-012
    // Type: integration | Priority: P1
    
    // Test soft deletion
    let audit = createAudit({
      title: 'Deletion Test',
      org_name: 'Test Org',
      org_id: 'org-delete',
      facility: 'Facility C',
      lead_auditor_id: 'auditor-004',
      audit_period_start: '2024-01-01',
      audit_period_end: '2024-12-31'
    });
    
    expect(audit.deleted_at).toBeNull();
    
    // Soft delete sets deleted_at
    audit = softDeleteAudit(audit);
    expect(audit.deleted_at).toBeTruthy();
    expect(typeof audit.deleted_at).toBe('string');
    
    // Prevent double-delete
    expect(() => {
      softDeleteAudit(audit);
    }).toThrow(/already deleted/);
    
    // Test archival - only completed audits can be archived
    let archiveAudit1 = createAudit({
      title: 'Archive Test',
      org_name: 'Test Org',
      org_id: 'org-archive',
      facility: 'Facility D',
      lead_auditor_id: 'auditor-005',
      audit_period_start: '2024-01-01',
      audit_period_end: '2024-12-31'
    });
    
    // Cannot archive non-completed audit
    expect(() => {
      archiveAudit(archiveAudit1);
    }).toThrow(/Only completed audits can be archived/);
    
    // Transition to completed
    archiveAudit1 = transitionAuditStatus(archiveAudit1, 'in_progress');
    archiveAudit1 = transitionAuditStatus(archiveAudit1, 'under_review');
    archiveAudit1 = transitionAuditStatus(archiveAudit1, 'completed');
    
    // Now archive should work
    archiveAudit1 = archiveAudit(archiveAudit1);
    expect(archiveAudit1.is_archived).toBe(true);
    expect(archiveAudit1.status).toBe('archived');
    
    // Archived audits can't transition
    expect(() => {
      transitionAuditStatus(archiveAudit1, 'in_progress');
    }).toThrow(/Invalid status transition/);
  });

  it('MAT-T-0038: Report Approval', () => {
    // Architecture: §3.12 Path 5
    // FRS: FR-038
    // TRS: TR-012
    // Type: integration | Priority: P0
    
    const reportId = 'report-123';
    const approverId = 'approver-001';
    
    // Test lead_auditor can approve
    const approval1 = approveReport(reportId, approverId, 'lead_auditor');
    expect(approval1.approved).toBe(true);
    expect(approval1.approved_by).toBe(approverId);
    expect(approval1.approved_at).toBeTruthy();
    
    // Test admin can approve
    const approval2 = approveReport(reportId, approverId, 'admin');
    expect(approval2.approved).toBe(true);
    expect(approval2.approved_by).toBe(approverId);
    expect(approval2.approved_at).toBeTruthy();
    
    // Test domain_auditor cannot approve
    expect(() => {
      approveReport(reportId, approverId, 'domain_auditor');
    }).toThrow(/lacks authority to approve reports/);
    
    // Test mps_auditor cannot approve
    expect(() => {
      approveReport(reportId, approverId, 'mps_auditor');
    }).toThrow(/lacks authority to approve reports/);
    
    // Test evidence_contributor cannot approve
    expect(() => {
      approveReport(reportId, approverId, 'evidence_contributor');
    }).toThrow(/lacks authority to approve reports/);
  });

  it('MAT-T-0045: Auditor Assignment Flow', () => {
    // Architecture: §3.2
    // FRS: FR-045
    // TRS: TR-020
    // Type: integration | Priority: P0
    
    const auditorId = 'auditor-new-001';
    const targetId = 'domain-001';
    
    // Test lead_auditor can assign
    const assignment1 = assignAuditor('lead_auditor', auditorId, 'domain', targetId);
    expect(assignment1.auditor_id).toBe(auditorId);
    expect(assignment1.target_type).toBe('domain');
    expect(assignment1.target_id).toBe(targetId);
    expect(assignment1.assigned_at).toBeTruthy();
    
    // Test admin can assign
    const assignment2 = assignAuditor('admin', auditorId, 'mps', 'mps-001');
    expect(assignment2.auditor_id).toBe(auditorId);
    expect(assignment2.target_type).toBe('mps');
    expect(assignment2.target_id).toBe('mps-001');
    expect(assignment2.assigned_at).toBeTruthy();
    
    // Test domain_auditor cannot assign
    expect(() => {
      assignAuditor('domain_auditor', auditorId, 'domain', targetId);
    }).toThrow(/lacks authority to assign auditors/);
    
    // Test mps_auditor cannot assign
    expect(() => {
      assignAuditor('mps_auditor', auditorId, 'domain', targetId);
    }).toThrow(/lacks authority to assign auditors/);
    
    // Test evidence_contributor cannot assign
    expect(() => {
      assignAuditor('evidence_contributor', auditorId, 'domain', targetId);
    }).toThrow(/lacks authority to assign auditors/);
  });

  it('MAT-T-0046: Approval Authority', () => {
    // Architecture: §3.2
    // FRS: FR-046
    // TRS: TR-023
    // Type: integration | Priority: P0
    
    // Test approve_report authority
    expect(validateApprovalAuthority('lead_auditor', 'approve_report')).toBe(true);
    expect(validateApprovalAuthority('admin', 'approve_report')).toBe(true);
    expect(validateApprovalAuthority('domain_auditor', 'approve_report')).toBe(false);
    expect(validateApprovalAuthority('mps_auditor', 'approve_report')).toBe(false);
    expect(validateApprovalAuthority('evidence_contributor', 'approve_report')).toBe(false);
    
    // Test approve_criteria authority
    expect(validateApprovalAuthority('lead_auditor', 'approve_criteria')).toBe(true);
    expect(validateApprovalAuthority('admin', 'approve_criteria')).toBe(true);
    expect(validateApprovalAuthority('domain_auditor', 'approve_criteria')).toBe(false);
    expect(validateApprovalAuthority('mps_auditor', 'approve_criteria')).toBe(false);
    expect(validateApprovalAuthority('evidence_contributor', 'approve_criteria')).toBe(false);
    
    // Test confirm_score authority (domain_auditor has this one)
    expect(validateApprovalAuthority('lead_auditor', 'confirm_score')).toBe(true);
    expect(validateApprovalAuthority('domain_auditor', 'confirm_score')).toBe(true);
    expect(validateApprovalAuthority('admin', 'confirm_score')).toBe(true);
    expect(validateApprovalAuthority('mps_auditor', 'confirm_score')).toBe(false);
    expect(validateApprovalAuthority('evidence_contributor', 'confirm_score')).toBe(false);
    
    // Test assign_auditor authority
    expect(validateApprovalAuthority('lead_auditor', 'assign_auditor')).toBe(true);
    expect(validateApprovalAuthority('admin', 'assign_auditor')).toBe(true);
    expect(validateApprovalAuthority('domain_auditor', 'assign_auditor')).toBe(false);
    expect(validateApprovalAuthority('mps_auditor', 'assign_auditor')).toBe(false);
    expect(validateApprovalAuthority('evidence_contributor', 'assign_auditor')).toBe(false);
  });
});
