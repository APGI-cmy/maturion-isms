import { describe, expect, it } from 'vitest';
import { buildAskMaturionResponse, canUsePrivateAskContext } from './askMaturionAdapter';
import { createEntitlementState } from './entitlements';

describe('W5 Ask Maturion adapter', () => {
  const publicEntitlement = createEntitlementState();
  const entitledState = createEntitlementState({
    isBundle: false,
    selectedModules: ['maturity-roadmap'],
    source: 'dashboard',
    completedAt: '2026-06-10T00:00:00.000Z',
  });

  it('does not allow private context without authentication', () => {
    expect(canUsePrivateAskContext({
      isAuthenticated: false,
      moduleKey: 'maturity-roadmap',
      entitlement: entitledState,
    })).toBe(false);
  });

  it('does not allow private context without module entitlement', () => {
    expect(canUsePrivateAskContext({
      isAuthenticated: true,
      moduleKey: 'maturity-roadmap',
      entitlement: publicEntitlement,
    })).toBe(false);
  });

  it('allows filtered private context only when authenticated and entitled', () => {
    expect(canUsePrivateAskContext({
      isAuthenticated: true,
      moduleKey: 'maturity-roadmap',
      entitlement: entitledState,
    })).toBe(true);
  });

  it('returns educational public fallback when private context is unavailable', () => {
    const response = buildAskMaturionResponse({
      question: 'How do we improve resilience?',
      context: {
        isAuthenticated: false,
        moduleKey: 'maturity-roadmap',
        entitlement: publicEntitlement,
      },
    });

    expect(response.audience).toBe('public');
    expect(response.allowedPrivateContext).toBe(false);
    expect(response.fallback).toBe(true);
    expect(response.answer).toContain('Educational response');
    expect(response.answer).not.toContain('Filtered context');
  });

  it('returns entitled-context fallback with filtered context when allowed', () => {
    const response = buildAskMaturionResponse({
      question: 'What is the next maturity step?',
      context: {
        isAuthenticated: true,
        moduleKey: 'maturity-roadmap',
        entitlement: entitledState,
        organisationName: 'Example Mine',
        sector: 'diamond mining',
        primaryGoal: 'Improve chain of custody',
      },
    });

    expect(response.audience).toBe('authenticated');
    expect(response.allowedPrivateContext).toBe(true);
    expect(response.fallback).toBe(true);
    expect(response.answer).toContain('Filtered context');
    expect(response.answer).toContain('Example Mine');
  });

  it('handles empty questions without live provider calls', () => {
    const response = buildAskMaturionResponse({
      question: '   ',
      context: {
        isAuthenticated: true,
        moduleKey: 'maturity-roadmap',
        entitlement: entitledState,
      },
    });

    expect(response.fallback).toBe(true);
    expect(response.answer).toContain('needs a question');
  });
});
