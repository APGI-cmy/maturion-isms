import { describe, expect, it } from 'vitest';
import { ROUTES } from './routes';
import {
  PIT_STAGE12_W8_1_PROTECTED_ROUTES,
  PIT_STAGE12_W8_1_PUBLIC_ROUTES,
  PIT_STAGE12_W8_1_ROUTES,
} from './pitRoutes';

describe('PIT Stage 12 W8.1 route registry', () => {
  it('binds the W8.1 route registry to the expected public and protected route counts', () => {
    expect(PIT_STAGE12_W8_1_ROUTES).toHaveLength(10);
    expect(PIT_STAGE12_W8_1_PUBLIC_ROUTES).toHaveLength(6);
    expect(PIT_STAGE12_W8_1_PROTECTED_ROUTES).toHaveLength(4);
  });

  it('includes all W8.1 routes required by the Stage 8 implementation plan', () => {
    expect(PIT_STAGE12_W8_1_ROUTES.map((route) => route.path)).toEqual([
      ROUTES.HOME,
      ROUTES.LOGIN,
      ROUTES.SIGNUP,
      ROUTES.FORGOT_PASSWORD,
      ROUTES.RESET_PASSWORD,
      ROUTES.INVITE,
      ROUTES.DASHBOARD,
      ROUTES.PROJECTS,
      ROUTES.PROJECTS_NEW,
      ROUTES.ONBOARDING,
    ]);
  });

  it('keeps dashboard, projects, project creation, and onboarding protected', () => {
    expect(PIT_STAGE12_W8_1_PROTECTED_ROUTES.map((route) => route.path)).toEqual([
      ROUTES.DASHBOARD,
      ROUTES.PROJECTS,
      ROUTES.PROJECTS_NEW,
      ROUTES.ONBOARDING,
    ]);
  });

  it('does not include direct provider routing or non-W8.1 scope expansion', () => {
    expect(PIT_STAGE12_W8_1_ROUTES.every((route) => route.stage8Wave === 'W8.1')).toBe(true);
    expect(PIT_STAGE12_W8_1_ROUTES.some((route) => route.path.includes('openai'))).toBe(false);
    expect(PIT_STAGE12_W8_1_ROUTES.some((route) => route.path.includes('anthropic'))).toBe(false);
  });
});
