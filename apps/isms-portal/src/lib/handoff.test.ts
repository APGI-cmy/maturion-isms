import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  MATURITY_HANDOFF_STORAGE_KEY,
  createMaturityRoadmapHandoff,
  readMaturityRoadmapHandoff,
  storeMaturityRoadmapHandoff,
} from './handoff';
import { ONBOARDING_PROFILE_STORAGE_KEY } from './subscription';
import type { EntitlementState } from './entitlements';

const entitlement: EntitlementState = {
  isBundle: false,
  entitledModules: ['maturity-roadmap'],
  source: 'dashboard-upgrade',
  completedAt: '2026-06-10T00:00:00.000Z',
};

describe('W4 maturity handoff helpers', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-10T10:00:00.000Z'));
  });

  it('creates a handoff from onboarding profile and entitlement source', () => {
    window.localStorage.setItem(
      ONBOARDING_PROFILE_STORAGE_KEY,
      JSON.stringify({
        organisationName: 'Example Mine',
        sector: 'diamond mining',
        primaryGoal: 'Improve chain of custody',
        responsiblePerson: 'Security Manager',
      }),
    );

    expect(createMaturityRoadmapHandoff(entitlement)).toEqual({
      module: 'maturity-roadmap',
      organisationName: 'Example Mine',
      sector: 'diamond mining',
      primaryGoal: 'Improve chain of custody',
      responsiblePerson: 'Security Manager',
      source: 'dashboard-upgrade',
      createdAt: '2026-06-10T10:00:00.000Z',
    });
  });

  it('uses fallback text when onboarding profile is missing', () => {
    const handoff = createMaturityRoadmapHandoff(entitlement);

    expect(handoff.organisationName).toBe('Organisation not captured');
    expect(handoff.sector).toBe('Sector not captured');
    expect(handoff.primaryGoal).toBe('Maturity roadmap setup');
    expect(handoff.responsiblePerson).toBe('Responsible person not captured');
  });

  it('stores and reads handoff payloads', () => {
    const handoff = createMaturityRoadmapHandoff(entitlement);

    storeMaturityRoadmapHandoff(handoff);

    expect(readMaturityRoadmapHandoff()).toEqual(handoff);
  });

  it('cleans malformed onboarding and handoff storage', () => {
    window.localStorage.setItem(ONBOARDING_PROFILE_STORAGE_KEY, '{not-json');
    window.localStorage.setItem(MATURITY_HANDOFF_STORAGE_KEY, '{not-json');

    expect(createMaturityRoadmapHandoff(entitlement).organisationName).toBe('Organisation not captured');
    expect(window.localStorage.getItem(ONBOARDING_PROFILE_STORAGE_KEY)).toBeNull();
    expect(readMaturityRoadmapHandoff()).toBeNull();
    expect(window.localStorage.getItem(MATURITY_HANDOFF_STORAGE_KEY)).toBeNull();
  });
});
