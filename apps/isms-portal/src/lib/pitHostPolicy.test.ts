import { describe, expect, it } from 'vitest';
import { CANONICAL_ISMS_HOST, PIT_DEPLOYMENT_HOST, createCanonicalIsmsUrl, isPitDeploymentHost } from './pitHostPolicy';

describe('PIT deployment host policy', () => {
  it('recognises the PIT deployment host only', () => {
    expect(isPitDeploymentHost(PIT_DEPLOYMENT_HOST)).toBe(true);
    expect(isPitDeploymentHost(CANONICAL_ISMS_HOST)).toBe(false);
  });

  it('creates a canonical URL while preserving route details', () => {
    const result = createCanonicalIsmsUrl({
      hostname: PIT_DEPLOYMENT_HOST,
      pathname: '/pit/tracker',
      search: '?x=1',
      hash: '#runtime',
    });

    expect(result).toBe(`https://${CANONICAL_ISMS_HOST}/pit/tracker?x=1#runtime`);
  });
});
