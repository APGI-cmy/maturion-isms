/**
 * Core domain types for MAT module
 * Architecture: modules/mat/02-architecture/system-architecture.md
 */

// System Component Types
export interface SystemComponent {
  id: string;
  name: string;
  type: 'frontend' | 'backend' | 'database' | 'external' | 'worker';
  technology: string;
  description?: string;
}

// System Connection Types
export type ConnectionDirection = 'unidirectional' | 'bidirectional';

export interface SystemConnection {
  id: string;
  label: string;
  source: string;
  target: string;
  protocol: string;
  direction: ConnectionDirection;
  failure_isolation: boolean;
}

// Startup Dependency Types
export interface StartupDependency {
  component: string;
  depends_on: string[];
  order: number;
}

// RBAC Types
export type UserRole = 
  | 'admin' 
  | 'lead_auditor' 
  | 'domain_auditor' 
  | 'mps_auditor' 
  | 'evidence_contributor';

export interface Permission {
  action: string;
  resource: string;
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
  inherits?: UserRole[];
}

// RLS Policy Types
export interface RLSPolicy {
  table: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  policy_name: string;
  using_clause: string;
  with_check_clause?: string;
}

// Encryption Config Types
export interface EncryptionConfig {
  at_rest: {
    algorithm: string;
    key_size: number;
    enabled: boolean;
  };
  in_transit: {
    protocol: string;
    min_version: string;
    enabled: boolean;
  };
}

// Authentication Types
export interface AuthenticationConfig {
  mfa_required_roles: UserRole[];
}

// Input Validation Types
export interface InputValidationConfig {
  max_input_length: number;
  html_sanitization: boolean;
  xss_protection: boolean;
}

// Security Headers Types
export interface SecurityHeaders {
  'Content-Security-Policy': string;
  'X-Content-Type-Options': string;
  'X-Frame-Options': string;
  'X-XSS-Protection': string;
  'Strict-Transport-Security': string;
  'Referrer-Policy': string;
}

// CORS Config Types
export interface CORSConfig {
  allowed_origins: string[];
  allowed_methods: string[];
  allowed_headers: string[];
  max_age: number;
  credentials: boolean;
}

// Audit Types
export type AuditStatus = 
  | 'not_started' 
  | 'in_progress' 
  | 'under_review' 
  | 'completed' 
  | 'archived';

export interface Audit {
  id: string;
  title: string;
  org_name: string;
  org_id: string;
  facility: string;
  status: AuditStatus;
  audit_period_start: string;
  audit_period_end: string;
  lead_auditor_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_archived: boolean;
}

// Audit Status Transitions Map
export const AUDIT_STATUS_TRANSITIONS: Record<AuditStatus, AuditStatus[]> = {
  not_started: ['in_progress'],
  in_progress: ['under_review'],
  under_review: ['completed', 'in_progress'],
  completed: ['archived'],
  archived: []
};

// Audit Trail Types
export interface AuditTrailEntry {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  actor_id: string;
  changes: Record<string, unknown>;
  timestamp: string;
  is_immutable: boolean;
}

// Approval Types
export interface ApprovalRecord {
  approved: boolean;
  approved_by: string;
  approved_at: string;
}

// Auditor Assignment Types
export interface AuditorAssignment {
  auditor_id: string;
  target_type: 'domain' | 'mps';
  target_id: string;
  assigned_at: string;
}

// Approval Actions
export type ApprovalAction = 
  | 'approve_report' 
  | 'approve_criteria' 
  | 'confirm_score' 
  | 'assign_auditor';

// Criteria Management Types
export type CriterionStatus = 
  | 'not_started' 
  | 'in_progress' 
  | 'submitted' 
  | 'ai_scored' 
  | 'confirmed' 
  | 'not_used';

