/**
 * Security, RBAC, RLS, and Authentication Service
 * Architecture: modules/mat/02-architecture/security-architecture.md
 */

import type {
  UserRole,
  Permission,
  RolePermissions,
  RLSPolicy,
  EncryptionConfig,
  AuthenticationConfig,
  InputValidationConfig,
  SecurityHeaders,
  CORSConfig
} from '../types/index.js';

/**
 * Role-based permissions as defined in architecture
 */
export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'admin',
    permissions: [
      { action: '*', resource: '*' }
    ],
    inherits: ['lead_auditor', 'domain_auditor', 'mps_auditor', 'evidence_contributor']
  },
  {
    role: 'lead_auditor',
    permissions: [
      { action: 'create', resource: 'audit' },
      { action: 'read', resource: 'audit' },
      { action: 'update', resource: 'audit' },
      { action: 'delete', resource: 'audit' },
      { action: 'approve', resource: 'criterion' },
      { action: 'approve', resource: 'report' },
      { action: 'assign', resource: 'auditor' },
      { action: 'read', resource: '*' }
    ],
    inherits: ['domain_auditor', 'mps_auditor', 'evidence_contributor']
  },
  {
    role: 'domain_auditor',
    permissions: [
      { action: 'read', resource: 'audit' },
      { action: 'read', resource: 'domain' },
      { action: 'update', resource: 'domain' },
      { action: 'update', resource: 'criterion' },
      { action: 'create', resource: 'evidence' },
      { action: 'read', resource: 'evidence' },
      { action: 'read', resource: 'scoring' },
      { action: 'confirm', resource: 'scoring' }
    ],
    inherits: ['mps_auditor', 'evidence_contributor']
  },
  {
    role: 'mps_auditor',
    permissions: [
      { action: 'read', resource: 'audit' },
      { action: 'read', resource: 'domain' },
      { action: 'read', resource: 'mps' },
      { action: 'read', resource: 'criterion' },
      { action: 'update', resource: 'criterion' },
      { action: 'create', resource: 'evidence' },
      { action: 'read', resource: 'evidence' },
      { action: 'read', resource: 'scoring' },
      { action: 'read', resource: 'dashboard' }
    ],
    inherits: ['evidence_contributor']
  },
  {
    role: 'evidence_contributor',
    permissions: [
      { action: 'read', resource: 'audit' },
      { action: 'read', resource: 'criterion' },
      { action: 'create', resource: 'evidence' },
      { action: 'read', resource: 'evidence' }
    ]
  }
];

/**
 * RLS policies for all tables
 */
