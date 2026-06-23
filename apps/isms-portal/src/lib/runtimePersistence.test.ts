import { beforeEach, describe, expect, it } from 'vitest';
import { persistEntitlementState, persistMaturityRoadmapHandoff, persistOnboardingProfile } from './runtimePersistence';
import { MATURITY_HANDOFF_STORAGE_KEY, ONBOARDING_PROFILE_STORAGE_KEY, PENDING_CHECKOUT_STORAGE_KEY } from './subscription';

describe('ISMS runtime persistence hooks', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('persists onboarding profile to local fallback when Supabase is not configured', async () => {
    const result = await persistOnboardingProfile({
      organisationName: 'ACME Minerals',
      sector: 'diamond operations',
      primaryGoal: 'Improve maturity roadmap governance',
      responsiblePerson: 'A. Manager',
      email: 'manager@example.test',
      completedAt: '2026-06-23T09:00:00.000Z',
    });

    const stored = JSON.parse(window.localStorage.getItem(ONBOARDING_PROFILE_STORAGE_KEY) ?? '{}') as {
      organisationName?: string;
      completedAt?: string;
    };

    expect(stored.organisationName).toBe('ACME Minerals');
    expect(stored.completedAt).toBe('2026-06-23T09:00:00.000Z');
    expect(result.capability).toBe('onboarding-profile');
    expect(result.outcome).toBe('skipped_supabase_not_configured');
  });

  it('persists maturity handoff to local fallback when Supabase is not configured', async () => {
    const result = await persistMaturityRoadmapHandoff({
      module: 'maturity-roadmap',
      organisationName: 'ACME Minerals',
      sector: 'diamond operations',
      primaryGoal: 'Prepare maturity setup',
      responsiblePerson: 'A. Manager',
      source: 'dashboard',
      createdAt: '2026-06-23T09:01:00.000Z',
    });

    const stored = JSON.parse(window.localStorage.getItem(MATURITY_HANDOFF_STORAGE_KEY) ?? '{}') as {
      module?: string;
      source?: string;
    };

    expect(stored.module).toBe('maturity-roadmap');
    expect(stored.source).toBe('dashboard');
    expect(result.capability).toBe('maturity-handoff');
    expect(result.outcome).toBe('skipped_supabase_not_configured');
  });

  it('keeps entitlement persistence local and preserves checkout metadata until authority is appointed', async () => {
    window.localStorage.setItem(PENDING_CHECKOUT_STORAGE_KEY, JSON.stringify({
      selectedModules: ['risk-management'],
      isBundle: false,
      isYearly: true,
      source: 'checkout-mock',
      paymentMethod: 'mock-card',
      totalPrice: 199,
    }));

    const result = await persistEntitlementState({
      isBundle: false,
      entitledModules: ['maturity-roadmap'],
      source: 'dashboard-refresh',
      completedAt: '2026-06-23T09:02:00.000Z',
    });

    const stored = JSON.parse(window.localStorage.getItem(PENDING_CHECKOUT_STORAGE_KEY) ?? '{}') as {
      selectedModules?: string[];
      isYearly?: boolean;
      paymentMethod?: string;
      totalPrice?: number;
    };

    expect(stored.selectedModules).toEqual(['maturity-roadmap']);
    expect(stored.isYearly).toBe(true);
    expect(stored.paymentMethod).toBe('mock-card');
    expect(stored.totalPrice).toBe(199);
    expect(result.capability).toBe('entitlement-state');
    expect(result.outcome).toBe('skipped_supabase_write_blocked');
    expect(result.reason).toContain('production entitlement authority');
  });
});
