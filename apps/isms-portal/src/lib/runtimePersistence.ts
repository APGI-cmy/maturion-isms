import type { EntitlementState } from './entitlements';
import type { MaturityRoadmapHandoff } from './handoff';
import {
  MATURITY_HANDOFF_STORAGE_KEY,
  ONBOARDING_PROFILE_STORAGE_KEY,
  PENDING_CHECKOUT_STORAGE_KEY,
  type OnboardingProfile,
  type SubscriptionSelection,
} from './subscription';
import { getIsmsSupabaseRuntime, insertIsmsSupabaseRecord } from './supabaseClient';

export type RuntimePersistenceCapability = 'onboarding-profile' | 'maturity-handoff' | 'entitlement-state';

export type RuntimePersistenceOutcome =
  | 'stored_local'
  | 'stored_supabase'
  | 'skipped_supabase_not_configured'
  | 'skipped_supabase_auth_required'
  | 'skipped_supabase_write_blocked'
  | 'failed_supabase_write';

export interface RuntimePersistenceResult {
  capability: RuntimePersistenceCapability;
  outcome: RuntimePersistenceOutcome;
  localStorageKey: string;
  tableName: string | null;
  reason: string | null;
}

const capabilityLocalStorageKey: Record<RuntimePersistenceCapability, string> = {
  'onboarding-profile': ONBOARDING_PROFILE_STORAGE_KEY,
  'maturity-handoff': MATURITY_HANDOFF_STORAGE_KEY,
  'entitlement-state': PENDING_CHECKOUT_STORAGE_KEY,
};

const capabilityTableName: Record<RuntimePersistenceCapability, string | null> = {
  'onboarding-profile': 'isms_onboarding_profiles',
  'maturity-handoff': 'isms_maturity_handoffs',
  'entitlement-state': 'isms_entitlements',
};

function unavailableResult(
  capability: RuntimePersistenceCapability,
  outcome: RuntimePersistenceOutcome,
  reason: string,
): RuntimePersistenceResult {
  return {
    capability,
    outcome,
    localStorageKey: capabilityLocalStorageKey[capability],
    tableName: capabilityTableName[capability],
    reason,
  };
}

function supabaseSuccessResult(capability: RuntimePersistenceCapability): RuntimePersistenceResult {
  return {
    capability,
    outcome: 'stored_supabase',
    localStorageKey: capabilityLocalStorageKey[capability],
    tableName: capabilityTableName[capability],
    reason: null,
  };
}

function readStoredSubscriptionSelection(): Partial<SubscriptionSelection> & Record<string, unknown> {
  if (typeof window === 'undefined') return {};

  const stored = window.localStorage.getItem(PENDING_CHECKOUT_STORAGE_KEY);
  if (!stored) return {};

  try {
    return JSON.parse(stored) as Partial<SubscriptionSelection> & Record<string, unknown>;
  } catch {
    return {};
  }
}

export function persistJsonLocal(storageKey: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey, JSON.stringify(value));
}

async function persistWithSupabase(
  capability: RuntimePersistenceCapability,
  record: (userId: string) => Record<string, unknown>,
): Promise<RuntimePersistenceResult> {
  const runtime = getIsmsSupabaseRuntime();

  if (!runtime) {
    return unavailableResult(
      capability,
      'skipped_supabase_auth_required',
      'Supabase runtime writes require app env plus an appointed authenticated Supabase session boundary. Local fallback remains active.',
    );
  }

  const result = await insertIsmsSupabaseRecord(
    runtime,
    capabilityTableName[capability] ?? capability,
    record(runtime.userId),
  );

  if (result.error) {
    return unavailableResult(
      capability,
      'failed_supabase_write',
      result.error.message ?? 'Supabase write failed without a detailed message.',
    );
  }

  return supabaseSuccessResult(capability);
}

export async function persistOnboardingProfile(
  profile: OnboardingProfile & { email?: string | null; completedAt?: string | null },
): Promise<RuntimePersistenceResult> {
  const completedAt = profile.completedAt ?? new Date().toISOString();
  persistJsonLocal(ONBOARDING_PROFILE_STORAGE_KEY, { ...profile, completedAt });

  return persistWithSupabase('onboarding-profile', (userId) => ({
    user_id: userId,
    organisation_name: profile.organisationName,
    sector: profile.sector,
    primary_goal: profile.primaryGoal,
    responsible_person: profile.responsiblePerson,
    updated_at: completedAt,
  }));
}

export async function persistMaturityRoadmapHandoff(
  handoff: MaturityRoadmapHandoff,
): Promise<RuntimePersistenceResult> {
  persistJsonLocal(MATURITY_HANDOFF_STORAGE_KEY, handoff);

  return persistWithSupabase('maturity-handoff', (userId) => ({
    user_id: userId,
    organisation_name: handoff.organisationName,
    sector: handoff.sector,
    primary_goal: handoff.primaryGoal,
    responsible_person: handoff.responsiblePerson,
    source: handoff.source,
    created_at: handoff.createdAt,
  }));
}

export async function persistEntitlementState(entitlement: EntitlementState): Promise<RuntimePersistenceResult> {
  const existingSelection = readStoredSubscriptionSelection();

  persistJsonLocal(PENDING_CHECKOUT_STORAGE_KEY, {
    ...existingSelection,
    selectedModules: entitlement.entitledModules,
    isBundle: entitlement.isBundle,
    isYearly: existingSelection.isYearly ?? false,
    source: entitlement.source ?? existingSelection.source ?? null,
    completedAt: entitlement.completedAt,
  });

  return unavailableResult(
    'entitlement-state',
    'skipped_supabase_write_blocked',
    'The W6 entitlement table is select-only under RLS. Runtime entitlement writes remain blocked until production entitlement authority is appointed.',
  );
}
