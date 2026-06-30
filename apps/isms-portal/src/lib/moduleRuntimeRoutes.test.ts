import { describe, expect, it } from 'vitest';
import { MMM_APP_URL, isExternalModuleRoute } from './moduleRuntimeRoutes';

describe('module runtime routes', () => {
  it('defines MMM app as an external module runtime host', () => {
    expect(MMM_APP_URL).toBe('https://maturion-isms-mmm.vercel.app');
    expect(isExternalModuleRoute(MMM_APP_URL)).toBe(true);
  });

  it('keeps internal ISMS routes identifiable as non-external', () => {
    expect(isExternalModuleRoute('/marketing/maturity-roadmap')).toBe(false);
    expect(isExternalModuleRoute('/maturity/setup')).toBe(false);
  });
});
