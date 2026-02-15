/**
 * Evidence Collection Service
 * Architecture: modules/mat/02-architecture/system-architecture.md §3.12 Path 3
 * Implements evidence upload, integrity verification, review, and interview recording
 */

import type {
  Evidence,
  EvidenceUploadParams,
  EvidenceType,
  EvidenceStatus,
  InterviewRecording,
  InterviewGovernance,
  UserRole
} from '../types/index.js';
import { sha256 } from '../utils/crypto.js';

/**
 * Maximum retry attempts for failed uploads
 */
const MAX_RETRY_ATTEMPTS = 5;

/**
 * Collects evidence with integrity verification
 * Architecture: §3.12 Path 3 — Evidence Collection
 * 
 * Creates evidence record with SHA-256 hash for integrity verification.
 * All evidence starts with status 'pending_review'.
 * File path follows convention: {org_id}/{audit_id}/{criterion_id}/{evidence_type}/{filename}
 * 
 * @param params - Evidence upload parameters
 * @returns Newly created evidence with generated ID, hash, and timestamps
 */
export function collectEvidence(params: EvidenceUploadParams): Evidence {
  const now = new Date().toISOString();
  
  // Compute SHA-256 hash based on evidence type
  const hashInput = params.content_text || params.file_data || '';
  const evidenceHash = sha256(hashInput);
  
  // Generate file path if file-based evidence
  let filePath: string | null = null;
  if (params.file_name) {
    filePath = `${params.organisation_id}/${params.audit_id}/${params.criterion_id}/${params.evidence_type}/${params.file_name}`;
  }
  
  return {
    id: generateUniqueId(),
    criterion_id: params.criterion_id,
    audit_id: params.audit_id,
    organisation_id: params.organisation_id,
    evidence_type: params.evidence_type,
    content_text: params.content_text || null,
    file_path: filePath,
    file_name: params.file_name || null,
    file_size: params.file_size || null,
    mime_type: params.mime_type || null,
    sha256_hash: evidenceHash,
    storage_url: null, // Set by storage service after upload
    metadata: params.metadata || {},
    is_offline_captured: params.is_offline_captured || false,
    sync_status: params.is_offline_captured ? 'pending' : 'synced',
    uploaded_by: params.uploaded_by,
    created_at: now,
    updated_at: now,
    deleted_at: null,
    status: 'pending_review'
  };
}

/**
 * Collects text or document evidence with content_text
 * Architecture: §3.12 Path 3
 * 
 * Specialized function for text-based evidence (notes, documents, text input).
 * Content is stored directly in content_text field.
 * 
 * @param params - Evidence upload parameters with content_text
 * @returns Created text evidence
 */
export function collectTextEvidence(params: EvidenceUploadParams): Evidence {
  if (!params.content_text) {
    throw new Error('content_text is required for text evidence');
  }
  
  return collectEvidence({
    ...params,
    evidence_type: 'text'
  });
}

/**
 * Collects voice recording evidence
 * Architecture: §3.12 Path 3
 * 
 * Creates voice evidence with transcription_status pending.
 * Actual transcription is handled by separate transcription service.
 * 
 * @param params - Evidence upload parameters with file data
 * @returns Created voice evidence
 */
export function collectVoiceEvidence(params: EvidenceUploadParams): Evidence {
  if (!params.file_data) {
    throw new Error('file_data is required for voice evidence');
  }
  
  return collectEvidence({
    ...params,
    evidence_type: 'voice',
    metadata: {
      ...params.metadata,
      transcription_status: 'pending'
    }
  });
}

/**
 * Collects photo evidence with metadata
 * Architecture: §3.12 Path 3
 * 
 * Creates photo evidence with optional metadata (geolocation, timestamp, device info).
 * 
 * @param params - Evidence upload parameters with file data and optional metadata
 * @returns Created photo evidence
 */
export function collectPhotoEvidence(params: EvidenceUploadParams): Evidence {
  if (!params.file_data) {
    throw new Error('file_data is required for photo evidence');
  }
  
  return collectEvidence({
    ...params,
    evidence_type: 'photo'
  });
}

/**
 * Collects video evidence
 * Architecture: §3.12 Path 3
 * 
 * Creates video evidence with optional metadata (duration, resolution, codec).
 * 
 * @param params - Evidence upload parameters with file data and optional metadata
 * @returns Created video evidence
 */
export function collectVideoEvidence(params: EvidenceUploadParams): Evidence {
  if (!params.file_data) {
    throw new Error('file_data is required for video evidence');
  }
  
  return collectEvidence({
    ...params,
    evidence_type: 'video'
  });
}

