import { ONBOARDING_PROFILE_STORAGE_KEY, type OnboardingProfile } from './subscription';
import type { EntitlementState } from './entitlements';

export interface MaturityRoadmapHandoff {
  module: 'maturity-roadmap';
  organisationName: string;
  sector: string;
  primaryGoal: string;
  responsiblePerson: string;
  source: string | null;
  createdAt: string;
}

export const MATURITY_HANDOFF_STORAGE_KEY = 'isms_maturity_handoff';

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
  window.localStorage.setItem(MATURITY_HANDOFF_STORAGE_KEY, JSON.stringify(handoff));
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
