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
