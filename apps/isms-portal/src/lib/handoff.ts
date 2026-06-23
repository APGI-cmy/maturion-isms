import { MATURITY_HANDOFF_STORAGE_KEY, ONBOARDING_PROFILE_STORAGE_KEY, type OnboardingProfile } from './subscription';
import type { EntitlementState } from './entitlements';
import { persistMaturityRoadmapHandoff } from './runtimePersistence';

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
  if (typeof window === 'undefined') return;
  void persistMaturityRoadmapHandoff(handoff);
}

export function readMaturityRoadmapHandoff(): MaturityRoadmapHandoff | null {
  if (typeof window === 'undefined') return null;

  const stored = window.localStorage.getItem(MATURITY_HANDOFF_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as MaturityRoadmapHandoff;
  } catch {
    window.localStorage.removeItem(MATURITY_HANDOFF_STORAGE_KEY);
    return null;
  }
}
