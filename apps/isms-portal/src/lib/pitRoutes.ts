import { ROUTES } from './routes';

export type PitRouteAccess = 'public' | 'protected';

export interface PitStage12RouteDefinition {
  readonly id: string;
  readonly path: string;
  readonly label: string;
  readonly access: PitRouteAccess;
  readonly stage8Wave: 'W8.1';
}

export const PIT_STAGE12_W8_1_ROUTES: readonly PitStage12RouteDefinition[] = [
  { id: 'pit-route-home', path: ROUTES.HOME, label: 'ISMS public landing', access: 'public', stage8Wave: 'W8.1' },
  { id: 'pit-route-login', path: ROUTES.LOGIN, label: 'Login', access: 'public', stage8Wave: 'W8.1' },
  { id: 'pit-route-signup', path: ROUTES.SIGNUP, label: 'Signup', access: 'public', stage8Wave: 'W8.1' },
  { id: 'pit-route-forgot-password', path: ROUTES.FORGOT_PASSWORD, label: 'Forgot password', access: 'public', stage8Wave: 'W8.1' },
  { id: 'pit-route-reset-password', path: ROUTES.RESET_PASSWORD, label: 'Reset password', access: 'public', stage8Wave: 'W8.1' },
  { id: 'pit-route-invite', path: ROUTES.INVITE, label: 'Invitation acceptance', access: 'public', stage8Wave: 'W8.1' },
  { id: 'pit-route-dashboard', path: ROUTES.DASHBOARD, label: 'PIT dashboard', access: 'protected', stage8Wave: 'W8.1' },
  { id: 'pit-route-projects', path: ROUTES.PROJECTS, label: 'PIT projects', access: 'protected', stage8Wave: 'W8.1' },
  { id: 'pit-route-projects-new', path: ROUTES.PROJECTS_NEW, label: 'Create PIT project', access: 'protected', stage8Wave: 'W8.1' },
  { id: 'pit-route-onboarding', path: ROUTES.ONBOARDING, label: 'PIT onboarding', access: 'protected', stage8Wave: 'W8.1' },
] as const;

export const PIT_STAGE12_W8_1_PUBLIC_ROUTES = PIT_STAGE12_W8_1_ROUTES.filter(
  (route) => route.access === 'public',
);

export const PIT_STAGE12_W8_1_PROTECTED_ROUTES = PIT_STAGE12_W8_1_ROUTES.filter(
  (route) => route.access === 'protected',
);
