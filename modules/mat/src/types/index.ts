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
