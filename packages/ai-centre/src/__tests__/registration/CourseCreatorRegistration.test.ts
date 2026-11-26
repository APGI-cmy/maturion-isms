import { describe, expect, it, vi } from 'vitest';
import { COURSE_CREATOR_REGISTRATION, discoverCourseCreatorRegistration } from '../../registration/CourseCreatorRegistration.js';
import { AICentre } from '../../gateway/AICentre.js';
import { Capability, AICentreErrorCode, type AICentreConfig } from '../../types/index.js';

describe('Course Creator registration candidate (#2075)', () => {
  it('binds one specialist/persona identity to Maturion without replacing the legacy persona', () => {
    expect(COURSE_CREATOR_REGISTRATION.specialistId).toBe('course-creator-agent');
    expect(COURSE_CREATOR_REGISTRATION.personaId).toBe('course-creator-advisor');
    expect(COURSE_CREATOR_REGISTRATION.reportingOrchestrator).toBe('maturion-agent');
    expect(COURSE_CREATOR_REGISTRATION.legacyPersona).toBe('course-crafter-advisor');
  });
  it('cannot turn registration discovery into activation or an owner-ready result', () => {
    const record = discoverCourseCreatorRegistration();
    expect(record.enabled).toBe(false);
    expect(record.available).toBe(false);
    expect(record.reason).toBe('AIMC_SPECIALIST_NOT_COMMISSIONED');
    expect(record.directUserResponse).toBe(false);
    expect(record.maturionReviewRequired).toBe(true);
    expect(record.activationBlockers.length).toBeGreaterThan(0);
    expect(record).not.toHaveProperty('ownerApproved');
  });
  it('keeps registration data immutable and never contains provider credentials', () => {
    expect(Object.isFrozen(COURSE_CREATOR_REGISTRATION)).toBe(true);
    expect(Object.isFrozen(COURSE_CREATOR_REGISTRATION.activationBlockers)).toBe(true);
    expect(JSON.stringify(COURSE_CREATOR_REGISTRATION)).not.toMatch(/sk-[A-Za-z0-9]|service_role_key|Bearer /);
  });
  it.each([Capability.ADVISORY, Capability.DOCUMENT_GENERATION])('blocks direct gateway persona invocation for %s before any model call', async capability => {
    const load = vi.fn();const execute = vi.fn();
    const config = {
      routing: { routes: {} },
      telemetryWriter: { write: vi.fn().mockResolvedValue('fixture-telemetry') },
      personaLoader: { load }, adapters: [{ execute }],
    } as unknown as AICentreConfig;
    const gateway = new AICentre(config);
    const result = await gateway.request({ capability, agent: 'course-creator-advisor', input: { text: 'Fixture only.' }, context: { organisationId: 'fixture-org' } });
    expect(result).toHaveProperty('errorCode', AICentreErrorCode.UNKNOWN_AGENT);
    expect(result).toHaveProperty('retryable', false);
    expect(load).not.toHaveBeenCalled();expect(execute).not.toHaveBeenCalled();
  });
});
