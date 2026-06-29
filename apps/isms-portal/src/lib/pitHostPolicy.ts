export const CANONICAL_ISMS_HOST = 'maturion-isms-portal.vercel.app';
export const PIT_DEPLOYMENT_HOST = 'maturion-pit.vercel.app';

export interface HostPolicyLocation {
  hostname: string;
  pathname: string;
  search: string;
  hash: string;
}

export function isPitDeploymentHost(hostname: string): boolean {
  return hostname.toLowerCase() === PIT_DEPLOYMENT_HOST;
}

export function shouldRedirectPitDeploymentHost(location: HostPolicyLocation): boolean {
  return isPitDeploymentHost(location.hostname);
}

export function createCanonicalIsmsUrl(location: HostPolicyLocation): string {
  const pathname = location.pathname || '/';
  return `https://${CANONICAL_ISMS_HOST}${pathname}${location.search}${location.hash}`;
}
