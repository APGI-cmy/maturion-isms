import { describe, expect, it, beforeEach } from 'vitest';
import {
  allIsmsModules,
  createEntitlementState,
  hasModuleEntitlement,
  mapSubscriptionModule,
  readStoredEntitlementState,
} from './entitlements';
import { PENDING_CHECKOUT_STORAGE_KEY } from './subscription';

describe('W4 entitlement helpers', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('maps known subscription/module aliases to ISMS module keys', () => {
    expect(mapSubscriptionModule('maturity-roadmap')).toBe('maturity-roadmap');
    expect(mapSubscriptionModule('Maturion Core Platform')).toBe('maturity-roadmap');
    expect(mapSubscriptionModule('risk management')).toBe('risk-management');
    expect(mapSubscriptionModule('pit')).toBe('project-implementation');
    expect(mapSubscriptionModule('project implementation')).toBe('project-implementation');
    expect(mapSubscriptionModule('unknown-module')).toBeNull();
  });

  it('creates unique non-bundle entitlements from selected modules', () => {
    const entitlement = createEntitlementState({
      selectedModules: ['maturity-roadmap', 'maturity roadmap', 'risk-management'],
      isBundle: false,
      source: 'dashboard-upgrade',
    });

    expect(entitlement.isBundle).toBe(false);
    expect(entitlement.entitledModules).toEqual(['maturity-roadmap', 'risk-management']);
    expect(entitlement.source).toBe('dashboard-upgrade');
    expect(hasModuleEntitlement(entitlement, 'maturity-roadmap')).toBe(true);
    expect(hasModuleEntitlement(entitlement, 'skills-development')).toBe(false);
  });

  it('creates PIT entitlement from the canonical project implementation selection', () => {
    const entitlement = createEntitlementState({
      selectedModules: ['project-implementation'],
      isBundle: false,
      source: 'pit-marketing',
    });

    expect(hasModuleEntitlement(entitlement, 'project-implementation')).toBe(true);
  });

  it('copies the bundle module list rather than returning the shared exported array', () => {
    const entitlement = createEntitlementState({ isBundle: true });

    expect(entitlement.entitledModules).toEqual(allIsmsModules);
    expect(entitlement.entitledModules).not.toBe(allIsmsModules);

    entitlement.entitledModules.push('maturity-roadmap');
    expect(allIsmsModules).toHaveLength(7);
  });

  it('reads stored entitlement state and clears malformed local storage', () => {
    window.localStorage.setItem(PENDING_CHECKOUT_STORAGE_KEY, '{not-json');

    expect(readStoredEntitlementState()).toEqual({
      isBundle: false,
      entitledModules: [],
      source: null,
      completedAt: null,
    });
    expect(window.localStorage.getItem(PENDING_CHECKOUT_STORAGE_KEY)).toBeNull();
  });

  it('reads completed PIT selection from ISMS checkout storage', () => {
    window.localStorage.setItem(
      PENDING_CHECKOUT_STORAGE_KEY,
      JSON.stringify({
        selectedModules: ['project-implementation'],
        isBundle: false,
        isYearly: false,
        source: 'pit-marketing',
        completedAt: '2026-06-26T00:00:00.000Z',
      }),
    );

    const entitlement = readStoredEntitlementState();

    expect(hasModuleEntitlement(entitlement, 'project-implementation')).toBe(true);
  });
});
