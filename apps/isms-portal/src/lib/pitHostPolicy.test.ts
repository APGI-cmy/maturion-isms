import { describe, expect, it } from 'vitest';
import {
  CANONICAL_ISMS_HOST,
  createCanonicalIsmsUrl,
  isPitDeploymentHost,
  shouldRedirectPitDeploymentHost,
} from './pitHostPolicy';

describe('PIT deployment host policy', () => {
  it('identifies the PIT deployment host as non-canonical', () => {
    expect(isPitDeploymentHost('maturion-pit.vercel.app')).toBe(true);
    expect(isPitDeploymentHost(CANONICAL_ISMS_HOST)).toBe(false);
  });

  it('requires redirect for PIT deployment host requests', () => {
    expect(
      shouldRedirectPitDeploymentHost({
        hostname: 'maturion-pit.vercel.app',
        pathname: '/',
        search: '',
        hash: '',
      }),
    ).toBe(true);
  });

  it('does not redirect canonical ISMS host requests', () => {
    expect(
      shouldRedirectPitDeploymentHost({
        hostname: CANONICAL_ISMS_HOST,
        pathname: '/pit/tracker',
        search: '',
        hash: '',
      }),
    ).toBe(false);
  });

  it('preserves path, query string, and hash when creating the canonical ISMS URL', () => {
    expect(
      createCanonicalIsmsUrl({
        hostname: 'maturion-pit.vercel.app',
        pathname: '/pit/tracker',
        search: '?source=direct-pit-tracker',
        hash: '#runtime',
      }),
    ).toBe('https://maturion-isms-portal.vercel.app/pit/tracker?source=direct-pit-tracker#runtime');
  });
});
