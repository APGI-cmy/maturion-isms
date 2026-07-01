export const MMM_APP_URL = 'https://maturion-isms-mmm.vercel.app';

export function isExternalModuleRoute(route: string): boolean {
  return /^https?:\/\//i.test(route);
}
