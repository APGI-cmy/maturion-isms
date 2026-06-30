import { describe, expect, it } from 'vitest';
import { resolveMockRouteRole } from '@/context/AuthContext';
import { PIT_PROJECT_CREATE_ROLES, canCreatePitProject } from '@/lib/pitRoles';

describe('PIT Stage 12 Slice 2 governance mapping', () => {
  it('keeps viewer out of the Create Project positive path', () => {
    expect(PIT_PROJECT_CREATE_ROLES).not.toContain('viewer');
    expect(canCreatePitProject('viewer')).toBe(false);
  });

  it('recognises creator-capable mock roles from email prefixes', () => {
    expect(canCreatePitProject(resolveMockRouteRole('contributor@example.com'))).toBe(true);
    expect(canCreatePitProject(resolveMockRouteRole('project-manager@example.com'))).toBe(true);
    expect(canCreatePitProject(resolveMockRouteRole('org-admin@example.com'))).toBe(true);
    expect(canCreatePitProject(resolveMockRouteRole('cs2-admin@example.com'))).toBe(true);
  });

  it('keeps the default mock role creator-capable for normal PIT workspace testing', () => {
    expect(resolveMockRouteRole('operator@example.com')).toBe('project_manager');
    expect(canCreatePitProject(resolveMockRouteRole('operator@example.com'))).toBe(true);
  });
});
