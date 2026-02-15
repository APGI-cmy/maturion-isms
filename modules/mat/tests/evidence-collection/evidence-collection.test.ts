/**
 * MAT Test Suite — CAT-03: evidence collection
 *
 * Build-to-Green: Tests validate evidence collection service implementation.
 *
 * Registry: governance/TEST_REGISTRY.json
 * Strategy: Maturion/strategy/MAT_RED_TEST_SUITE_STRATEGY.md
 */
import { describe, it, expect } from 'vitest';
import {
  collectTextEvidence,
  collectVoiceEvidence,
  collectPhotoEvidence,
  collectVideoEvidence,
  uploadConcurrently,
  verifyEvidenceIntegrity,
  reviewEvidence,
  createInterviewRecording,
  createAuditLevelInterview,
  validateInterviewGovernance,
  retryFailedUpload
} from '../../src/services/evidence-collection.js';
import type { InterviewGovernance } from '../../src/types/index.js';

describe('CAT-03: evidence collection', () => {
  it('MAT-T-0013: Evidence Collection — Text and Document', () => {
    // Architecture: §3.12 Path 3 — Evidence Collection
    // FRS: FR-013, FR-016
    // TRS: TR-013, TR-026
    // Type: integration | Priority: P0
    const evidence = collectTextEvidence({
      criterion_id: 'crit-001',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'text',
      content_text: 'Audit finding: compliance gap identified in section 3.2',
      uploaded_by: 'user-001'
    });

    expect(evidence.id).toBeDefined();
    expect(evidence.evidence_type).toBe('text');
    expect(evidence.content_text).toBe('Audit finding: compliance gap identified in section 3.2');
    expect(evidence.sha256_hash).toBeDefined();
    expect(evidence.sha256_hash.length).toBe(64);
    expect(evidence.status).toBe('pending_review');
    expect(evidence.criterion_id).toBe('crit-001');
    expect(evidence.deleted_at).toBeNull();
  });

  it('MAT-T-0014: Evidence Collection — Voice Recording', () => {
    // Architecture: §3.12 Path 9 — Interview Transcription
    // FRS: FR-014
    // TRS: TR-070
    // Type: integration | Priority: P0
    const evidence = collectVoiceEvidence({
      criterion_id: 'crit-002',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'voice',
      file_data: 'base64-encoded-audio-data',
      file_name: 'interview-recording.wav',
      file_size: 1024000,
      mime_type: 'audio/wav',
      uploaded_by: 'user-001'
    });

    expect(evidence.evidence_type).toBe('voice');
    expect(evidence.sha256_hash).toBeDefined();
    expect(evidence.file_name).toBe('interview-recording.wav');
    expect(evidence.metadata.transcription_status).toBe('pending');
    expect(evidence.status).toBe('pending_review');
  });

  it('MAT-T-0015: Evidence Collection — Photo Capture', () => {
    // Architecture: §3.12 Path 3
    // FRS: FR-015
    // TRS: TR-013
    // Type: integration | Priority: P0
    const evidence = collectPhotoEvidence({
      criterion_id: 'crit-003',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'photo',
      file_data: 'base64-encoded-photo-data',
      file_name: 'facility-photo.jpg',
      file_size: 2048000,
      mime_type: 'image/jpeg',
      metadata: { gps_lat: 52.52, gps_lng: 13.405 },
      uploaded_by: 'user-001'
    });

    expect(evidence.evidence_type).toBe('photo');
    expect(evidence.sha256_hash).toBeDefined();
    expect(evidence.file_path).toBe('org-001/audit-001/crit-003/photo/facility-photo.jpg');
    expect(evidence.metadata.gps_lat).toBe(52.52);
    expect(evidence.status).toBe('pending_review');
  });

  it('MAT-T-0016: Evidence Collection — Video', () => {
    // Architecture: §3.12 Path 3
    // FRS: FR-017
    // TRS: TR-069
    // Type: integration | Priority: P0
    const evidence = collectVideoEvidence({
      criterion_id: 'crit-004',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'video',
      file_data: 'base64-encoded-video-data',
      file_name: 'process-walkthrough.mp4',
      file_size: 10240000,
      mime_type: 'video/mp4',
      uploaded_by: 'user-001'
    });

    expect(evidence.evidence_type).toBe('video');
    expect(evidence.sha256_hash).toBeDefined();
    expect(evidence.file_path).toBe('org-001/audit-001/crit-004/video/process-walkthrough.mp4');
    expect(evidence.status).toBe('pending_review');
  });

  it('MAT-T-0017: Concurrent File Uploads', () => {
    // Architecture: §3.12 Path 3
    // FRS: FR-018
    // TRS: TR-010
    // Type: performance | Priority: P1
    const items = [
      {
        criterion_id: 'crit-001',
        audit_id: 'audit-001',
        organisation_id: 'org-001',
        evidence_type: 'photo' as const,
        file_data: 'photo-data-1',
        file_name: 'photo1.jpg',
        file_size: 1024,
        mime_type: 'image/jpeg',
        uploaded_by: 'user-001'
      },
      {
        criterion_id: 'crit-002',
        audit_id: 'audit-001',
        organisation_id: 'org-001',
        evidence_type: 'document' as const,
        file_data: 'doc-data-1',
        file_name: 'report.pdf',
        file_size: 2048,
        mime_type: 'application/pdf',
        uploaded_by: 'user-001'
      },
      {
        criterion_id: 'crit-003',
        audit_id: 'audit-001',
        organisation_id: 'org-001',
        evidence_type: 'text' as const,
        content_text: 'Some text evidence',
        uploaded_by: 'user-001'
      }
    ];

    const results = uploadConcurrently(items);
    expect(results).toHaveLength(3);
    results.forEach(r => {
      expect(r.id).toBeDefined();
      expect(r.sha256_hash).toBeDefined();
      expect(r.status).toBe('pending_review');
    });
  });

  it('MAT-T-0018: Evidence Integrity Verification', () => {
    // Architecture: §3.12 Path 3
    // FRS: FR-053
    // TRS: TR-026
    // Type: integration | Priority: P0
    const originalContent = 'This is the original evidence content';
    const evidence = collectTextEvidence({
      criterion_id: 'crit-001',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'text',
      content_text: originalContent,
      uploaded_by: 'user-001'
    });

    expect(verifyEvidenceIntegrity(evidence, originalContent)).toBe(true);
    expect(verifyEvidenceIntegrity(evidence, 'tampered content')).toBe(false);
  });

  it('MAT-T-0019: Evidence Review and Status', () => {
    // Architecture: §3.12 Path 3
    // FRS: FR-019
    // TRS: TR-012
    // Type: integration | Priority: P0
    const evidence = collectTextEvidence({
      criterion_id: 'crit-001',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'text',
      content_text: 'Evidence for review',
      uploaded_by: 'user-001'
    });

    expect(evidence.status).toBe('pending_review');

    const accepted = reviewEvidence(evidence, 'accepted', 'reviewer-001');
    expect(accepted.status).toBe('accepted');
    expect(accepted.metadata.reviewed_by).toBe('reviewer-001');

    const rejected = reviewEvidence(evidence, 'rejected', 'reviewer-002');
    expect(rejected.status).toBe('rejected');

    expect(() => reviewEvidence(evidence, 'pending_review', 'reviewer-003')).toThrow(
      'Cannot transition back to pending_review'
    );
  });

  it('MAT-T-0020: Criterion Interview Recording', () => {
    // Architecture: §3.12 Path 9
    // FRS: FR-020
    // TRS: TR-039
    // Type: integration | Priority: P0
    const recording = createInterviewRecording({
      evidence_id: 'ev-001',
      criterion_id: 'crit-001',
      audit_id: 'audit-001',
      duration_seconds: 300
    });

    expect(recording.id).toBeDefined();
    expect(recording.recording_type).toBe('criterion');
    expect(recording.criterion_id).toBe('crit-001');
    expect(recording.transcription_status).toBe('pending');
    expect(recording.transcription).toBeNull();
    expect(recording.duration_seconds).toBe(300);
  });

  it('MAT-T-0021: Audit-Level Interview', () => {
    // Architecture: §3.12 Path 9
    // FRS: FR-021
    // TRS: TR-039
    // Type: integration | Priority: P1
    const recording = createAuditLevelInterview({
      evidence_id: 'ev-002',
      audit_id: 'audit-001',
      duration_seconds: 1800
    });

    expect(recording.id).toBeDefined();
    expect(recording.recording_type).toBe('audit');
    expect(recording.criterion_id).toBeNull();
    expect(recording.transcription_status).toBe('pending');
    expect(recording.duration_seconds).toBe(1800);
  });

  it('MAT-T-0022: Interview Governance', () => {
    // Architecture: §3.12 Path 9
    // FRS: FR-022
    // TRS: TR-025
    // Type: integration | Priority: P0
    const governance: InterviewGovernance = {
      max_duration_seconds: 3600,
      require_consent: true,
      allowed_roles: ['lead_auditor', 'domain_auditor', 'admin'],
      retention_days: 365
    };

    expect(validateInterviewGovernance('lead_auditor', governance)).toBe(true);
    expect(validateInterviewGovernance('domain_auditor', governance)).toBe(true);
    expect(validateInterviewGovernance('admin', governance)).toBe(true);
    expect(validateInterviewGovernance('evidence_contributor', governance)).toBe(false);
    expect(validateInterviewGovernance('mps_auditor', governance)).toBe(false);
  });

  it('MAT-T-0078: Upload Failure and Retry', () => {
    // Architecture: §3.12 Path 11 — Upload Failure
    // FRS: FR-013
    // TRS: TR-013
    // Type: integration | Priority: P0
    const evidence = collectTextEvidence({
      criterion_id: 'crit-001',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'text',
      content_text: 'Evidence that failed to upload',
      uploaded_by: 'user-001'
    });

    const retried = retryFailedUpload(evidence, 0);
    expect(retried.sync_status).toBe('pending');
    expect(retried.metadata.retry_count).toBe(1);

    const retried2 = retryFailedUpload(evidence, 4);
    expect(retried2.metadata.retry_count).toBe(5);

    expect(() => retryFailedUpload(evidence, 5)).toThrow(
      'Maximum retry attempts (5) exceeded'
    );
  });
});
