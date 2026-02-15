/**
 * MAT Test Suite — CAT-12: data privacy compliance
 *
 * Build-to-Green: Tests validate GDPR/POPIA compliance,
 * data retention, regulatory alignment, and consent management.
 *
 * Registry: governance/TEST_REGISTRY.json
 * Strategy: Maturion/strategy/MAT_RED_TEST_SUITE_STRATEGY.md
 */
import { describe, it, expect } from 'vitest';
import {
  generateDSARExport,
  performErasure,
  createRetentionPolicy,
  checkRetention,
  checkRegulatoryAlignment,
  recordConsent,
  withdrawConsent,
  hasActiveConsent
} from '../../src/services/data-privacy.js';

describe('CAT-12: data privacy compliance', () => {
  it('MAT-T-0067: GDPR Compliance — DSAR and Erasure', () => {
    // Architecture: §3.2
    // FRS: FR-066
    // TRS: TR-029
    // Type: integration | Priority: P0

    // DSAR export generates all personal data categories
    const dsarExport = generateDSARExport('user-001', 'org-001', 'json');
    expect(dsarExport.user_id).toBe('user-001');
    expect(dsarExport.organisation_id).toBe('org-001');
    expect(dsarExport.exported_at).toBeDefined();
    expect(dsarExport.format).toBe('json');
    expect(dsarExport.data_categories.length).toBeGreaterThan(0);
    expect(dsarExport.data_categories).toContain('profile');
    expect(dsarExport.data_categories).toContain('audit_activity');
    expect(dsarExport.data_categories).toContain('evidence_submissions');
    expect(dsarExport.records.length).toBe(dsarExport.data_categories.length);

    // CSV format supported
    const csvExport = generateDSARExport('user-001', 'org-001', 'csv');
    expect(csvExport.format).toBe('csv');

    // Right to erasure — anonymisation preserves audit integrity
    const erasureResult = performErasure('user-001', 'org-001');
    expect(erasureResult.user_id).toBe('user-001');
    expect(erasureResult.organisation_id).toBe('org-001');
    expect(erasureResult.anonymised_at).toBeDefined();
    expect(erasureResult.fields_anonymised.length).toBeGreaterThan(0);
    expect(erasureResult.fields_anonymised).toContain('display_name');
    expect(erasureResult.fields_anonymised).toContain('email');
    expect(erasureResult.audit_integrity_preserved).toBe(true);
  });

  it('MAT-T-0068: POPIA Compliance', () => {
    // Architecture: §3.2
    // FRS: FR-066
    // TRS: TR-030
    // Type: integration | Priority: P0

    // POPIA alignment check
    const popiaAlignment = checkRegulatoryAlignment('popia');
    expect(popiaAlignment.standard).toBe('popia');
    expect(popiaAlignment.aligned).toBe(true);
    expect(popiaAlignment.controls_mapped).toBeGreaterThan(0);
    expect(popiaAlignment.controls_total).toBeGreaterThan(0);
    expect(popiaAlignment.controls_mapped).toBe(popiaAlignment.controls_total);
    expect(popiaAlignment.gaps).toHaveLength(0);

    // POPIA requires explicit consent — verify consent mechanism
    const consent = recordConsent('user-001', 'data_processing', '192.168.1.1');
    expect(consent.granted).toBe(true);
    expect(consent.ip_address).toBe('192.168.1.1');
    expect(consent.scope).toBe('data_processing');

    // Consent can be withdrawn at any time (POPIA Section 11)
    const withdrawn = withdrawConsent(consent);
    expect(withdrawn.granted).toBe(false);
    expect(withdrawn.withdrawn_at).toBeDefined();
  });

  it('MAT-T-0069: Data Retention Policy Enforcement', () => {
    // Architecture: §3.2
    // FRS: FR-066
    // TRS: TR-031
    // Type: integration | Priority: P0

    // Create retention policy with 7-year minimum
    const policy = createRetentionPolicy('org-001', 10, true);
    expect(policy.organisation_id).toBe('org-001');
    expect(policy.retention_years).toBe(10);
    expect(policy.minimum_years).toBe(7);
    expect(policy.auto_archive).toBe(true);
    expect(policy.policy_updated_at).toBeDefined();

    // Minimum 7-year enforcement
    const shortPolicy = createRetentionPolicy('org-002', 3, false);
    expect(shortPolicy.retention_years).toBe(7); // Enforced minimum
    expect(shortPolicy.auto_archive).toBe(false);

    // Retention check identifies expired records
    const now = new Date();
    const oldDate = new Date(now.getTime() - (11 * 365.25 * 24 * 60 * 60 * 1000)); // 11 years ago
    const recentDate = new Date(now.getTime() - (2 * 365.25 * 24 * 60 * 60 * 1000)); // 2 years ago

    const checkResult = checkRetention('org-001', policy, [
      oldDate.toISOString(),
      recentDate.toISOString()
    ]);

    expect(checkResult.organisation_id).toBe('org-001');
    expect(checkResult.records_checked).toBe(2);
    expect(checkResult.records_expired).toBe(1); // 11 years > 10 years retention
    expect(checkResult.records_archived).toBe(1); // auto_archive is true
    expect(checkResult.checked_at).toBeDefined();

    // With auto_archive disabled, expired records are not archived
    const noArchiveResult = checkRetention('org-002', shortPolicy, [
      oldDate.toISOString()
    ]);
    expect(noArchiveResult.records_expired).toBe(1);
    expect(noArchiveResult.records_archived).toBe(0);
  });

  it('MAT-T-0070: Regulatory Standard Alignment', () => {
    // Architecture: §3.2
    // FRS: FR-067
    // TRS: TR-032
    // Type: integration | Priority: P1

    // ISO 27001 alignment
    const iso27001 = checkRegulatoryAlignment('iso27001');
    expect(iso27001.standard).toBe('iso27001');
    expect(iso27001.aligned).toBe(true);
    expect(iso27001.controls_mapped).toBeGreaterThan(0);
    expect(iso27001.controls_total).toBeGreaterThan(0);
    expect(iso27001.gaps).toHaveLength(0);

    // ISO 19011 alignment
    const iso19011 = checkRegulatoryAlignment('iso19011');
    expect(iso19011.standard).toBe('iso19011');
    expect(iso19011.aligned).toBe(true);
    expect(iso19011.controls_mapped).toBeGreaterThan(0);

    // GDPR alignment
    const gdpr = checkRegulatoryAlignment('gdpr');
    expect(gdpr.standard).toBe('gdpr');
    expect(gdpr.aligned).toBe(true);
    expect(gdpr.controls_mapped).toBe(gdpr.controls_total);

    // POPIA alignment
    const popia = checkRegulatoryAlignment('popia');
    expect(popia.standard).toBe('popia');
    expect(popia.aligned).toBe(true);
  });

  it('MAT-T-0097: Consent Management', () => {
    // Architecture: §3.2
    // FRS: FR-058, FR-066
    // TRS: TR-067
    // Type: integration | Priority: P0

    // Record consent with full audit trail
    const consent1 = recordConsent('user-001', 'data_processing', '10.0.0.1');
    expect(consent1.id).toBeDefined();
    expect(consent1.user_id).toBe('user-001');
    expect(consent1.scope).toBe('data_processing');
    expect(consent1.granted).toBe(true);
    expect(consent1.granted_at).toBeDefined();
    expect(consent1.ip_address).toBe('10.0.0.1');
    expect(consent1.withdrawn_at).toBeNull();

    const consent2 = recordConsent('user-001', 'profiling', '10.0.0.1');
    expect(consent2.scope).toBe('profiling');

    // Check active consent
    const consents = [consent1, consent2];
    expect(hasActiveConsent(consents, 'data_processing')).toBe(true);
    expect(hasActiveConsent(consents, 'profiling')).toBe(true);
    expect(hasActiveConsent(consents, 'marketing')).toBe(false);

    // Withdraw consent
    const withdrawnConsent = withdrawConsent(consent1);
    expect(withdrawnConsent.granted).toBe(false);
    expect(withdrawnConsent.withdrawn_at).toBeDefined();

    // After withdrawal, active consent check fails
    const updatedConsents = [withdrawnConsent, consent2];
    expect(hasActiveConsent(updatedConsents, 'data_processing')).toBe(false);
    expect(hasActiveConsent(updatedConsents, 'profiling')).toBe(true);
  });
});
