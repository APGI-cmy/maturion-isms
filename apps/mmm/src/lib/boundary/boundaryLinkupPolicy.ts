export { BOUNDARY_POLICY_ACTIVE, MODULE_BOUNDARY_OWNERS } from './boundaryConstants';

const freeAssessmentRoute = ['', 'free-assessment'].join('/');
const marketingRoute = ['', 'marketing', 'maturity-roadmap'].join('/');
const roadmapRoute = ['', 'mmm', 'roadmap'].join('/');
const dashboardRoute = ['', 'dashboard'].join('/');
const allowedHostModels = ['redirect-only', 'deep-link-only', 'canonical-host-only', 'approved-standalone-runtime'] as const;
const roadmapIds = ['maturity-roadmap', 'MMM'] as const;

function asRecord(input: unknown): Record<string, unknown> {
  return input && typeof input === 'object' ? input as Record<string, unknown> : {};
}

export function resolveMmmPublicEntry(input: unknown) {
  const record = asRecord(input);
  if (record.intent === 'start-free-assessment') {
    return { ownerModule: 'ISMS', routeType: 'approved-assessment-entry', targetRoute: freeAssessmentRoute };
  }
  return { ownerModule: 'ISMS', routeType: 'public-marketing-route', targetRoute: marketingRoute };
}

export function assertFreeAssessmentOwnership(input: unknown) {
  const record = asRecord(input);
  const ownerModule = typeof record.ownerModule === 'string' ? record.ownerModule : '';
  if (ownerModule === 'ISMS') return { allowed: true, requiredOwnerModule: 'ISMS' };
  if (record.cs2Delegated === true) return { allowed: true, requiredOwnerModule: ownerModule, delegatedBy: 'CS2' };
  return { allowed: false, requiredOwnerModule: 'ISMS', reason: 'public_free_assessment_is_isms_owned' };
}

export function getDashboardMmmJourneyState(input: unknown) {
  const record = asRecord(input);
  const cards = Array.isArray(record.dashboardCards) ? record.dashboardCards : [];
  const card = cards.find((item) => roadmapIds.includes(asRecord(item).moduleId as typeof roadmapIds[number]));
  if (!card) return { moduleId: 'maturity-roadmap', entitlementState: 'missing', journeyState: 'not-visible' };
  const item = asRecord(card);
  return { moduleId: String(item.moduleId || 'maturity-roadmap'), entitlementState: String(item.entitlementState || ''), journeyState: String(item.journeyState || '') };
}

export function resolveEligibleMmmRuntimeEntry(input: unknown) {
  const record = asRecord(input);
  const targetRoute = typeof record.requestedRuntimeRoute === 'string' ? record.requestedRuntimeRoute : roadmapRoute;
  if (record.eligibility === 'eligible' && record.handoffState === 'approved') return { ownerModule: 'MMM', routeType: 'module-runtime', targetRoute, loopback: false };
  return { ownerModule: 'ISMS', routeType: 'handoff-required', targetRoute: dashboardRoute, loopback: true };
}

export function assertMmmHostPolicy(input: unknown) {
  const record = asRecord(input);
  const approvedHostModel = typeof record.approvedHostModel === 'string' ? record.approvedHostModel : '';
  if (!allowedHostModels.includes(approvedHostModel as typeof allowedHostModels[number])) return { allowed: false, reason: 'mmm_host_model_not_approved', allowedHostModels: [...allowedHostModels] };
  if (record.exposesAcquisitionLoop === true) return { allowed: false, reason: 'mmm_host_must_not_duplicate_public_acquisition', allowedHostModels: [...allowedHostModels] };
  return { allowed: true, hostModel: approvedHostModel };
}

export function assertNoOtherModuleRouteMutation(input: unknown) {
  const record = asRecord(input);
  const changedRoutes = Array.isArray(record.changedRoutes) ? record.changedRoutes.map(String) : [];
  const prohibitedRoutes = changedRoutes.filter((route) => route.startsWith('/pit') || route.startsWith('/risk') || route.startsWith('/radam'));
  if (prohibitedRoutes.length > 0 && record.crossModuleAppointment !== true) return { allowed: false, prohibitedRoutes, reason: 'mmm_wave_may_not_mutate_other_module_routes' };
  return { allowed: true, prohibitedRoutes: [] };
}

export function assertMmmIsNotPlatformShell(input: unknown) {
  const record = asRecord(input);
  const proposed = Array.isArray(record.proposedOwnedSurfaces) ? record.proposedOwnedSurfaces.map(String) : [];
  const prohibitedSet = new Set(['public-landing', 'modules-overview', 'dashboard']);
  const prohibitedSurfaces = proposed.filter((surface) => prohibitedSet.has(surface));
  if (prohibitedSurfaces.length > 0) return { allowed: false, prohibitedSurfaces, reason: 'mmm_must_not_become_isms_platform_shell' };
  return { allowed: true, prohibitedSurfaces: [] };
}