/**
 * Uploads multiple evidence items concurrently
 * Architecture: §3.12 Path 3
 * 
 * Processes multiple evidence uploads in batch.
 * Each item is processed independently with its own integrity hash.
 * 
 * @param items - Array of evidence upload parameters
 * @returns Array of created evidence records
 */
export function uploadConcurrently(items: EvidenceUploadParams[]): Evidence[] {
  return items.map(item => collectEvidence(item));
}

/**
 * Verifies evidence integrity using SHA-256 hash
 * Architecture: §3.12 Path 3
 * 
 * Validates that evidence has not been tampered with by comparing
 * stored hash against recomputed hash of original data.
 * 
 * @param evidence - Evidence record to verify
 * @param originalData - Original content or file data
 * @returns true if hash matches, false otherwise
 */
export function verifyEvidenceIntegrity(evidence: Evidence, originalData: string): boolean {
  const recomputedHash = sha256(originalData);
  return evidence.sha256_hash === recomputedHash;
}

/**
 * Reviews evidence and updates status
 * Architecture: §3.12 Path 3
 * 
 * Changes evidence status after review (accepted/rejected).
 * Evidence is append-only — status changes are recorded in audit trail.
 * 
 * @param evidence - Evidence to review
 * @param newStatus - New status (accepted/rejected)
 * @param reviewerId - ID of user performing review
 * @returns Updated evidence with new status
 */
export function reviewEvidence(
  evidence: Evidence,
  newStatus: EvidenceStatus,
  reviewerId: string
): Evidence {
  if (newStatus === 'pending_review') {
    throw new Error('Cannot transition back to pending_review');
  }
  
  return {
    ...evidence,
    status: newStatus,
    updated_at: new Date().toISOString(),
    metadata: {
      ...evidence.metadata,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString()
    }
  };
}

/**
 * Creates criterion-level interview recording
 * Architecture: §3.12 Path 3
 * 
 * Creates interview recording linked to specific criterion.
 * Transcription is processed asynchronously.
 * 
 * @param params - Interview recording parameters
 * @returns Created interview recording with pending transcription
 */
export function createInterviewRecording(params: {
  evidence_id: string;
  criterion_id: string;
  audit_id: string;
  duration_seconds: number;
}): InterviewRecording {
  return {
    id: generateUniqueId(),
    evidence_id: params.evidence_id,
    criterion_id: params.criterion_id,
    audit_id: params.audit_id,
    recording_type: 'criterion',
    transcription: null,
    transcription_status: 'pending',
    duration_seconds: params.duration_seconds,
    created_at: new Date().toISOString()
  };
}

/**
 * Creates audit-level interview recording
 * Architecture: §3.12 Path 3
 * 
 * Creates interview recording for general audit conversation (not linked to specific criterion).
 * criterion_id is null for audit-level interviews.
 * 
 * @param params - Interview recording parameters without criterion_id
 * @returns Created audit-level interview recording
 */
export function createAuditLevelInterview(params: {
  evidence_id: string;
  audit_id: string;
  duration_seconds: number;
}): InterviewRecording {
  return {
    id: generateUniqueId(),
    evidence_id: params.evidence_id,
    criterion_id: null,
    audit_id: params.audit_id,
    recording_type: 'audit',
    transcription: null,
    transcription_status: 'pending',
    duration_seconds: params.duration_seconds,
    created_at: new Date().toISOString()
  };
}

/**
 * Validates interview governance compliance
 * Architecture: §3.12 Path 3
 * 
 * Checks if user role is allowed to create interview recordings
 * according to governance policy.
 * 
 * @param role - User role to validate
 * @param governance - Interview governance policy
 * @returns true if role is allowed, false otherwise
 */
export function validateInterviewGovernance(
  role: UserRole,
  governance: InterviewGovernance
): boolean {
  return governance.allowed_roles.indexOf(role) !== -1;
}

/**
 * Retries failed evidence upload
 * Architecture: §3.12 Path 3
 * 
 * Attempts to retry a failed evidence upload.
 * Increments retry count and throws error after max attempts.
 * 
 * @param evidence - Evidence with failed upload
 * @param retryCount - Current retry count
 * @returns Updated evidence with incremented retry count
 * @throws Error if retry count exceeds maximum attempts
 */
export function retryFailedUpload(evidence: Evidence, retryCount: number): Evidence {
  if (retryCount >= MAX_RETRY_ATTEMPTS) {
    throw new Error(
      `Maximum retry attempts (${MAX_RETRY_ATTEMPTS}) exceeded for evidence ${evidence.id}`
    );
  }
  
  return {
    ...evidence,
    sync_status: 'pending',
    updated_at: new Date().toISOString(),
    metadata: {
      ...evidence.metadata,
      retry_count: retryCount + 1,
      last_retry_at: new Date().toISOString()
    }
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
