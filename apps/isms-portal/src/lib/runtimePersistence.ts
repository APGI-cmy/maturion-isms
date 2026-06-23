import type { SupabaseClient } from '@supabase/supabase-js';
import type { EntitlementState } from './entitlements';
import type { MaturityRoadmapHandoff } from './handoff';
import {
  MATURITY_HANDOFF_STORAGE_KEY,
  ONBOARDING_PROFILE_STORAGE_KEY,
  PENDING_CHECKOUT_STORAGE_KEY,
  type OnboardingProfile,
  type SubscriptionSelection,
} from './subscription';
import { getIsmsSupabaseClient } from './supabaseClient';

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

type SupabaseAuthUserResult = Awaited<ReturnType<SupabaseClient['auth']['getUser']>>;
type SupabaseWriteResult = { error: { message?: string } | null };

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

async function getSupabaseUserId(client: SupabaseClient): Promise<string | null> {
  const result: SupabaseAuthUserResult = await client.auth.getUser();

  if (result.error) return null;
  return result.data.user?.id ?? null;
}

async function persistWithSupabase(
  capability: RuntimePersistenceCapability,
  write: (client: SupabaseClient, userId: string) => PromiseLike<SupabaseWriteResult>,
): Promise<RuntimePersistenceResult> {
  const client = getIsmsSupabaseClient();

  if (!client) {
    return unavailableResult(
      capability,
      'skipped_supabase_not_configured',
      'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured for this runtime.',
    );
  }

  const userId = await getSupabaseUserId(client);
  if (!userId) {
    return unavailableResult(
      capability,
      'skipped_supabase_auth_required',
      'No authenticated Supabase user is available. Mock auth/local state remains the active fallback.',
    );
  }

  const result = await write(client, userId);
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

  return persistWithSupabase('onboarding-profile', (client, userId) =>
    client.from('isms_onboarding_profiles').insert({
      user_id: userId,
      organisation_name: profile.organisationName,
      sector: profile.sector,
      primary_goal: profile.primaryGoal,
      responsible_person: profile.responsiblePerson,
      updated_at: completedAt,
    }),
  );
}

export async function persistMaturityRoadmapHandoff(
  handoff: MaturityRoadmapHandoff,
): Promise<RuntimePersistenceResult> {
  persistJsonLocal(MATURITY_HANDOFF_STORAGE_KEY, handoff);

  return persistWithSupabase('maturity-handoff', (client, userId) =>
    client.from('isms_maturity_handoffs').insert({
      user_id: userId,
      organisation_name: handoff.organisationName,
      sector: handoff.sector,
      primary_goal: handoff.primaryGoal,
      responsible_person: handoff.responsiblePerson,
      source: handoff.source,
      created_at: handoff.createdAt,
    }),
  );
}

export async function persistEntitlementState(
  entitlement: EntitlementState,
): Promise<RuntimePersistenceResult> {
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
