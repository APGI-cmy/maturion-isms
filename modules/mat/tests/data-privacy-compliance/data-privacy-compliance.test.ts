/**
 * MAT Test Suite — CAT-12: data privacy compliance
 *
 * Build-to-Green for MAT-T-0067, MAT-T-0068, MAT-T-0069, MAT-T-0070, MAT-T-0097.
 *
 * Registry: governance/TEST_REGISTRY.json
 * Strategy: Maturion/strategy/MAT_RED_TEST_SUITE_STRATEGY.md
 */
import { describe, it, expect } from 'vitest';
import {
  processDSAR,
  performErasure,
  validatePOPIACompliance,
  getDefaultRetentionPolicy,
  isRecordExpired,
  validateRegulatoryAlignment,
  recordConsent,
  withdrawConsent,
  isConsentValid
} from '../../src/services/data-privacy-compliance.js';

describe('CAT-12: data privacy compliance', () => {
  it('MAT-T-0067: GDPR Compliance — DSAR and Erasure', () => {
    // Architecture: §3.2
    // FRS: FR-066
    // TRS: TR-029
    // Type: integration | Priority: P0

    // 1. Process a DSAR access request
    const dsarAccess = processDSAR('subject-001', 'org-001', 'access');
    expect(dsarAccess.id).toBeDefined();
    expect(dsarAccess.subject_id).toBe('subject-001');
    expect(dsarAccess.organisation_id).toBe('org-001');
    expect(dsarAccess.request_type).toBe('access');
    expect(dsarAccess.status).toBe('completed');
    expect(dsarAccess.requested_at).toBeDefined();
    expect(dsarAccess.completed_at).toBeDefined();
    expect(dsarAccess.response_deadline).toBeDefined();
    expect(dsarAccess.response_data).toBeDefined();
    expect(dsarAccess.response_data!.exported_fields).toBeDefined();

    // 2. Verify 72-hour deadline
    const requestedTime = new Date(dsarAccess.requested_at).getTime();
    const deadlineTime = new Date(dsarAccess.response_deadline).getTime();
    expect(deadlineTime - requestedTime).toBe(72 * 60 * 60 * 1000);

    // 3. Process erasure request (anonymization preserving audit integrity)
    const erasureResult = performErasure('subject-001', 15);
    expect(erasureResult.subject_id).toBe('subject-001');
    expect(erasureResult.records_anonymized).toBe(15);
    expect(erasureResult.audit_integrity_preserved).toBe(true);
    expect(erasureResult.completed_at).toBeDefined();

    // 4. Process portability request
    const dsarPortability = processDSAR('subject-002', 'org-001', 'portability');
    expect(dsarPortability.request_type).toBe('portability');
    expect(dsarPortability.response_data).toBeDefined();

    // 5. Process erasure-type DSAR (no response data)
    const dsarErasure = processDSAR('subject-003', 'org-001', 'erasure');
    expect(dsarErasure.request_type).toBe('erasure');
    expect(dsarErasure.response_data).toBeNull();
  });

  it('MAT-T-0068: POPIA Compliance', () => {
    // Architecture: §3.2
    // FRS: FR-066
    // TRS: TR-030
    // Type: integration | Priority: P0

    // 1. Fully compliant organisation
    const compliant = validatePOPIACompliance('org-001', true, true, true);
    expect(compliant.compliant).toBe(true);
    expect(compliant.organisation_id).toBe('org-001');
    expect(compliant.gaps).toHaveLength(0);
    expect(compliant.checked_at).toBeDefined();

    // 2. Non-compliant: missing Information Officer
    const noOfficer = validatePOPIACompliance('org-002', false, true, true);
    expect(noOfficer.compliant).toBe(false);
    expect(noOfficer.gaps).toContain('Information Officer not designated');

    // 3. Non-compliant: missing Section 4 alignment
    const noSection4 = validatePOPIACompliance('org-003', true, false, true);
    expect(noSection4.compliant).toBe(false);
    expect(noSection4.gaps).toContain('Section 4 conditions not aligned');

    // 4. Non-compliant: special data not authorized
    const noSpecialAuth = validatePOPIACompliance('org-004', true, true, false);
    expect(noSpecialAuth.compliant).toBe(false);
    expect(noSpecialAuth.gaps).toContain('Special personal information processing not authorized');

    // 5. Multiple gaps
    const multipleGaps = validatePOPIACompliance('org-005', false, false, false);
    expect(multipleGaps.compliant).toBe(false);
    expect(multipleGaps.gaps).toHaveLength(3);
  });

  it('MAT-T-0069: Data Retention Policy Enforcement', () => {
    // Architecture: §3.2
    // FRS: FR-066
    // TRS: TR-031
    // Type: integration | Priority: P0

    // 1. Verify default retention policy (7-year)
    const policy = getDefaultRetentionPolicy('org-001');
    expect(policy.organisation_id).toBe('org-001');
    expect(policy.default_retention_years).toBe(7);
    expect(policy.audit_trail_retention_years).toBe(7);
    expect(policy.evidence_retention_years).toBe(7);
    expect(policy.personal_data_retention_years).toBe(7);
    expect(policy.auto_expiry_enabled).toBe(true);
    expect(policy.soft_delete_enabled).toBe(true);

    // 2. Verify record not expired (recent record)
    const recentDate = new Date().toISOString();
    expect(isRecordExpired(recentDate, 7)).toBe(false);

    // 3. Verify record expired (old record)
    const oldDate = new Date('2010-01-01T00:00:00Z').toISOString();
    expect(isRecordExpired(oldDate, 7)).toBe(true);

    // 4. Verify short retention period
    const twoYearsAgo = new Date(Date.now() - 3 * 365.25 * 24 * 60 * 60 * 1000).toISOString();
    expect(isRecordExpired(twoYearsAgo, 2)).toBe(true);
    expect(isRecordExpired(twoYearsAgo, 5)).toBe(false);
  });

  it('MAT-T-0070: Regulatory Standard Alignment', () => {
    // Architecture: §3.2
    // FRS: FR-067
    // TRS: TR-032
    // Type: integration | Priority: P1

    // 1. Verify GDPR alignment
    const gdpr = validateRegulatoryAlignment('GDPR');
    expect(gdpr.framework).toBe('GDPR');
    expect(gdpr.aligned).toBe(true);
    expect(gdpr.coverage_percentage).toBe(100);
    expect(gdpr.gaps).toHaveLength(0);
    expect(gdpr.last_checked).toBeDefined();

    // 2. Verify POPIA alignment
    const popia = validateRegulatoryAlignment('POPIA');
    expect(popia.framework).toBe('POPIA');
    expect(popia.aligned).toBe(true);
    expect(popia.coverage_percentage).toBe(100);

    // 3. Verify ISO 27001 alignment
    const iso27001 = validateRegulatoryAlignment('ISO27001');
    expect(iso27001.framework).toBe('ISO27001');
    expect(iso27001.aligned).toBe(true);
    expect(iso27001.coverage_percentage).toBe(100);

    // 4. Verify ISO 19011 alignment
    const iso19011 = validateRegulatoryAlignment('ISO19011');
    expect(iso19011.framework).toBe('ISO19011');
    expect(iso19011.aligned).toBe(true);
    expect(iso19011.coverage_percentage).toBe(100);
  });

  it('MAT-T-0097: Consent Management', () => {
    // Architecture: §3.2
    // FRS: FR-058, FR-066
    // TRS: TR-067
    // Type: integration | Priority: P0

    // 1. Record consent
    const consent = recordConsent('subject-001', 'org-001', 'data_processing');
    expect(consent.id).toBeDefined();
    expect(consent.subject_id).toBe('subject-001');
    expect(consent.organisation_id).toBe('org-001');
    expect(consent.purpose).toBe('data_processing');
    expect(consent.status).toBe('granted');
    expect(consent.granted_at).toBeDefined();
    expect(consent.withdrawn_at).toBeNull();
    expect(consent.audit_trail_logged).toBe(true);

    // 2. Validate consent is valid
    expect(isConsentValid(consent)).toBe(true);

    // 3. Withdraw consent
    const withdrawn = withdrawConsent(consent);
    expect(withdrawn.status).toBe('withdrawn');
    expect(withdrawn.withdrawn_at).toBeDefined();
    expect(withdrawn.audit_trail_logged).toBe(true);

    // 4. Validate withdrawn consent is invalid
    expect(isConsentValid(withdrawn)).toBe(false);

    // 5. Record consent for profiling purpose
    const profilingConsent = recordConsent('subject-002', 'org-001', 'profiling');
    expect(profilingConsent.purpose).toBe('profiling');
    expect(isConsentValid(profilingConsent)).toBe(true);

    // 6. Expired consent is invalid
    const expiredConsent: typeof consent = {
      ...consent,
      status: 'granted',
      expires_at: new Date('2020-01-01T00:00:00Z').toISOString()
    };
    expect(isConsentValid(expiredConsent)).toBe(false);
  });
});
