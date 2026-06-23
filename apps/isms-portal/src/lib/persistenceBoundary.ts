export type PersistenceCapability =
  | 'free-assessment'
  | 'onboarding-profile'
  | 'entitlement-state'
  | 'maturity-handoff'
  | 'audit-event';

export interface PersistenceBoundaryRecord {
  capability: PersistenceCapability;
  tableName: string;
  runtimeStatus: 'schema_registered_only' | 'client_hook_ready' | 'disabled';
  requiresAuthenticatedUser: boolean;
  auditRequired: boolean;
  runtimeNotes: string;
}

export const ismsPersistenceBoundary: PersistenceBoundaryRecord[] = [
  {
    capability: 'free-assessment',
    tableName: 'isms_assessments',
    runtimeStatus: 'schema_registered_only',
    requiresAuthenticatedUser: true,
    auditRequired: true,
    runtimeNotes: 'Free-assessment persistence remains schema-only until a public/anonymous assessment storage policy is appointed.',
  },
  {
    capability: 'onboarding-profile',
    tableName: 'isms_onboarding_profiles',
    runtimeStatus: 'client_hook_ready',
    requiresAuthenticatedUser: true,
    auditRequired: true,
    runtimeNotes: 'P2 adds a client persistence hook with local fallback and Supabase write when a real Supabase auth user is available.',
  },
  {
    capability: 'entitlement-state',
    tableName: 'isms_entitlements',
    runtimeStatus: 'schema_registered_only',
    requiresAuthenticatedUser: true,
    auditRequired: true,
    runtimeNotes: 'Entitlement writes remain blocked because production entitlement authority is not appointed and W6 RLS exposes select-only entitlement policy.',
  },
  {
    capability: 'maturity-handoff',
    tableName: 'isms_maturity_handoffs',
    runtimeStatus: 'client_hook_ready',
    requiresAuthenticatedUser: true,
    auditRequired: true,
    runtimeNotes: 'P2 adds a client persistence hook with local fallback and Supabase write when a real Supabase auth user is available.',
  },
  {
    capability: 'audit-event',
    tableName: 'isms_audit_events',
    runtimeStatus: 'schema_registered_only',
    requiresAuthenticatedUser: true,
    auditRequired: false,
    runtimeNotes: 'Audit writer invocation remains future-gated and is not introduced by P2.',
  },
];

export function getPersistenceBoundary(capability: PersistenceCapability): PersistenceBoundaryRecord {
  const boundary = ismsPersistenceBoundary.find((record) => record.capability === capability);

  if (!boundary) {
    throw new Error(`Unregistered ISMS persistence capability: ${capability}`);
  }

  return boundary;
}

export function assertPersistenceCapabilityRegistered(capability: PersistenceCapability): void {
  getPersistenceBoundary(capability);
}
