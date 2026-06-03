import { describe, expect, it } from 'vitest';
import { ROUTES } from '@/lib/routes';
import { getAuthRedirectTarget } from './ProtectedRoute';

describe('PIT Stage 12 W8.1 protected route redirect contract', () => {
  it('redirects unauthenticated protected route access to canonical login', () => {
    const redirect = getAuthRedirectTarget({ pathname: ROUTES.DASHBOARD, search: '', hash: '' });

    expect(redirect.to).toBe(ROUTES.LOGIN);
    expect(redirect.from).toBe(ROUTES.DASHBOARD);
  });

  it('preserves query string and hash for intended-destination restoration', () => {
    const redirect = getAuthRedirectTarget({
      pathname: ROUTES.PROJECTS,
      search: '?tab=active',
      hash: '#section-2',
    });

    expect(redirect).toEqual({
      to: ROUTES.LOGIN,
      from: `${ROUTES.PROJECTS}?tab=active#section-2`,
    });
  });

  it('covers all protected W8.1 route destinations', () => {
    const protectedRoutes = [ROUTES.DASHBOARD, ROUTES.PROJECTS, ROUTES.PROJECTS_NEW, ROUTES.ONBOARDING];

    expect(
      protectedRoutes.map((path) => getAuthRedirectTarget({ pathname: path, search: '', hash: '' })),
    ).toEqual([
      { to: ROUTES.LOGIN, from: ROUTES.DASHBOARD },
      { to: ROUTES.LOGIN, from: ROUTES.PROJECTS },
      { to: ROUTES.LOGIN, from: ROUTES.PROJECTS_NEW },
      { to: ROUTES.LOGIN, from: ROUTES.ONBOARDING },
    ]);
  });
});
