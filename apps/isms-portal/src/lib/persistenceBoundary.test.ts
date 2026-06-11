import { describe, expect, it } from 'vitest';
import {
  assertPersistenceCapabilityRegistered,
  getPersistenceBoundary,
  ismsPersistenceBoundary,
  type PersistenceCapability,
} from './persistenceBoundary';

describe('W6 ISMS persistence boundary registry', () => {
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

  it('keeps all W6 runtime surfaces schema-registered only', () => {
    expect(ismsPersistenceBoundary.every((record) => record.runtimeStatus === 'schema_registered_only')).toBe(true);
  });

  it('maps capabilities to concrete ISMS tables', () => {
    expect(getPersistenceBoundary('free-assessment').tableName).toBe('isms_assessments');
    expect(getPersistenceBoundary('onboarding-profile').tableName).toBe('isms_onboarding_profiles');
    expect(getPersistenceBoundary('entitlement-state').tableName).toBe('isms_entitlements');
    expect(getPersistenceBoundary('maturity-handoff').tableName).toBe('isms_maturity_handoffs');
    expect(getPersistenceBoundary('audit-event').tableName).toBe('isms_audit_events');
  });

  it('requires auth for private-state capabilities', () => {
    expect(getPersistenceBoundary('free-assessment').requiresAuthenticatedUser).toBe(false);
    expect(getPersistenceBoundary('onboarding-profile').requiresAuthenticatedUser).toBe(true);
    expect(getPersistenceBoundary('entitlement-state').requiresAuthenticatedUser).toBe(true);
    expect(getPersistenceBoundary('maturity-handoff').requiresAuthenticatedUser).toBe(true);
  });

  it('guards against unregistered persistence capability lookups', () => {
    expect(() => getPersistenceBoundary('unknown' as PersistenceCapability)).toThrow('Unregistered ISMS persistence capability');
    expect(assertPersistenceCapabilityRegistered('audit-event')).toBe(true);
  });
});
