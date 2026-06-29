export const CANONICAL_ISMS_HOST = 'maturion-isms-portal.vercel.app';
export const PIT_MODULE_HOST = 'maturion-pit.vercel.app';
export const CANONICAL_ISMS_ORIGIN = `https://${CANONICAL_ISMS_HOST}`;

export function isPitModuleHost(hostname: string): boolean {
  return hostname === PIT_MODULE_HOST;
}

export function buildCanonicalIsmsUrl(location: Pick<Location, 'pathname' | 'search' | 'hash'>): string {
  return `${CANONICAL_ISMS_ORIGIN}${location.pathname}${location.search}${location.hash}`;
}
