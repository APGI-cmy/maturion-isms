import { beforeEach, describe, expect, it } from 'vitest';
import {
  MATURITY_HANDOFF_STORAGE_KEY,
  getRemotePersistencePosture,
  readMaturityRoadmapHandoff,
  readOnboardingProfile,
  storeEntitlementState,
  storeMaturityRoadmapHandoff,
  storeOnboardingProfile,
} from './runtimeLocalPersistence';
import { ONBOARDING_PROFILE_STORAGE_KEY, PENDING_CHECKOUT_STORAGE_KEY } from './subscription';

describe('ISMS P2.1 runtime local persistence adapter', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('stores and reads onboarding profile through the adapter', () => {
    const stored = storeOnboardingProfile({
      organisationName: 'ACME Minerals',
      sector: 'diamond operations',
      primaryGoal: 'Improve maturity governance',
      responsiblePerson: 'A. Manager',
      email: 'manager@example.test',
      completedAt: '2026-06-23T09:00:00.000Z',
    });

    const read = readOnboardingProfile();

    expect(stored.outcome).toBe('stored_local');
    expect(stored.storageKey).toBe(ONBOARDING_PROFILE_STORAGE_KEY);
    expect(read.outcome).toBe('read_local');
    expect(read.value?.organisationName).toBe('ACME Minerals');
  });

  it('stores and reads maturity handoff through the adapter', () => {
    const stored = storeMaturityRoadmapHandoff({
      module: 'maturity-roadmap',
      organisationName: 'ACME Minerals',
      sector: 'diamond operations',
      primaryGoal: 'Prepare maturity setup',
      responsiblePerson: 'A. Manager',
      source: 'dashboard',
      createdAt: '2026-06-23T09:01:00.000Z',
    });

    const read = readMaturityRoadmapHandoff();

    expect(stored.outcome).toBe('stored_local');
    expect(stored.storageKey).toBe(MATURITY_HANDOFF_STORAGE_KEY);
    expect(read.outcome).toBe('read_local');
    expect(read.value?.module).toBe('maturity-roadmap');
  });

  it('preserves checkout metadata when storing entitlement fallback state', () => {
    window.localStorage.setItem(PENDING_CHECKOUT_STORAGE_KEY, JSON.stringify({
      selectedModules: ['risk-management'],
      isBundle: false,
      isYearly: true,
      source: 'checkout-mock',
      paymentMethod: 'mock-card',
      totalPrice: 199,
    }));

    const stored = storeEntitlementState({
      isBundle: false,
      entitledModules: ['maturity-roadmap'],
      source: 'dashboard-refresh',
      completedAt: '2026-06-23T09:02:00.000Z',
    });

    expect(stored.outcome).toBe('stored_local');
    expect(stored.value?.selectedModules).toEqual(['maturity-roadmap']);
    expect(stored.value?.isYearly).toBe(true);
    expect(stored.value?.paymentMethod).toBe('mock-card');
    expect(stored.value?.totalPrice).toBe(199);
  });

  it('clears corrupt local JSON on read', () => {
    window.localStorage.setItem(ONBOARDING_PROFILE_STORAGE_KEY, '{not-json');

    const read = readOnboardingProfile();

    expect(read.outcome).toBe('cleared_corrupt_local');
    expect(window.localStorage.getItem(ONBOARDING_PROFILE_STORAGE_KEY)).toBeNull();
  });

  it('records that remote persistence is not appointed in P2.1', () => {
    const posture = getRemotePersistencePosture('onboarding-profile');

    expect(posture.outcome).toBe('remote_write_not_appointed');
    expect(posture.reason).toContain('local adapter foundation only');
  });
});
