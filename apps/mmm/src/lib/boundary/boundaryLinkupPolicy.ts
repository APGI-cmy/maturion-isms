export { BOUNDARY_POLICY_ACTIVE, MODULE_BOUNDARY_OWNERS } from './boundaryConstants';

const freeAssessmentRoute = ['', 'free-assessment'].join('/');
const marketingRoute = ['', 'marketing', 'maturity-roadmap'].join('/');

export function resolveMmmPublicEntry(input: unknown) {
  const record = input && typeof input === 'object' ? input as Record<string, unknown> : {};
  if (record.intent === 'start-free-assessment') {
    return { ownerModule: 'ISMS', routeType: 'approved-assessment-entry', targetRoute: freeAssessmentRoute };
  }
  return { ownerModule: 'ISMS', routeType: 'public-marketing-route', targetRoute: marketingRoute };
}

export function assertFreeAssessmentOwnership(input: unknown) {
  const record = input && typeof input === 'object' ? input as Record<string, unknown> : {};
  const ownerModule = typeof record.ownerModule === 'string' ? record.ownerModule : '';
  if (ownerModule === 'ISMS') return { allowed: true, requiredOwnerModule: 'ISMS' };
  if (record.cs2Delegated === true) return { allowed: true, requiredOwnerModule: ownerModule, delegatedBy: 'CS2' };
  return { allowed: false, requiredOwnerModule: 'ISMS', reason: 'public_free_assessment_is_isms_owned' };
}
