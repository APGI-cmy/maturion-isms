import type { MockRouteRole } from '@/context/AuthContext';

export const PIT_PROJECT_CREATE_ROLES: MockRouteRole[] = [
  'contributor',
  'team_leader',
  'project_manager',
  'org_admin',
  'cs2_admin',
];

export function canCreatePitProject(role: MockRouteRole): boolean {
  return PIT_PROJECT_CREATE_ROLES.includes(role);
}