export interface Criterion {
  id: string;
  mps_id: string;
  number: string;
  title: string;
  description: string;
  status: CriterionStatus;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface ParsedCriterion {
  number: string;
  title: string;
  description: string;
  source_text: string;
}

export interface UploadResult {
  file_path: string;
  sha256_hash: string;
  file_size: number;
}

export interface ParseResult {
  criteria: ParsedCriterion[];
  coverage_ratio: number;
  hallucination_flags: HallucinationFlag[];
  is_valid: boolean;
}

export interface HallucinationFlag {
  criterion_number: string;
  issue: string;
}

export interface ValidationResult {
  valid: boolean;
  hallucinations: HallucinationFlag[];
}

export interface CoverageValidationResult {
  coverage_ratio: number;
  is_sufficient: boolean;
}

// Criterion Status Transitions Map
export const CRITERION_STATUS_TRANSITIONS: Record<CriterionStatus, CriterionStatus[]> = {
  not_started: ['in_progress', 'not_used'],
  in_progress: ['submitted', 'not_used'],
  submitted: ['ai_scored'],
  ai_scored: ['confirmed'],
  confirmed: [],
  not_used: []
};

// Evidence Types
export type EvidenceType = 'text' | 'voice' | 'photo' | 'document' | 'video';

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export type EvidenceStatus = 'pending_review' | 'accepted' | 'rejected';

export interface Evidence {
  id: string;
  criterion_id: string;
  audit_id: string;
  organisation_id: string;
  evidence_type: EvidenceType;
  content_text: string | null;
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  sha256_hash: string;
  storage_url: string | null;
  metadata: Record<string, unknown>;
  is_offline_captured: boolean;
  sync_status: SyncStatus;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  status: EvidenceStatus;
}

export interface EvidenceUploadParams {
  criterion_id: string;
  audit_id: string;
  organisation_id: string;
  evidence_type: EvidenceType;
  content_text?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  file_data?: string;
  metadata?: Record<string, unknown>;
  uploaded_by: string;
  is_offline_captured?: boolean;
}

export interface InterviewRecording {
  id: string;
  evidence_id: string;
  criterion_id: string | null;
  audit_id: string;
  recording_type: 'criterion' | 'audit';
  transcription: string | null;
  transcription_status: 'pending' | 'processing' | 'completed' | 'failed';
  duration_seconds: number;
  created_at: string;
}

export interface InterviewGovernance {
  max_duration_seconds: number;
  require_consent: boolean;
  allowed_roles: UserRole[];
  retention_days: number;
}

// Offline Sync Types
export interface OfflineEvidenceEntry {
  id: string;
  criterion_id: string;
  audit_id: string;
  organisation_id: string;
  evidence_type: EvidenceType;
  content_text: string | null;
  file_key: string | null;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  sha256_hash: string;
  metadata: Record<string, unknown>;
  sync_status: SyncStatus;
  retry_count: number;
  created_at: string;
  uploaded_by: string;
}

export interface MutationQueueEntry {
  id: string;
  timestamp: string;
  entity_type: string;
  entity_id: string;
  action: string;
  payload: Record<string, unknown>;
  sync_status: SyncStatus;
  retry_count: number;
}

export interface SyncLogEntry {
  id: string;
  timestamp: string;
  status: 'started' | 'completed' | 'partial' | 'failed';
  items_total: number;
  items_synced: number;
  items_failed: number;
  conflicts: number;
  duration_ms: number;
}

export interface SyncConflict {
  entity_type: string;
  entity_id: string;
  client_version: Record<string, unknown>;
  server_version: Record<string, unknown>;
  resolution: 'client_wins' | 'server_wins';
  resolved_at: string;
}

export interface PWAConfig {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: string;
  background_color: string;
  theme_color: string;
  icons: Array<{ src: string; sizes: string; type: string; purpose?: string }>;
  service_worker_path: string;
  offline_capable: boolean;
}

// AI Scoring Types
export type MaturityLevel = 1 | 2 | 3 | 4 | 5;

export interface AIScoreResult {
  criterion_id: string;
  maturity_level: MaturityLevel;
  confidence: number;
  rationale: string;
  evidence_citations: string[];
  model_version: string;
  scored_at: string;
}

export interface HumanScoreConfirmation {
  criterion_id: string;
  ai_score: AIScoreResult;
  confirmed_level: MaturityLevel;
  is_override: boolean;
  override_justification: string | null;
  confirmed_by: string;
  confirmed_at: string;
}

// Integration Types
export interface PITExportData {
  audit_id: string;
  organisation_id: string;
  exported_at: string;
  criteria_scores: Array<{
    criterion_id: string;
    criterion_number: string;
    maturity_level: MaturityLevel;
    confidence: number;
    evidence_count: number;
  }>;
  summary: {
    total_criteria: number;
    scored_criteria: number;
    average_maturity: number;
  };
}

export interface MaturityRoadmapExportData {
  audit_id: string;
  organisation_id: string;
  exported_at: string;
  gaps: Array<{
    criterion_id: string;
    criterion_number: string;
    current_level: MaturityLevel;
    target_level: MaturityLevel;
    gap_description: string;
    priority: 'immediate' | 'medium_term' | 'long_term';
  }>;
  recommendations: string[];
}

// Watchdog Types
export interface WatchdogMetrics {
  timestamp: string;
  ai_refusal_rate: number;
  ai_override_rate: number;
  sync_failure_rate: number;
  active_audits: number;
  evidence_count: number;
  avg_response_time_ms: number;
  error_rate: number;
}

export interface WatchdogThreshold {
  metric: keyof Omit<WatchdogMetrics, 'timestamp'>;
  warning_level: number;
  critical_level: number;
  alert_enabled: boolean;
}
