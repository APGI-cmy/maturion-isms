import { describe, expect, it } from 'vitest';
import { evaluatePitAccess, PIT_W8_2_ADMIN_ROLES } from './pitAccess';

const target = {
  orgId: 'org-a',
  allowedRoles: PIT_W8_2_ADMIN_ROLES,
};

describe('PIT W8.2 access decision helper', () => {
  it('denies missing actor context as unauthenticated', () => {
    expect(evaluatePitAccess({ userId: null, orgId: null, role: null }, target)).toEqual({
      allowed: false,
      reason: 'unauthenticated',
    });
  });

  it('denies cross-organisation access before role evaluation', () => {
    expect(evaluatePitAccess({ userId: 'user-1', orgId: 'org-b', role: 'platform_admin' }, target)).toEqual({
      allowed: false,
      reason: 'cross_org_denied',
    });
  });

  it('denies same-org actors without an admin role', () => {
    expect(evaluatePitAccess({ userId: 'user-1', orgId: 'org-a', role: 'member' }, target)).toEqual({
      allowed: false,
      reason: 'role_denied',
    });
  });

  it('allows same-org org admins', () => {
    expect(evaluatePitAccess({ userId: 'user-1', orgId: 'org-a', role: 'org_admin' }, target)).toEqual({
      allowed: true,
      reason: 'allowed',
    });
  });
});
