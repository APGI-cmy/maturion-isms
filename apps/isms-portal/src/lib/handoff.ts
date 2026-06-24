import { ONBOARDING_PROFILE_STORAGE_KEY, type OnboardingProfile } from './subscription';
import type { EntitlementState } from './entitlements';
import {
  MATURITY_HANDOFF_STORAGE_KEY,
  readMaturityRoadmapHandoff as readPersistedMaturityRoadmapHandoff,
  storeMaturityRoadmapHandoff as storePersistedMaturityRoadmapHandoff,
} from './runtimeLocalPersistence';

export interface MaturityRoadmapHandoff {
  module: 'maturity-roadmap';
  organisationName: string;
  sector: string;
  primaryGoal: string;
  responsiblePerson: string;
  source: string | null;
  createdAt: string;
}

function readOnboardingProfile(): OnboardingProfile | null {
  if (typeof window === 'undefined') return null;

  const stored = window.localStorage.getItem(ONBOARDING_PROFILE_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as OnboardingProfile;
  } catch {
    window.localStorage.removeItem(ONBOARDING_PROFILE_STORAGE_KEY);
    return null;
  }
}

export function createMaturityRoadmapHandoff(entitlement: EntitlementState): MaturityRoadmapHandoff {
  const profile = readOnboardingProfile();

  return {
    module: 'maturity-roadmap',
    organisationName: profile?.organisationName || 'Organisation not captured',
    sector: profile?.sector || 'Sector not captured',
    primaryGoal: profile?.primaryGoal || 'Maturity roadmap setup',
    responsiblePerson: profile?.responsiblePerson || 'Responsible person not captured',
    source: entitlement.source,
    createdAt: new Date().toISOString(),
  };
}

export function storeMaturityRoadmapHandoff(handoff: MaturityRoadmapHandoff): void {
  storePersistedMaturityRoadmapHandoff(handoff);
}

export function readMaturityRoadmapHandoff(): MaturityRoadmapHandoff | null {
  return readPersistedMaturityRoadmapHandoff().value;
}

export { MATURITY_HANDOFF_STORAGE_KEY };
