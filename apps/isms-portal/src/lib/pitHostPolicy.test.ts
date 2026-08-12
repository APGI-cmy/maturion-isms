import { describe, expect, it } from 'vitest';
import { CANONICAL_ISMS_HOST, PIT_DEPLOYMENT_HOST, createCanonicalIsmsUrl, isPitDeploymentHost, isPitPreviewDeploymentHost, shouldRedirectPitDeploymentHost } from './pitHostPolicy';

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

  it('does not classify preview deployments as the stable PIT deployment host', () => {
    expect(isPitPreviewDeploymentHost('maturion-pit-git-copilot-pit-w83-pre-021a53-rassie-ras-projects.vercel.app')).toBe(true);
    expect(isPitPreviewDeploymentHost(PIT_DEPLOYMENT_HOST)).toBe(false);
  });

  it('redirects only the stable PIT deployment host', () => {
    expect(shouldRedirectPitDeploymentHost({
      hostname: PIT_DEPLOYMENT_HOST,
      pathname: '/pit',
      search: '',
      hash: '',
    })).toBe(true);

    expect(shouldRedirectPitDeploymentHost({
      hostname: 'maturion-pit-git-copilot-pit-w83-pre-021a53-rassie-ras-projects.vercel.app',
      pathname: '/pit',
      search: '',
      hash: '',
    })).toBe(false);
  });
});
