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
}

export const ismsPersistenceBoundary: PersistenceBoundaryRecord[] = [
  {
    capability: 'free-assessment',
    tableName: 'isms_assessments',
    runtimeStatus: 'schema_registered_only',
    requiresAuthenticatedUser: true,
    auditRequired: true,
  },
  {
    capability: 'onboarding-profile',
    tableName: 'isms_onboarding_profiles',
    runtimeStatus: 'schema_registered_only',
    requiresAuthenticatedUser: true,
    auditRequired: true,
  },
  {
    capability: 'entitlement-state',
    tableName: 'isms_entitlements',
    runtimeStatus: 'schema_registered_only',
    requiresAuthenticatedUser: true,
    auditRequired: true,
  },
  {
    capability: 'maturity-handoff',
    tableName: 'isms_maturity_handoffs',
    runtimeStatus: 'schema_registered_only',
    requiresAuthenticatedUser: true,
    auditRequired: true,
  },
  {
    capability: 'audit-event',
    tableName: 'isms_audit_events',
    runtimeStatus: 'schema_registered_only',
    requiresAuthenticatedUser: true,
    auditRequired: false,
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
