export const MMM_APP_URL = 'https://maturion-isms-mmm.vercel.app';

export function isExternalModuleRoute(route: string): boolean {
  return /^https?:\/\//i.test(route);
}

export function openModuleRoute(route: string): void {
  if (isExternalModuleRoute(route)) {
    window.location.assign(route);
    return;
  }

  window.location.assign(route);
}
