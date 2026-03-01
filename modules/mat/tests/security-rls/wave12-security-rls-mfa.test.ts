/**
 * Wave 12 QA Validation — Security: RLS Cross-Org + MFA Enforcement
 *
 * Test IDs: T-W12-QAV-6, T-W12-QAV-7
 * Task: 12.1 — Full Functionality & Build Wiring Verification (MAT module)
 * Gap Reference: W12-GAP-001
 *
 * Covers:
 *   T-W12-QAV-6  RLS cross-org MAT API security — JWT for org-A cannot retrieve org-B MAT audit records
 *   T-W12-QAV-7  MFA enforcement (FR-031) — privileged operations require MFA; mfa_enabled flag verified in session
 *
 * References: FR-031 | FR-049 | TR-022 | TR-023 | GRS-008 | Wave 12 Task 12.1 W12-GAP-001
 * Forbidden: ❌ expect(true).toBe(true) stubs | ❌ RLS mock that always returns empty (must simulate actual RLS filter logic)
 */
import { describe, it, expect } from 'vitest';
import {
  validateMFAEnforcement,
  validateRLSPolicies,
  RLS_POLICIES,
  AUTHENTICATION_CONFIG,
} from '../../src/services/security-rls.js';
import type { UserRole } from '../../src/types/index.js';

// ---------------------------------------------------------------------------
// Supabase JWT-scoped client stub
//
// Simulates actual RLS filter logic: the `currentOrgId` acts as the decoded
// JWT `organisation_id` claim. Only rows where `organisation_id === currentOrgId`
// are returned. This is the application-layer equivalent of Supabase's
// `organisation_id = current_setting('app.current_org_id')::uuid` policy.
// ---------------------------------------------------------------------------

interface AuditRecord {
  id: string;
  organisation_id: string;
  title: string;
  status: 'active' | 'completed' | 'draft';
  created_at: string;
}

/**
 * Build a JWT-scoped Supabase-like client that simulates RLS org filtering.
 * `currentOrgId` is the organisation claim from the bearer JWT.
 *
 * The client stores records in a shared `rows` array (like a DB table) and
 * enforces RLS by filtering on `organisation_id === currentOrgId` at query
 * time — matching the Supabase `organisation_id = current_setting(...)` policy.
 */
function makeJwtScopedAuditClient(rows: AuditRecord[], currentOrgId: string) {
  return {
    currentOrgId,
    rows,
    from: (table: string) => {
      if (table !== 'audits') {
        throw new Error(`Unexpected table: ${table}`);
      }
      return {
        insert: (data: AuditRecord) => {
          rows.push(data);
          return Promise.resolve({ error: null });
        },
        select: (_cols: string = '*') => ({
          eq: (col: string, val: unknown) => ({
            // Apply RLS: only return rows matching both the caller's org AND the query filter
            order: (_col2: string, _opts?: unknown) =>
              Promise.resolve({
                // RLS simulation: organisation_id = current_setting('app.current_org_id')
                data: rows.filter(r =>
                  r.organisation_id === currentOrgId && // <— RLS policy simulation
                  r[col as keyof AuditRecord] === val,
                ),
                error: null,
              }),
          }),
          order: (_col2: string, _opts?: unknown) =>
            Promise.resolve({
              // RLS simulation for org-only queries
              data: rows.filter(r => r.organisation_id === currentOrgId),
              error: null,
            }),
        }),
      };
    },
  };
}

/**
 * Simulate inserting an audit record directly (bypassing RLS — like service role).
 * This represents records that already exist in the DB.
 */
function insertAuditDirect(rows: AuditRecord[], record: AuditRecord): void {
  rows.push(record);
}

// ---------------------------------------------------------------------------
// T-W12-QAV-6: RLS cross-org MAT API security
// ---------------------------------------------------------------------------

