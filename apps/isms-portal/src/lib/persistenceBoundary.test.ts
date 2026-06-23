import { describe, expect, it } from 'vitest';
import {
  assertPersistenceCapabilityRegistered,
  getPersistenceBoundary,
  ismsPersistenceBoundary,
  type PersistenceCapability,
} from './persistenceBoundary';

describe('ISMS persistence boundary registry', () => {
  it('registers the W6 persistence capabilities', () => {
    const capabilities = ismsPersistenceBoundary.map((record) => record.capability);

    expect(capabilities).toEqual([
      'free-assessment',
      'onboarding-profile',
      'entitlement-state',
      'maturity-handoff',
      'audit-event',
    ]);
  });

  it('marks only appointed P2 runtime hooks as client ready', () => {
    expect(getPersistenceBoundary('onboarding-profile').runtimeStatus).toBe('client_hook_ready');
    expect(getPersistenceBoundary('maturity-handoff').runtimeStatus).toBe('client_hook_ready');
    expect(getPersistenceBoundary('free-assessment').runtimeStatus).toBe('schema_registered_only');
    expect(getPersistenceBoundary('entitlement-state').runtimeStatus).toBe('schema_registered_only');
    expect(getPersistenceBoundary('audit-event').runtimeStatus).toBe('schema_registered_only');
  });

  it('maps capabilities to concrete ISMS tables', () => {
    expect(getPersistenceBoundary('free-assessment').tableName).toBe('isms_assessments');
    expect(getPersistenceBoundary('onboarding-profile').tableName).toBe('isms_onboarding_profiles');
    expect(getPersistenceBoundary('entitlement-state').tableName).toBe('isms_entitlements');
    expect(getPersistenceBoundary('maturity-handoff').tableName).toBe('isms_maturity_handoffs');
    expect(getPersistenceBoundary('audit-event').tableName).toBe('isms_audit_events');
  });

  it('requires auth for all schema-registered client persistence capabilities', () => {
    expect(getPersistenceBoundary('free-assessment').requiresAuthenticatedUser).toBe(true);
    expect(getPersistenceBoundary('onboarding-profile').requiresAuthenticatedUser).toBe(true);
    expect(getPersistenceBoundary('entitlement-state').requiresAuthenticatedUser).toBe(true);
    expect(getPersistenceBoundary('maturity-handoff').requiresAuthenticatedUser).toBe(true);
    expect(getPersistenceBoundary('audit-event').requiresAuthenticatedUser).toBe(true);
  });

  it('documents why entitlement writes remain blocked', () => {
    expect(getPersistenceBoundary('entitlement-state').runtimeNotes).toContain('select-only entitlement policy');
  });

  it('guards against unregistered persistence capability lookups', () => {
    expect(() => getPersistenceBoundary('unknown' as PersistenceCapability)).toThrow('Unregistered ISMS persistence capability');
    expect(() => assertPersistenceCapabilityRegistered('audit-event')).not.toThrow();
  });
});
