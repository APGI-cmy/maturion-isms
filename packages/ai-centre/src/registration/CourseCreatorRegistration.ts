/**
 * Issue #2075: inactive Course Creator specialist registration candidate.
 * This central AIMC entry never grants invocation or activates a provider.
 */
export const COURSE_CREATOR_REGISTRATION = Object.freeze({
  specialistId: 'course-creator-agent',
  personaId: 'course-creator-advisor',
  module: 'course-creator',
  domain: 'course-creation',
  reportingOrchestrator: 'maturion-agent',
  capability: 'document-generation',
  status: 'pending-commissioning',
  authorityIssue: 'https://github.com/APGI-cmy/maturion-isms/issues/2075',
  enabled: false,
  maturionReviewRequired: true,
  directUserResponse: false,
  legacyPersona: 'course-crafter-advisor',
  legacyRelationship: 'Separate legacy ISMS-specific persona; no alias or replacement.',
  activationBlockers: Object.freeze([
    'Independent final assurance on the submitted agent bundle',
    'Accepted authenticated Maturion specialist registry and controller route',
    'Verified tenant and authority binding before provider invocation',
    'Provider support for document-generation',
    'Bounded idempotent controller commissioning with retained QA and counters',
    'Maturion output-review receipt',
  ]),
} as const);

/** Read-only discovery, deliberately distinct from dispatch permission. */
export function discoverCourseCreatorRegistration() {
  return {
    ...COURSE_CREATOR_REGISTRATION,
    available: false as const,
    reason: 'AIMC_SPECIALIST_NOT_COMMISSIONED' as const,
  };
}