describe('T-W12-QAV-6: RLS cross-org MAT API security — JWT org-A cannot retrieve org-B audit records', () => {
  it('T-W12-QAV-6a: RLS policy structure enforces organisation_id scoping on all MAT audit tables', () => {
    // Architecture: security-architecture.md §RLS | FR-049 | Wave 12 W12-GAP-001
    // Type: security | Priority: P0
    // Acceptance: All critical tables have RLS policies with organisation_id filtering

    const auditTablesRequiringRLS = ['audits', 'domains', 'mps', 'criteria', 'evidence', 'scoring_results'];

    for (const table of auditTablesRequiringRLS) {
      const tablePolicies = RLS_POLICIES.filter(p => p.table === table);

      // Every critical table must have at least one RLS policy
      expect(tablePolicies.length).toBeGreaterThan(0);

      // Every policy must include organisation_id in its USING clause (not just some)
      const allPoliciesHaveOrgScope = tablePolicies.every(p =>
        p.using_clause.includes('organisation_id'),
      );
      expect(allPoliciesHaveOrgScope).toBe(true);

      // RLS must use Supabase current_setting() for JWT-derived org scope
      const allPoliciesUseCurrentSetting = tablePolicies.every(p =>
        p.using_clause.includes('current_setting'),
      );
      expect(allPoliciesUseCurrentSetting).toBe(true);
    }

    // validateRLSPolicies() confirms full policy integrity
    const validationResult = validateRLSPolicies();
    expect(validationResult.valid).toBe(true);
    expect(validationResult.errors).toEqual([]);
  });

  it('T-W12-QAV-6b: JWT for org-A cannot retrieve org-B MAT audit records via RLS-simulated client', async () => {
    // Architecture: security-architecture.md §RLS | GRS-008 | Wave 12 W12-GAP-001
    // Type: security | Priority: P0
    // Acceptance: org-A JWT cannot see org-B audit records — RLS filter logic simulated

    // Shared "database" rows (mimics Supabase table state)
    const dbRows: AuditRecord[] = [];

    // Directly insert records for org-A and org-B (simulating pre-existing DB state)
    insertAuditDirect(dbRows, {
      id: 'audit-001',
      organisation_id: 'org-A',
      title: 'Org A ISMS Audit 2026',
      status: 'active',
      created_at: new Date().toISOString(),
    });

    insertAuditDirect(dbRows, {
      id: 'audit-002',
      organisation_id: 'org-A',
      title: 'Org A Gap Analysis',
      status: 'completed',
      created_at: new Date().toISOString(),
    });

    insertAuditDirect(dbRows, {
      id: 'audit-003',
      organisation_id: 'org-B',
      title: 'Org B Confidential Audit',
      status: 'active',
      created_at: new Date().toISOString(),
    });

    // Client scoped to org-A JWT claim
    const orgAClient = makeJwtScopedAuditClient(dbRows, 'org-A');

    // Retrieve all audits through org-A scoped client (RLS applied)
    const orgAResult = await orgAClient
      .from('audits')
      .select('*')
      .order('created_at', { ascending: false });

    // org-A can see its own 2 records
    expect(orgAResult.data).toHaveLength(2);
    expect(orgAResult.data!.every(r => r.organisation_id === 'org-A')).toBe(true);

    // org-A CANNOT see org-B's records — RLS blocked them
    const orgBRecordInOrgAResult = orgAResult.data!.find(r => r.organisation_id === 'org-B');
    expect(orgBRecordInOrgAResult).toBeUndefined();

    // Client scoped to org-B JWT claim
    const orgBClient = makeJwtScopedAuditClient(dbRows, 'org-B');

    const orgBResult = await orgBClient
      .from('audits')
      .select('*')
      .order('created_at', { ascending: false });

    // org-B sees only its own 1 record
    expect(orgBResult.data).toHaveLength(1);
    expect(orgBResult.data![0]!.organisation_id).toBe('org-B');
    expect(orgBResult.data![0]!.title).toBe('Org B Confidential Audit');

    // org-B CANNOT see org-A's records
    const orgARecordInOrgBResult = orgBResult.data!.find(r => r.organisation_id === 'org-A');
    expect(orgARecordInOrgBResult).toBeUndefined();
  });

  it('T-W12-QAV-6c: audit_trail table has append-only RLS (no UPDATE or DELETE policies)', () => {
    // Architecture: security-architecture.md §AuditTrail | FR-049
    // Type: security | Priority: P0
    // Acceptance: audit_trail has no UPDATE or DELETE RLS policies (immutability invariant)

    const auditTrailPolicies = RLS_POLICIES.filter(p => p.table === 'audit_trail');
    expect(auditTrailPolicies.length).toBeGreaterThan(0);

    // audit_trail must NOT have UPDATE or DELETE policies
    const hasUpdatePolicy = auditTrailPolicies.some(p => p.operation === 'UPDATE');
    const hasDeletePolicy = auditTrailPolicies.some(p => p.operation === 'DELETE');

    expect(hasUpdatePolicy).toBe(false);
    expect(hasDeletePolicy).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// T-W12-QAV-7: MFA enforcement (FR-031)
// ---------------------------------------------------------------------------

/**
 * Simulated user session with mfa_enabled flag.
 * In production this comes from Supabase auth.users.raw_user_meta_data or
 * custom_access_token_hook. Here we use a typed stub.
 */
interface UserSession {
  userId: string;
  organisationId: string;
  role: UserRole;
  mfa_enabled: boolean;
  email: string;
}

/**
 * Supabase auth stub — simulates session retrieval with MFA flag.
 * Models the Supabase `getSession()` response shape relevant to MFA enforcement.
 */
function makeAuthStub(session: UserSession | null) {
  return {
    auth: {
      getSession: () =>
        Promise.resolve({
          data: {
            session: session
              ? {
                  user: {
                    id: session.userId,
                    email: session.email,
                    user_metadata: {
                      role: session.role,
                      organisation_id: session.organisationId,
                    },
                    factors: session.mfa_enabled
                      ? [{ factor_type: 'totp', status: 'verified' }]
                      : [],
                  },
                }
              : null,
          },
          error: null,
        }),
    },
  };
}

/**
 * Check if a session satisfies MFA requirement for a privileged operation.
 * Returns true if the user's role requires MFA AND the session has MFA verified.
 */
function isMFACompliant(session: UserSession): boolean {
  const { mfa_required } = validateMFAEnforcement(session.role);
  if (!mfa_required) {
    return true; // Non-privileged role — MFA not required
  }
  return session.mfa_enabled; // Privileged role — must have MFA enabled
}

describe('T-W12-QAV-7: MFA enforcement FR-031 — privileged operations require MFA; mfa_enabled verified in session', () => {
  it('T-W12-QAV-7a: AUTHENTICATION_CONFIG defines MFA-required roles — lead_auditor and admin', () => {
    // Architecture: security-architecture.md §MFA | FR-031 | TR-022 | Wave 12 W12-GAP-001
    // Type: security | Priority: P0
    // Acceptance: privileged roles are configured to require MFA

    expect(AUTHENTICATION_CONFIG.mfa_required_roles).toContain('lead_auditor');
    expect(AUTHENTICATION_CONFIG.mfa_required_roles).toContain('admin');

    // Non-privileged roles must NOT be in MFA-required list
    expect(AUTHENTICATION_CONFIG.mfa_required_roles).not.toContain('domain_auditor');
    expect(AUTHENTICATION_CONFIG.mfa_required_roles).not.toContain('mps_auditor');
    expect(AUTHENTICATION_CONFIG.mfa_required_roles).not.toContain('evidence_contributor');
  });

  it('T-W12-QAV-7b: validateMFAEnforcement() returns mfa_required: true for privileged roles', () => {
    // FR-031 | TR-022
    // Privileged roles must require MFA
    const leadAuditorResult = validateMFAEnforcement('lead_auditor');
    expect(leadAuditorResult.mfa_required).toBe(true);

    const adminResult = validateMFAEnforcement('admin');
    expect(adminResult.mfa_required).toBe(true);
  });

  it('T-W12-QAV-7c: validateMFAEnforcement() returns mfa_required: false for non-privileged roles', () => {
    // FR-031 | TR-022
    const domainAuditorResult = validateMFAEnforcement('domain_auditor');
    expect(domainAuditorResult.mfa_required).toBe(false);

    const mpsAuditorResult = validateMFAEnforcement('mps_auditor');
    expect(mpsAuditorResult.mfa_required).toBe(false);

    const evidenceContributorResult = validateMFAEnforcement('evidence_contributor');
    expect(evidenceContributorResult.mfa_required).toBe(false);
  });

  it('T-W12-QAV-7d: mfa_enabled: true in session — privileged user passes MFA compliance check', async () => {
    // FR-031 | Wave 12 W12-GAP-001
    // Type: security | Priority: P0
    // Acceptance: session with mfa_enabled: true satisfies MFA requirement for privileged role

    const session: UserSession = {
      userId: 'user-lead-001',
      organisationId: 'org-secure',
      role: 'lead_auditor',
      mfa_enabled: true,
      email: 'lead@example.com',
    };

    const authStub = makeAuthStub(session);
    const { data } = await authStub.auth.getSession();

    // Verify Supabase auth stub returns session with MFA factors
    expect(data.session).not.toBeNull();
    expect(data.session!.user.factors).toHaveLength(1);
    expect(data.session!.user.factors[0]!.factor_type).toBe('totp');
    expect(data.session!.user.factors[0]!.status).toBe('verified');

    // Verify MFA compliance check passes
    expect(isMFACompliant(session)).toBe(true);
  });

  it('T-W12-QAV-7e: mfa_enabled: false in session — privileged user FAILS MFA compliance check', async () => {
    // FR-031 | Wave 12 W12-GAP-001
    // Type: security | Priority: P0
    // Acceptance: privileged role with mfa_enabled: false must NOT be MFA compliant

    const session: UserSession = {
      userId: 'user-admin-001',
      organisationId: 'org-secure',
      role: 'admin',
      mfa_enabled: false,
      email: 'admin@example.com',
    };

    const authStub = makeAuthStub(session);
    const { data } = await authStub.auth.getSession();

    // Verify Supabase auth stub returns session with no MFA factors
    expect(data.session).not.toBeNull();
    expect(data.session!.user.factors).toHaveLength(0);

    // Verify MFA compliance check fails (privileged role without MFA)
    expect(isMFACompliant(session)).toBe(false);
  });

  it('T-W12-QAV-7f: non-privileged role with mfa_enabled: false — MFA compliance check passes (MFA not required)', () => {
    // FR-031 — non-privileged roles are MFA-compliant regardless of mfa_enabled flag
    const session: UserSession = {
      userId: 'user-evidence-001',
      organisationId: 'org-secure',
      role: 'evidence_contributor',
      mfa_enabled: false,
      email: 'contributor@example.com',
    };

    // Non-privileged role does not require MFA — compliance check passes
    expect(isMFACompliant(session)).toBe(true);
  });

  it('T-W12-QAV-7g: auth stub returns null session for unauthenticated user', async () => {
    // FR-031 — unauthenticated state verification
    const authStub = makeAuthStub(null);
    const { data, error } = await authStub.auth.getSession();

    expect(error).toBeNull();
    expect(data.session).toBeNull();
  });
});
