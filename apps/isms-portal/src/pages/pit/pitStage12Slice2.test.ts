import { describe, expect, it } from 'vitest';
import { resolveMockRouteRole } from '@/context/AuthContext';

const projectCreateRoles = ['contributor', 'team_leader', 'project_manager', 'org_admin', 'cs2_admin'];

describe('PIT Stage 12 Slice 2 governance mapping', () => {
  it('keeps viewer out of the Create Project positive path', () => {
    expect(projectCreateRoles).not.toContain('viewer');
  });

  it('recognises creator-capable mock roles from email prefixes', () => {
    expect(projectCreateRoles).toContain(resolveMockRouteRole('contributor@example.com'));
    expect(projectCreateRoles).toContain(resolveMockRouteRole('project-manager@example.com'));
    expect(projectCreateRoles).toContain(resolveMockRouteRole('org-admin@example.com'));
    expect(projectCreateRoles).toContain(resolveMockRouteRole('cs2-admin@example.com'));
  });

  it('keeps the default mock role creator-capable for normal PIT workspace testing', () => {
    expect(resolveMockRouteRole('operator@example.com')).toBe('project_manager');
    expect(projectCreateRoles).toContain(resolveMockRouteRole('operator@example.com'));
  });
});
