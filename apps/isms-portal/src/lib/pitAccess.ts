export type PitRole = 'viewer' | 'member' | 'org_admin' | 'platform_admin';

export type PitAccessActor = {
  userId: string | null;
  orgId: string | null;
  role: PitRole | null;
};

export type PitAccessTarget = {
  orgId: string;
  allowedRoles: readonly PitRole[];
};

export type PitAccessDecision =
  | { allowed: true; reason: 'allowed' }
  | { allowed: false; reason: 'unauthenticated' | 'cross_org_denied' | 'role_denied' };

export const PIT_W8_2_ADMIN_ROLES = ['org_admin', 'platform_admin'] as const satisfies readonly PitRole[];

export function evaluatePitAccess(actor: PitAccessActor, target: PitAccessTarget): PitAccessDecision {
  if (!actor.userId || !actor.orgId || !actor.role) {
    return { allowed: false, reason: 'unauthenticated' };
  }

  if (actor.orgId !== target.orgId) {
    return { allowed: false, reason: 'cross_org_denied' };
  }

  if (!target.allowedRoles.includes(actor.role)) {
    return { allowed: false, reason: 'role_denied' };
  }

  return { allowed: true, reason: 'allowed' };
}
