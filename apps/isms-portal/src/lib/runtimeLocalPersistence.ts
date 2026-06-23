import type { EntitlementState } from './entitlements';
import type { MaturityRoadmapHandoff } from './handoff';
import {
  ONBOARDING_PROFILE_STORAGE_KEY,
  PENDING_CHECKOUT_STORAGE_KEY,
  type OnboardingProfile,
  type SubscriptionSelection,
} from './subscription';

export const MATURITY_HANDOFF_STORAGE_KEY = 'isms_maturity_handoff';

export type LocalPersistenceCapability = 'onboarding-profile' | 'maturity-handoff' | 'entitlement-state';

export type LocalPersistenceOutcome =
  | 'stored_local'
  | 'read_local'
  | 'missing_local'
  | 'cleared_corrupt_local'
  | 'skipped_non_browser_runtime'
  | 'remote_write_not_appointed';

export interface LocalPersistenceResult<T = unknown> {
  capability: LocalPersistenceCapability;
  outcome: LocalPersistenceOutcome;
  storageKey: string;
  value: T | null;
  reason: string | null;
}

interface StoredOnboardingProfile extends OnboardingProfile {
  email?: string | null;
  completedAt?: string;
}

interface StoredEntitlementSelection extends Partial<SubscriptionSelection> {
  selectedModules?: string[];
  completedAt?: string;
  [key: string]: unknown;
}

const storageKeys: Record<LocalPersistenceCapability, string> = {
  'onboarding-profile': ONBOARDING_PROFILE_STORAGE_KEY,
  'maturity-handoff': MATURITY_HANDOFF_STORAGE_KEY,
  'entitlement-state': PENDING_CHECKOUT_STORAGE_KEY,
};

function isBrowserRuntime(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function result<T>(
  capability: LocalPersistenceCapability,
  outcome: LocalPersistenceOutcome,
  value: T | null,
  reason: string | null = null,
): LocalPersistenceResult<T> {
  return {
    capability,
    outcome,
    storageKey: storageKeys[capability],
    value,
    reason,
  };
}

function writeLocal<T>(capability: LocalPersistenceCapability, value: T): LocalPersistenceResult<T> {
  if (!isBrowserRuntime()) {
    return result(capability, 'skipped_non_browser_runtime', null, 'localStorage is unavailable outside the browser runtime.');
  }

  window.localStorage.setItem(storageKeys[capability], JSON.stringify(value));
  return result(capability, 'stored_local', value);
}

function readLocal<T>(capability: LocalPersistenceCapability): LocalPersistenceResult<T> {
  if (!isBrowserRuntime()) {
    return result(capability, 'skipped_non_browser_runtime', null, 'localStorage is unavailable outside the browser runtime.');
  }

  const stored = window.localStorage.getItem(storageKeys[capability]);
  if (!stored) return result(capability, 'missing_local', null);

  try {
    return result(capability, 'read_local', JSON.parse(stored) as T);
  } catch {
    window.localStorage.removeItem(storageKeys[capability]);
    return result(capability, 'cleared_corrupt_local', null, 'Stored JSON could not be parsed and was removed.');
  }
}

export function storeOnboardingProfile(
  profile: OnboardingProfile & { email?: string | null; completedAt?: string | null },
): LocalPersistenceResult<StoredOnboardingProfile> {
  return writeLocal('onboarding-profile', {
    ...profile,
    completedAt: profile.completedAt ?? new Date().toISOString(),
  });
}

export function readOnboardingProfile(): LocalPersistenceResult<OnboardingProfile> {
  return readLocal<OnboardingProfile>('onboarding-profile');
}

export function storeMaturityRoadmapHandoff(
  handoff: MaturityRoadmapHandoff,
): LocalPersistenceResult<MaturityRoadmapHandoff> {
  return writeLocal('maturity-handoff', handoff);
}

export function readMaturityRoadmapHandoff(): LocalPersistenceResult<MaturityRoadmapHandoff> {
  return readLocal<MaturityRoadmapHandoff>('maturity-handoff');
}

function readStoredEntitlementSelection(): StoredEntitlementSelection {
  return readLocal<StoredEntitlementSelection>('entitlement-state').value ?? {};
}

export function storeEntitlementState(entitlement: EntitlementState): LocalPersistenceResult<StoredEntitlementSelection> {
  const existingSelection = readStoredEntitlementSelection();

  return writeLocal('entitlement-state', {
    ...existingSelection,
    selectedModules: entitlement.entitledModules,
    isBundle: entitlement.isBundle,
    isYearly: existingSelection.isYearly ?? false,
    source: entitlement.source ?? existingSelection.source ?? null,
    completedAt: entitlement.completedAt,
  });
}

export function getRemotePersistencePosture(capability: LocalPersistenceCapability): LocalPersistenceResult<null> {
  return result(
    capability,
    'remote_write_not_appointed',
    null,
    'Remote Supabase writes are not appointed in P2.1. This slice provides local adapter foundation only.',
  );
}