export const RLS_POLICIES: RLSPolicy[] = [
  // Audits table
  {
    table: 'audits',
    operation: 'SELECT',
    policy_name: 'audits_org_isolation_select',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'audits',
    operation: 'INSERT',
    policy_name: 'audits_org_isolation_insert',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid',
    with_check_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'audits',
    operation: 'UPDATE',
    policy_name: 'audits_org_isolation_update',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid',
    with_check_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'audits',
    operation: 'DELETE',
    policy_name: 'audits_org_isolation_delete',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  // Domains table
  {
    table: 'domains',
    operation: 'SELECT',
    policy_name: 'domains_org_isolation_select',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'domains',
    operation: 'INSERT',
    policy_name: 'domains_org_isolation_insert',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid',
    with_check_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'domains',
    operation: 'UPDATE',
    policy_name: 'domains_org_isolation_update',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid',
    with_check_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'domains',
    operation: 'DELETE',
    policy_name: 'domains_org_isolation_delete',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  // MPS table
  {
    table: 'mps',
    operation: 'SELECT',
    policy_name: 'mps_org_isolation_select',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'mps',
    operation: 'INSERT',
    policy_name: 'mps_org_isolation_insert',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid',
    with_check_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'mps',
    operation: 'UPDATE',
    policy_name: 'mps_org_isolation_update',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid',
    with_check_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'mps',
    operation: 'DELETE',
    policy_name: 'mps_org_isolation_delete',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  // Criteria table
  {
    table: 'criteria',
    operation: 'SELECT',
    policy_name: 'criteria_org_isolation_select',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'criteria',
    operation: 'INSERT',
    policy_name: 'criteria_org_isolation_insert',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid',
    with_check_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'criteria',
    operation: 'UPDATE',
    policy_name: 'criteria_org_isolation_update',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid',
    with_check_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'criteria',
    operation: 'DELETE',
    policy_name: 'criteria_org_isolation_delete',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  // Evidence table
  {
    table: 'evidence',
    operation: 'SELECT',
    policy_name: 'evidence_org_isolation_select',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'evidence',
    operation: 'INSERT',
    policy_name: 'evidence_org_isolation_insert',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid',
    with_check_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'evidence',
    operation: 'UPDATE',
    policy_name: 'evidence_org_isolation_update',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid',
    with_check_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'evidence',
    operation: 'DELETE',
    policy_name: 'evidence_org_isolation_delete',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  // Scoring Results table
  {
    table: 'scoring_results',
    operation: 'SELECT',
    policy_name: 'scoring_results_org_isolation_select',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'scoring_results',
    operation: 'INSERT',
    policy_name: 'scoring_results_org_isolation_insert',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid',
    with_check_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'scoring_results',
    operation: 'UPDATE',
    policy_name: 'scoring_results_org_isolation_update',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid',
    with_check_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'scoring_results',
    operation: 'DELETE',
    policy_name: 'scoring_results_org_isolation_delete',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  // Reports table
  {
    table: 'reports',
    operation: 'SELECT',
    policy_name: 'reports_org_isolation_select',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'reports',
    operation: 'INSERT',
    policy_name: 'reports_org_isolation_insert',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid',
    with_check_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'reports',
    operation: 'UPDATE',
    policy_name: 'reports_org_isolation_update',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid',
    with_check_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'reports',
    operation: 'DELETE',
    policy_name: 'reports_org_isolation_delete',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  // Audit Trail table (append-only)
  {
    table: 'audit_trail',
    operation: 'SELECT',
    policy_name: 'audit_trail_org_isolation_select',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  },
  {
    table: 'audit_trail',
    operation: 'INSERT',
    policy_name: 'audit_trail_org_isolation_insert',
    using_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid',
    with_check_clause: 'organisation_id = current_setting(\'app.current_org_id\')::uuid'
  }
  // NOTE: No UPDATE or DELETE policies for audit_trail (append-only)
];

/**
 * Encryption configuration
 */
export const ENCRYPTION_CONFIG: EncryptionConfig = {
  at_rest: {
    algorithm: 'AES-256-GCM',
    key_size: 256,
    enabled: true
  },
  in_transit: {
    protocol: 'TLS',
    min_version: '1.2',
    enabled: true
  }
};

/**
 * Authentication configuration
 */
export const AUTHENTICATION_CONFIG: AuthenticationConfig = {
  mfa_required_roles: ['lead_auditor', 'admin']
};

/**
 * Input validation configuration
 */
export const INPUT_VALIDATION_CONFIG: InputValidationConfig = {
  max_input_length: 10000,
  html_sanitization: true,
  xss_protection: true
};

/**
 * Security headers configuration
 */
export const SECURITY_HEADERS: SecurityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

/**
 * CORS configuration
 */
export const CORS_CONFIG: CORSConfig = {
  allowed_origins: ['https://mat.maturion.com'],
  allowed_methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowed_headers: ['Authorization', 'Content-Type', 'X-Request-ID'],
  max_age: 86400,
  credentials: true
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, action: string, resource: string): boolean {
  const rolePerms = ROLE_PERMISSIONS.find(rp => rp.role === role);
  if (!rolePerms) {
    return false;
  }

  // Check direct permissions
  const hasDirectPermission = rolePerms.permissions.some(
    p => (p.action === '*' || p.action === action) && (p.resource === '*' || p.resource === resource)
  );

  if (hasDirectPermission) {
    return true;
  }

  // Check inherited permissions
  if (rolePerms.inherits) {
    for (const inheritedRole of rolePerms.inherits) {
      if (hasPermission(inheritedRole, action, resource)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Get all permissions for a role (including inherited)
 */
export function getAllPermissions(role: UserRole): Permission[] {
  const rolePerms = ROLE_PERMISSIONS.find(rp => rp.role === role);
  if (!rolePerms) {
    return [];
  }

  const allPermissions: Permission[] = [...rolePerms.permissions];

  // Add inherited permissions
  if (rolePerms.inherits) {
    for (const inheritedRole of rolePerms.inherits) {
      allPermissions.push(...getAllPermissions(inheritedRole));
    }
  }

  // Remove duplicates
  return Array.from(
    new Map(allPermissions.map(p => [`${p.action}:${p.resource}`, p])).values()
  );
}

/**
 * Validate RBAC enforcement
 */
export function validateRBACEnforcement(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate that all roles are defined
  const expectedRoles: UserRole[] = ['admin', 'lead_auditor', 'domain_auditor', 'mps_auditor', 'evidence_contributor'];
  for (const role of expectedRoles) {
    const rolePerms = ROLE_PERMISSIONS.find(rp => rp.role === role);
    if (!rolePerms) {
      errors.push(`Role '${role}' not defined`);
    }
  }

  // Validate that admin has wildcard access
  if (!hasPermission('admin', 'any_action', 'any_resource')) {
    errors.push('Admin role does not have wildcard access');
  }

  // Validate lead_auditor permissions
  if (!hasPermission('lead_auditor', 'create', 'audit')) {
    errors.push('lead_auditor cannot create audit');
  }
  if (!hasPermission('lead_auditor', 'approve', 'report')) {
    errors.push('lead_auditor cannot approve report');
  }

  // Validate domain_auditor permissions
  if (!hasPermission('domain_auditor', 'update', 'domain')) {
    errors.push('domain_auditor cannot update domain');
  }
  if (!hasPermission('domain_auditor', 'create', 'evidence')) {
    errors.push('domain_auditor cannot create evidence');
  }

  // Validate mps_auditor permissions
  if (!hasPermission('mps_auditor', 'read', 'mps')) {
    errors.push('mps_auditor cannot read mps');
  }
  if (!hasPermission('mps_auditor', 'read', 'dashboard')) {
    errors.push('mps_auditor cannot read dashboard');
  }

  // Validate evidence_contributor permissions
  if (!hasPermission('evidence_contributor', 'create', 'evidence')) {
    errors.push('evidence_contributor cannot create evidence');
  }
  if (!hasPermission('evidence_contributor', 'read', 'audit')) {
    errors.push('evidence_contributor cannot read audit');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate permission inheritance
 */
export function validatePermissionInheritance(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Admin inherits from lead_auditor
  if (!hasPermission('admin', 'create', 'audit')) {
    errors.push('admin does not inherit lead_auditor permissions');
  }

  // lead_auditor inherits from domain_auditor
  if (!hasPermission('lead_auditor', 'update', 'domain')) {
    errors.push('lead_auditor does not inherit domain_auditor permissions');
  }

  // domain_auditor inherits from mps_auditor
  if (!hasPermission('domain_auditor', 'read', 'mps')) {
    errors.push('domain_auditor does not inherit mps_auditor permissions');
  }

  // mps_auditor inherits from evidence_contributor
  if (!hasPermission('mps_auditor', 'create', 'evidence')) {
    errors.push('mps_auditor does not inherit evidence_contributor permissions');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate authentication flow
 */
export function validateAuthenticationFlow(email: string, password: string): { authenticated: boolean; error?: string } {
  // Mock authentication logic
  if (!email || !password) {
    return { authenticated: false, error: 'Email and password required' };
  }

  // Simple validation (in real implementation, would check against database)
  if (email.includes('@') && password.length >= 8) {
    return { authenticated: true };
  }

  return { authenticated: false, error: 'Invalid credentials' };
}

/**
 * Validate MFA enforcement
 */
export function validateMFAEnforcement(role: UserRole): { mfa_required: boolean } {
  return {
    mfa_required: AUTHENTICATION_CONFIG.mfa_required_roles.includes(role)
  };
}

/**
 * Validate RLS policies
 */
export function validateRLSPolicies(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const requiredTables = ['audits', 'domains', 'mps', 'criteria', 'evidence', 'scoring_results', 'reports', 'audit_trail'];
  const requiredOperations = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];

  for (const table of requiredTables) {
    const tablePolicies = RLS_POLICIES.filter(p => p.table === table);

    if (tablePolicies.length === 0) {
      errors.push(`Table '${table}' has no RLS policies`);
      continue;
    }

    // Check for org isolation
    const hasOrgIsolation = tablePolicies.every(p =>
      p.using_clause.includes('organisation_id') && p.using_clause.includes('current_setting')
    );

    if (!hasOrgIsolation) {
      errors.push(`Table '${table}' does not have proper org isolation`);
    }

    // Special case: audit_trail should not have UPDATE or DELETE
    if (table === 'audit_trail') {
      const hasUpdate = tablePolicies.some(p => p.operation === 'UPDATE');
      const hasDelete = tablePolicies.some(p => p.operation === 'DELETE');
      if (hasUpdate || hasDelete) {
        errors.push(`Table 'audit_trail' should not have UPDATE or DELETE policies (append-only)`);
      }
    } else {
      // Other tables should have all CRUD operations
      for (const op of requiredOperations) {
        const hasPolicy = tablePolicies.some(p => p.operation === op);
        if (!hasPolicy) {
          errors.push(`Table '${table}' missing ${op} policy`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate audit trail immutability
 */
export function validateAuditTrailImmutability(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const auditTrailPolicies = RLS_POLICIES.filter(p => p.table === 'audit_trail');

  // Check that audit_trail has no UPDATE or DELETE policies
  const hasUpdate = auditTrailPolicies.some(p => p.operation === 'UPDATE');
  const hasDelete = auditTrailPolicies.some(p => p.operation === 'DELETE');

  if (hasUpdate) {
    errors.push('audit_trail has UPDATE policy - violates immutability');
  }

  if (hasDelete) {
    errors.push('audit_trail has DELETE policy - violates immutability');
  }

  // Check that it has SELECT and INSERT
  const hasSelect = auditTrailPolicies.some(p => p.operation === 'SELECT');
  const hasInsert = auditTrailPolicies.some(p => p.operation === 'INSERT');

  if (!hasSelect) {
    errors.push('audit_trail missing SELECT policy');
  }

  if (!hasInsert) {
    errors.push('audit_trail missing INSERT policy');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate data encryption configuration
 */
export function validateDataEncryption(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate at-rest encryption
  if (ENCRYPTION_CONFIG.at_rest.algorithm !== 'AES-256-GCM') {
    errors.push(`Invalid at-rest encryption algorithm: expected 'AES-256-GCM', got '${ENCRYPTION_CONFIG.at_rest.algorithm}'`);
  }

  if (ENCRYPTION_CONFIG.at_rest.key_size !== 256) {
    errors.push(`Invalid at-rest key size: expected 256, got ${ENCRYPTION_CONFIG.at_rest.key_size}`);
  }

  if (!ENCRYPTION_CONFIG.at_rest.enabled) {
    errors.push('At-rest encryption not enabled');
  }

  // Validate in-transit encryption
  if (ENCRYPTION_CONFIG.in_transit.protocol !== 'TLS') {
    errors.push(`Invalid in-transit protocol: expected 'TLS', got '${ENCRYPTION_CONFIG.in_transit.protocol}'`);
  }

  if (ENCRYPTION_CONFIG.in_transit.min_version !== '1.2' && ENCRYPTION_CONFIG.in_transit.min_version !== '1.3') {
    errors.push(`Invalid TLS version: expected '1.2' or higher, got '${ENCRYPTION_CONFIG.in_transit.min_version}'`);
  }

  if (!ENCRYPTION_CONFIG.in_transit.enabled) {
    errors.push('In-transit encryption not enabled');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate input validation and sanitization
 */
export function validateInputValidation(input: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check length
  if (input.length > INPUT_VALIDATION_CONFIG.max_input_length) {
    errors.push(`Input exceeds max length of ${INPUT_VALIDATION_CONFIG.max_input_length}`);
  }

  // Check for XSS patterns (basic check)
  if (INPUT_VALIDATION_CONFIG.xss_protection) {
    const xssPatterns = [/<script/i, /javascript:/i, /onerror=/i, /onclick=/i];
    for (const pattern of xssPatterns) {
      if (pattern.test(input)) {
        errors.push('Input contains potential XSS patterns');
        break;
      }
    }
  }

  // Check HTML sanitization is enabled
  if (!INPUT_VALIDATION_CONFIG.html_sanitization) {
    errors.push('HTML sanitization not enabled');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Sanitize HTML input
 */
export function sanitizeHTML(input: string): string {
  if (!INPUT_VALIDATION_CONFIG.html_sanitization) {
    return input;
  }

  // Basic HTML sanitization (replace dangerous characters)
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate API security headers
 */
export function validateSecurityHeaders(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const requiredHeaders = [
    'Content-Security-Policy',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
    'Strict-Transport-Security',
    'Referrer-Policy'
  ];

  for (const header of requiredHeaders) {
    if (!SECURITY_HEADERS[header as keyof SecurityHeaders]) {
      errors.push(`Missing security header: ${header}`);
    }
  }

  // Validate specific header values
  if (SECURITY_HEADERS['X-Content-Type-Options'] !== 'nosniff') {
    errors.push('X-Content-Type-Options should be "nosniff"');
  }

  if (SECURITY_HEADERS['X-Frame-Options'] !== 'DENY') {
    errors.push('X-Frame-Options should be "DENY"');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate CORS configuration
 */
export function validateCORS(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate allowed origins - check for exact match to prevent URL substring attacks
  const hasCorrectOrigin = CORS_CONFIG.allowed_origins.some(
    origin => origin === 'https://mat.maturion.com'
  );
  if (!hasCorrectOrigin) {
    errors.push('CORS allowed_origins missing https://mat.maturion.com');
  }

  // Validate allowed methods
  const requiredMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  for (const method of requiredMethods) {
    if (!CORS_CONFIG.allowed_methods.includes(method)) {
      errors.push(`CORS allowed_methods missing ${method}`);
    }
  }

  // Validate allowed headers
  const requiredHeaders = ['Authorization', 'Content-Type', 'X-Request-ID'];
  for (const header of requiredHeaders) {
    if (!CORS_CONFIG.allowed_headers.includes(header)) {
      errors.push(`CORS allowed_headers missing ${header}`);
    }
  }

  // Validate max_age
  if (CORS_CONFIG.max_age !== 86400) {
    errors.push(`CORS max_age should be 86400, got ${CORS_CONFIG.max_age}`);
  }

  // Validate credentials
  if (!CORS_CONFIG.credentials) {
    errors.push('CORS credentials should be enabled');
  }

  return { valid: errors.length === 0, errors };
}
