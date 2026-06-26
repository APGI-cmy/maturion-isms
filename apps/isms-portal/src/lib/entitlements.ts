import { PENDING_CHECKOUT_STORAGE_KEY, type SubscriptionSelection } from './subscription';

export type IsmsModuleKey =
  | 'maturity-roadmap'
  | 'risk-management'
  | 'project-implementation'
  | 'data-analytics-assurance'
  | 'skills-development'
  | 'incident-intelligence'
  | 'systems-integration';

export interface EntitlementState {
  isBundle: boolean;
  entitledModules: IsmsModuleKey[];
  source: string | null;
  completedAt: string | null;
}

export const allIsmsModules: IsmsModuleKey[] = [
  'maturity-roadmap',
  'risk-management',
  'project-implementation',
  'data-analytics-assurance',
  'skills-development',
  'incident-intelligence',
  'systems-integration',
];

const moduleAliases: Record<string, IsmsModuleKey> = {
  maturity: 'maturity-roadmap',
  'maturity-roadmap': 'maturity-roadmap',
  'maturion-core-platform': 'maturity-roadmap',
  risk: 'risk-management',
  'risk-management': 'risk-management',
  pit: 'project-implementation',
  'project-implementation': 'project-implementation',
  analytics: 'data-analytics-assurance',
  'data-analytics': 'data-analytics-assurance',
  'data-analytics-assurance': 'data-analytics-assurance',
  skills: 'skills-development',
  'skills-development': 'skills-development',
  incidents: 'incident-intelligence',
  'incident-intelligence': 'incident-intelligence',
  integration: 'systems-integration',
  'systems-integration': 'systems-integration',
};

function normaliseModuleId(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function mapSubscriptionModule(value: string): IsmsModuleKey | null {
  const normalized = normaliseModuleId(value);
  return moduleAliases[normalized] ?? null;
}

export function createEntitlementState(selection: Partial<SubscriptionSelection> & { completedAt?: string | null } = {}): EntitlementState {
  const selectedModules = selection.selectedModules ?? [];
  const mappedModules = selectedModules
    .map(mapSubscriptionModule)
    .filter((moduleKey): moduleKey is IsmsModuleKey => Boolean(moduleKey));
  const uniqueModules = Array.from(new Set(mappedModules));

  return {
    isBundle: Boolean(selection.isBundle),
    entitledModules: Boolean(selection.isBundle) ? [...allIsmsModules] : uniqueModules,
    source: selection.source ?? null,
    completedAt: selection.completedAt ?? null,
  };
}

export function hasModuleEntitlement(state: EntitlementState, moduleKey: IsmsModuleKey): boolean {
  return state.isBundle || state.entitledModules.includes(moduleKey);
}

type StoredEntitlementReadOptions = {
  requireCompletedAt?: boolean;
};

export function readStoredEntitlementState(options: StoredEntitlementReadOptions = {}): EntitlementState {
  if (typeof window === 'undefined') return createEntitlementState();

  const stored = window.localStorage.getItem(PENDING_CHECKOUT_STORAGE_KEY);
  if (!stored) return createEntitlementState();

  try {
    const selection = JSON.parse(stored) as Partial<SubscriptionSelection> & { completedAt?: string | null };

    if (options.requireCompletedAt && !selection.completedAt) {
      return createEntitlementState();
    }

    return createEntitlementState(selection);
  } catch {
    window.localStorage.removeItem(PENDING_CHECKOUT_STORAGE_KEY);
    return createEntitlementState();
  }
}

export function readCompletedEntitlementState(): EntitlementState {
  return readStoredEntitlementState({ requireCompletedAt: true });
}
